
export const minRecipeNameCaracteres = 5
export const minRecipeDescriptionCatacteres = 5

export async function getPossibleCategories() {
    const result = {}
    
    const categoriesResponse = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=getCategorys`)
    const categoriesData = await categoriesResponse.json()
    const categories = categoriesData.data
    
    return categories
}

export async function getPossibleIngredients() {
    const ingredientsResponse = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=getAllIngredients`);
    const ingredientsData = await ingredientsResponse.json();
    const ingredients = ingredientsData.data 

    return ingredients
}

export async function getMeasurements() {
    const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=getMeasurements`)
    const data = await response.json()
    
    if (data.success) {
        return data.data
    }
    else {
        return data.error
    }   
}

export async function saveRecipe(id, option) {
    const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=recipeInteraction`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            recipeId: id,
            option: option
        })
    })
    
    const data = await response.json()
    console.log(data)
}

