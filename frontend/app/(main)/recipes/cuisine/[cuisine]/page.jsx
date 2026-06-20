"use client";

import { useParams, useSearchParams } from "next/navigation";
import RecipeGrid from "@/components/RecipeGrid";
import { getMealsByArea } from "@/actions/mealdb.actions";

export default function CuisineRecipesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const cuisine = params.cuisine;
  const filterArea = searchParams.get("filter") || cuisine;

  return (
    <RecipeGrid
      type="cuisine"
      value={cuisine}
      filterValue={filterArea}
      fetchAction={getMealsByArea}
      backLink="/dashboard"
    />
  );
}
