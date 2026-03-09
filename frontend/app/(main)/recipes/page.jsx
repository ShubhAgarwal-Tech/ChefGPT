"use client";

import { useEffect, useState } from "react";
import { Bookmark, Loader2, ChefHat, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import {
  getSavedRecipes,
  removeRecipeFromCollection,
} from "@/actions/recipe.actions";
import RecipeCard from "@/components/RecipeCard";

export default function SavedRecipesPage() {
  const {
    loading,
    data: recipesData,
    fn: fetchSavedRecipes,
  } = useFetch(getSavedRecipes);

  const { loading: removing, fn: removeRecipe } = useFetch(
    removeRecipeFromCollection,
  );

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  useEffect(() => {
    if (recipesData?.recipes) {
      setRecipes(recipesData.recipes);
    }
  }, [recipesData]);

  const handleDelete = async (savedRecipeId) => {
    // optimistic UI update (remove immediately)
    setRecipes((prev) =>
      prev.filter(
        (recipe) => String(recipe.savedRecipeId) !== String(savedRecipeId),
      ),
    );

    const formData = new FormData();
    formData.append("savedRecipeId", savedRecipeId);

    await removeRecipe(formData);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-1 mb-8">
          <Bookmark className="w-25 h-25 text-orange-600 " />
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-stone-900 tracking-tight leading-tight">
              My Saved Recipes
            </h1>
            <p className="text-stone-600">
              Your personal collection of favorite recipes
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-6" />
            <p className="text-stone-600">Loading your saved recipes...</p>
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && recipes.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe.savedRecipeId} className="relative group">
                <RecipeCard recipe={recipe} variant="list" />

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(recipe.savedRecipeId)}
                  disabled={removing}
                  className="absolute top-3 right-3 bg-white/90 border border-stone-200 p-2 rounded-lg shadow-sm hover:bg-red-50 transition disabled:opacity-50"
                >
                  {removing ? (
                    <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-red-600" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-stone-200">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">
              No Saved Recipes Yet
            </h3>
            <p className="text-stone-600 mb-8 max-w-md mx-auto">
              Start exploring recipes and save your favorites to build your
              personal cookbook!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                  <ChefHat className="w-4 h-4" />
                  Explore Recipes
                </Button>
              </Link>
              <Link href="/pantry">
                <Button variant="outline" className="border-stone-300 gap-2">
                  Check Your Pantry
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
