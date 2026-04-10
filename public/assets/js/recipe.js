
document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);

    if (params.has('id')) {
        const id = params.get('id');
        
        const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=getRecipeById&id=${id}`);
        const data = await response.json();
        const recipe = data.data;
        const ingredients = recipe.ingredients

        console.log(recipe)

        const recipeTitle = document.createElement('h2');
        recipeTitle.textContent = recipe.name;
        document.getElementById('recipe-details').appendChild(recipeTitle);

        const recipeDescription = document.createElement('p');
        recipeDescription.textContent = recipe.description;
        document.getElementById('recipe-details').appendChild(recipeDescription);

        const ingredientsList = document.createElement('ol');

        ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('li');
            ingredientItem.textContent = `${ingredient.name}`;
            ingredientsList.appendChild(ingredientItem);
        });

        document.getElementById('recipe-details').appendChild(ingredientsList);
    }
    else {
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
    }
});

