import { recipes, recipeDetails, ingredients, categories, measurements } from "./db/db.js"

export const minRecipeNameCaracteres = 5
export const minRecipeDescriptionCatacteres = 5

export async function getPossibleCategories() {
    return categories
}

export async function getPossibleIngredients() {
    return ingredients
}

export async function getMeasurements() {
    return measurements
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


