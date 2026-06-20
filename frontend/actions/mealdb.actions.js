"use server";

const MEALDB_BASE = "https://www.themealdb.com/api/json/v1/1";

const SUPPORTED_CUISINE_COUNTRIES = {
  Afghan: "Afghanistan",
  Albanian: "Albania",
  Algerian: "Algeria",
  Andorran: "Andorra",
  Angolan: "Angola",
  "Antiguan, Barbudan": "Antigua and Barbuda",
  Argentine: "Argentina",
  Armenian: "Armenia",
  Aruban: "Aruba",
  Australian: "Australia",
  Austrian: "Austria",
  Azerbaijani: "Azerbaijan",
  Bahamian: "Bahamas",
  Bangladeshi: "Bangladesh",
  Barbadian: "Barbados",
  Cambodian: "Cambodia",
  Canadian: "Canada",
  Chinese: "China",
  Croatian: "Croatia",
  Egyptian: "Egypt",
  French: "France",
  Greek: "Greece",
  Indian: "India",
  Irish: "Ireland",
  Italian: "Italy",
  Jamaican: "Jamaica",
  Japanese: "Japan",
  Kenyan: "Kenya",
  Laotian: "Laos",
  Malaysian: "Malaysia",
  Mexican: "Mexico",
  Moroccan: "Morocco",
  Dutch: "Netherlands",
  Norwegian: "Norway",
  Filipino: "Philippines",
  Polish: "Poland",
  Portuguese: "Portugal",
  Russian: "Russia",
  "Saudi Arabian": "Saudi Arabia",
  Slovak: "Slovakia",
  Spanish: "Spain",
  Syrian: "Syria",
  Thai: "Thailand",
  Tunisian: "Tunisia",
  Turkish: "Turkey",
  Ukrainian: "Ukraine",
  British: "United Kingdom",
  American: "United States",
  Uruguayan: "Uruguay",
  Venezuelan: "Venezuela",
  Vietnamese: "Vietnam",
};

const getCuisineFilterCandidates = (area) => {
  const formattedArea = area?.trim();
  const supportedCountry = SUPPORTED_CUISINE_COUNTRIES[formattedArea];

  return Array.from(
    new Set([supportedCountry, formattedArea].filter(Boolean))
  );
};

// Get random recipe of the day
export async function getRecipeOfTheDay() {
  try {
    const response = await fetch(`${MEALDB_BASE}/random.php`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recipe of the day");
    }

    const data = await response.json();
    return {
      success: true,
      recipe: data.meals[0],
    };
  } catch (error) {
    console.error("Error fetching recipe of the day:", error);
    throw new Error(error.message || "Failed to load recipe");
  }
}

// Get all categories
export async function getCategories() {
  try {
    const response = await fetch(`${MEALDB_BASE}/list.php?c=list`, {
      next: { revalidate: 604800 }, // Cache for 1 week (categories rarely change)
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return {
      success: true,
      categories: data.meals || [],
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error.message || "Failed to load categories");
  }
}

// Get all areas/cuisines
export async function getAreas() {
  try {
    const response = await fetch(`${MEALDB_BASE}/list.php?a=list`, {
      next: { revalidate: 604800 }, // Cache for 1 week
    });

    if (!response.ok) {
      throw new Error("Failed to fetch areas");
    }

    const data = await response.json();
    return {
      success: true,
      areas: (data.meals || [])
        .map((area) => {
          const strArea = area.strArea?.trim();
          const filterArea = SUPPORTED_CUISINE_COUNTRIES[strArea];

          if (!strArea || !filterArea) {
            return null;
          }

          return {
            ...area,
            strArea,
            strCountry: area.strCountry?.trim() || filterArea,
            filterArea,
          };
        })
        .filter(Boolean),
    };
  } catch (error) {
    console.error("Error fetching areas:", error);
    throw new Error(error.message || "Failed to load areas");
  }
}

// Get meals by category
export async function getMealsByCategory(category) {
  try {
    const response = await fetch(
      `${MEALDB_BASE}/filter.php?c=${encodeURIComponent(category)}`,
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch meals");
    }

    const data = await response.json();
    return {
      success: true,
      meals: data.meals || [],
      category,
    };
  } catch (error) {
    console.error("Error fetching meals by category:", error);
    throw new Error(error.message || "Failed to load meals");
  }
}

// Get meals by area
export async function getMealsByArea(area) {
  try {
    let data = { meals: [] };

    for (const filterArea of getCuisineFilterCandidates(area)) {
      const response = await fetch(
        `${MEALDB_BASE}/filter.php?a=${encodeURIComponent(filterArea)}`,
        {
          next: { revalidate: 86400 }, // Cache for 24 hours
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch meals");
      }

      data = await response.json();

      if (data.meals?.length) {
        break;
      }
    }

    return {
      success: true,
      meals: data.meals || [],
      area,
    };
  } catch (error) {
    console.error("Error fetching meals by area:", error);
    throw new Error(error.message || "Failed to load meals");
  }
}
