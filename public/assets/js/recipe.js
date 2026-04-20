import { createCarroussel } from "#/assets/js/models/recipeUtils.js";
import { getPossibleCategories, getPossibleIngredients } from "#/assets/js/apis/recipeApi.js";
import { renderCategoriesForm } from "$js/models/recipeUtils.js";

document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);

    if (params.has('id')) {
        const id = params.get('id');

        const recipeDetailsContainer = document.getElementById('recipe-details')
        const imageContainer = document.getElementById('image-container')
        const categoriesContainer = document.getElementById("categories")
    
        const allRecipeDetails = await getRecipeDetails(id)
        const recipe = allRecipeDetails.recipeInfo
        const categories = allRecipeDetails.categories 

        const images = recipe.images || [];
        const ingredients = recipe.ingredients || [];
        const preparationSteps = recipe.preparation_steps || [];

        createCarroussel(imageContainer, images, recipe.name);
        renderCategories(categories, categoriesContainer)
        renderRecipeTitleAndDescription(recipe.name, recipe.description, recipeDetailsContainer)
        renderIngredients(ingredients, recipeDetailsContainer)
        renderPreparationSteps(preparationSteps, recipeDetailsContainer)  

    }
    else {
        const categoriesContainer = document.getElementById("categories-container")
        const ingredientContainer = document.getElementById('ingredients-container');
        const addIngredientButton = document.getElementById('addIngredientButton');

        const categories = await getPossibleCategories()
        const ingredients = await getPossibleIngredients()

        const dataList = document.createElement("datalist")
        dataList.setAttribute("id", "ingredientsList")
        ingredientContainer.appendChild(dataList)
        
        setIngredientsToDatalist(ingredients, dataList)

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

        renderCategoriesForm(categories, categoriesContainer)

        
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

        document.getElementById('addStepButton').addEventListener('click', () => {
            addStep()
        })
    }
});

async function getRecipeDetails(id) {
    try {
        const result = {}

        const recipeResponse = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=getRecipeById&id=${id}`);
        const recipeData = await recipeResponse.json();
        const recipeInfo = recipeData.data

        const categoriesResponse = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=getCategoriesByRecipeId&id=${id}`)
        const categoriesData = await categoriesResponse.json()
        const categoriesInfo = categoriesData.data
        
        result.recipeInfo = recipeInfo
        result.categories = categoriesInfo

        return result

    }

    catch {
        console.log("Erro")
    }
}

function renderCategories(categories, container) {
    categories.forEach(category => {  
        const span = document.createElement("span")
        span.textContent = category
        container.appendChild(span)
    })
}

function renderRecipeTitleAndDescription(title, description, container) {
    const recipeTitle = document.createElement('h2');
    recipeTitle.textContent = title;
    container.appendChild(recipeTitle); 

    const recipeDescription = document.createElement('p');
    recipeDescription.textContent = description;
    container.appendChild(recipeDescription);
}

function renderIngredients(ingredients, container){
    const ingredientsList = document.createElement('ol');

    ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('li');
        ingredientItem.textContent = `${ingredient.name}`;
        ingredientsList.appendChild(ingredientItem);
    });

    container.appendChild(ingredientsList);
}

function renderPreparationSteps(preparationSteps, container){
    const preparationStepsList = document.createElement('ol');

    preparationSteps.forEach(step => {
        const stepItem = document.createElement('li');
        stepItem.textContent = `${step.description}`;
        preparationStepsList.appendChild(stepItem);
    });
    container.appendChild(preparationStepsList);
}

function setIngredientsToDatalist(ingredients, datalist) {
        ingredients.forEach(ingredient => {
            const option = document.createElement("option")
            option.value = ingredient.id
            option.textContent = ingredient.name

            datalist.appendChild(option)
        })
}

function addStep() {
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
}



