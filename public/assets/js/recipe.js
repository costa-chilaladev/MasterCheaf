import { createCarroussel } from "#/assets/js/models/recipeUtils.js";

document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);

    if (params.has('id')) {
        const id = params.get('id');
        
        const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=getRecipeById&id=${id}`);
        const data = await response.json();
        const recipe = data.data;
        const images = recipe.images || [];
        const ingredients = recipe.ingredients || [];
        const preparation_steps = recipe.preparation_steps || [];

        createCarroussel(document.getElementById('image-container'), images, recipe.name);


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

        const preparationStepsList = document.createElement('ol');

        preparation_steps.forEach(step => {
            const stepItem = document.createElement('li');
            stepItem.textContent = `${step.description}`;
            preparationStepsList.appendChild(stepItem);
        });
        document.getElementById('recipe-details').appendChild(preparationStepsList);

    }
    else {
        const ingredientContainer = document.getElementById('ingredients-container');
        const addIngredientButton = document.getElementById('addIngredientButton');

        // Fetch ingredients from the API
        const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=getAllIngredients`);
        const data = await response.json();
        const ingredients = data.data

        console.log(ingredients)

        const dataList = document.createElement("datalist")
        dataList.setAttribute("id", "ingredientsList")
        ingredientContainer.appendChild(dataList)
        
        ingredients.forEach(ingredient => {
            const option = document.createElement("option")
            option.value = ingredient.id
            option.textContent = ingredient.name

            dataList.appendChild(option)
        })

        addIngredientButton.addEventListener("click", async () => {
            const wrapper = document.createElement("div")
            const deleteIngredientButton = document.createElement("button")
            deleteIngredientButton.textContent = "x"

            const input = document.createElement("input")
            input.setAttribute("name", "recipe-ingredients[]")
            input.setAttribute("list", "ingredientsList")

            deleteIngredientButton.addEventListener("click", () => {
                wrapper.remove()
            })

            wrapper.appendChild(input)  
            wrapper.appendChild(deleteIngredientButton)
            ingredientContainer.appendChild(wrapper)
        })

        

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

document.getElementById('addStepButton').addEventListener('click', () => {
    const div = document.getElementById('steps-container');
    const stepCount = div.querySelectorAll('input').length + 1;
    const label = document.createElement('label');
    label.setAttribute('for', `step-${stepCount}`);
    label.textContent = stepCount;
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `step-${stepCount}`;
    input.name = 'recipe-preparation-steps[]';
    div.appendChild(label);
    div.appendChild(input);
})