
document.addEventListener("DOMContentLoaded", async () => {
    const IngredientSelect = document.getElementById("recipe-ingredients");

    // Fetch ingredients from the API
    const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=getAllIngredients`);
    const data = await response.json();
    const ingredients = data.data

    ingredients.forEach(ingredient => {
        const option = document.createElement("option");
        option.value = ingredient.id;
        option.textContent = ingredient.name;
        IngredientSelect.appendChild(option);
    })
});

document.getElementById('create-recipe-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    
    const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=createRecipe`, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();

    if (data.success) {
        console.log('Recipe created successfully!');
        e.target.reset();
    } else {
        console.log('Error creating recipe: ' + data.message);
    }
})

