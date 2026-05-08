import { recipes, recipeDetails } from "../../../db/db.js"

export const minRecipeNameCaracteres = 5
export const minRecipeDescriptionCatacteres = 5

export async function getPossibleCategories() {
    const result = {}
    
    const categoriesResponse = await fetch(`../src/controllers/RecipeController.php?action=getCategorys`)
    const categoriesData = await categoriesResponse.json()
    const categories = categoriesData.data
    
    return categories
}

export async function getPossibleIngredients() {
    const ingredientsResponse = await fetch(`../src/controllers/RecipeController.php?action=getAllIngredients`);
    const ingredientsData = await ingredientsResponse.json();
    const ingredients = ingredientsData.data 

    return ingredients
}

export async function getMeasurements() {
    const response = await fetch(`../src/controllers/RecipeController.php?action=getMeasurements`)
    const data = await response.json()
    
    if (data.success) {
        return data.data
    }
    else {
        return data.error
    }   
}

export function getRecipes() {
    return recipes
}

export function getRecipeById(recipeId) {
    let result = []
    recipeDetails.forEach(recipe => {
        if (recipe.recipeInfo.id == recipeId) {
            result = recipe
        }
    })

    return result
}


