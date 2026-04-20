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