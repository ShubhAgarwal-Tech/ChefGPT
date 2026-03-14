"use server";

import { checkUser } from "@/lib/checkUser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { freePantryScans, proTierLimit } from "@/lib/arcjet";
import { request } from "@arcjet/next";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Scan image with Gemini Vision
export async function scanPantryImage(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      return {
        success: false,
        message: "Please sign in again.",
      };
    }

    // Check if user is Pro
    const isPro = user.subscriptionTier === "pro";

    // Apply Arcjet rate limit based on tier
    const arcjetClient = isPro ? proTierLimit : freePantryScans;

    // Create a request object for Arcjet
    const req = await request();

    const decision = await arcjetClient.protect(req, {
      userId: user.clerkId, // Use clerkId from checkUser
      requested: 1, // Request 1 token from bucket
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          success: false,
          message: isPro
            ? "Monthly scan limit reached. Please contact support."
            : "Free plan scan limit reached. Upgrade to Pro.",
        };
      }

      return {
        success: false,
        message: "Request denied by security system.",
      };
    }

    const imageFile = formData.get("image");
    if (!imageFile) {
      return {
    success: false,
    message: "Please upload an image.",
  };
    }

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Call Gemini Vision API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
You are a professional chef and ingredient recognition expert. Analyze this image of a pantry/fridge and identify all visible food ingredients.

Return ONLY a valid JSON array with this exact structure (no markdown, no explanations):
[
  {
    "name": "ingredient name",
    "quantity": "estimated quantity with unit",
    "confidence": 0.95
  }
]

Rules:
- Only identify food ingredients (not containers, utensils, or packaging)
- Be specific (e.g., "Cheddar Cheese" not just "Cheese")
- Estimate realistic quantities (e.g., "3 eggs", "1 cup milk", "2 tomatoes")
- Confidence should be 0.7-1.0 (omit items below 0.7)
- Maximum 20 items
- Common pantry staples are acceptable (salt, pepper, oil)
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageFile.type,
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let ingredients;
    try {
      const cleanText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      ingredients = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      return {
  success: false,
  message: "AI could not read the image clearly. Try another photo.",
};
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return {
        success: false,
        message:
          "No ingredients detected in image. Please give the clear picture.",
      };
    }

    return {
      success: true,
      ingredients: ingredients.slice(0, 20),
      scansLimit: isPro ? "unlimited" : 10,
      message: `Found ${ingredients.length} ingredients!`,
    };
  } catch (error) {
    console.error("Error scanning pantry:", error);
    return {
      success: false,
      message: "Failed to scan image. Please try again.",
    };
  }
}

// Save ingredients to pantry
export async function saveToPantry(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      return {
        success: false,
        message: "Please sign in again.",
      };
    }

    const ingredientsJson = formData.get("ingredients");
    const ingredients = JSON.parse(ingredientsJson);

    if (!ingredients || ingredients.length === 0) {
      return {
    success: false,
    message: "No ingredients detected to save.",
  };
    }

    // Create pantry items in Strapi
    const savedItems = [];
    for (const ingredient of ingredients) {
      const response = await fetch(`${STRAPI_URL}/api/pantry-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            name: ingredient.name,
            quantity: ingredient.quantity,
            imageUrl: "",
            owner: user.id,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        savedItems.push(data.data);
      }
    }

    return {
      success: true,
      savedItems,
      message: `Saved ${savedItems.length} items to your pantry!`,
    };
  } catch (error) {
    console.error("Error saving to pantry:", error);
    return {
      success: false,
      message: "Failed to save items.",
    };
  }
}

// Add pantry item manually
export async function addPantryItemManually(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      return {
        success: false,
        message: "Please sign in again.",
      };
    }

    const name = formData.get("name");
    const quantity = formData.get("quantity");

    if (!name || !quantity) {
      throw new Error("Name and quantity are required");
    }

    const response = await fetch(`${STRAPI_URL}/api/pantry-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          name: name.trim(),
          quantity: quantity.trim(),
          imageUrl: "",
          owner: user.id,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to add item:", errorText);
      return {
        success: false,
        message: "Failed to add items to pantry. Please try again.",
      };
    }

    const data = await response.json();

    return {
      success: true,
      item: data.data,
      message: "Item added successfully!",
    };
  } catch (error) {
    console.error("Error adding item manually:", error);
    return {
      success: false,
      message: "Failed to add item. Please try again.",
    };
  }
}

// Get user's pantry items
export async function getPantryItems() {
  try {
    const user = await checkUser();
    if (!user) {
      return {
        success: false,
        message: "Please sign in again.",
      };
    }

    const response = await fetch(
      `${STRAPI_URL}/api/pantry-items?filters[owner][id][$eq]=${user.id}&sort=createdAt:desc`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        success: false,
        message: "Failed to fetch pantry items.",
      };
    }

    const data = await response.json();

    const isPro = user.subscriptionTier === "pro";

    return {
      success: true,
      items: data.data || [],
      scansLimit: isPro ? "unlimited" : 10,
    };
  } catch (error) {
    console.error("Error fetching pantry:", error);
    return {
      success: false,
      message: "Failed to load pantry.",
    };
  }
}

// Delete pantry item
export async function deletePantryItem(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      return {
        success: false,
        message: "Please sign in again.",
      };
    }

    const itemId = formData.get("itemId");

    const response = await fetch(`${STRAPI_URL}/api/pantry-items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      return {
    success: false,
    message: "Failed to delete item. Please try again.",
  };
    }

    return {
      success: true,
      message: "Item removed from pantry",
    };
  } catch (error) {
    console.error("Error deleting item:", error);
    return {
    success: false,
    message: "Failed to delete item. Please try again.",
  };
  }
}

// Update pantry item
export async function updatePantryItem(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      return {
        success: false,
        message: "Please sign in again.",
      };
    }

    const itemId = formData.get("itemId");
    const name = formData.get("name");
    const quantity = formData.get("quantity");

    const response = await fetch(`${STRAPI_URL}/api/pantry-items/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          name,
          quantity,
        },
      }),
    });

    if (!response.ok) {
      return {
    success: false,
    message: "Failed to update item. Please try again.",
  };
    }

    const data = await response.json();

    return {
      success: true,
      item: data.data,
      message: "Item updated successfully",
    };
  } catch (error) {
    console.error("Error updating item:", error);
    return {
    success: false,
    message: "Failed to update item. Please try again.",
  };
  }
}
