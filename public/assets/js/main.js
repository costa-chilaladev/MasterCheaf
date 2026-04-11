import { createCarroussel } from "#/assets/js/models/recipeUtils.js";

const loadRecipes = async () => {
    // O Vite vai trocar o @ pelo caminho real na hora de rodar
    const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=getAllRecipes`);
    const data = await response.json();

    if (!data.success) {
        console.log("error fetching recipes:", data.message);
        return;
    }

    const recipes = data.data;

    if (recipes.length === 0) {
        console.log("No recipes found");
        return;
    }
    
    recipes.forEach(recipe => {
        const destinationPageLink = document.createElement('a');
        destinationPageLink.href = `/MasterCheaf/public/recipe.html?id=${recipe.id}`;

        const recipeElement = document.createElement('article');
        const figure = document.createElement('figure');

        const images = recipe.images || [];

        createCarroussel(recipeElement, images, recipe.name);

        
        const title = document.createElement('h2');
        title.textContent = recipe.name;

        const description = document.createElement('p');
        description.textContent = recipe.description;
        recipeElement.setAttribute("class", "recipe-card");

        destinationPageLink.appendChild(figure);
        destinationPageLink.appendChild(title);
        destinationPageLink.appendChild(description);
        
        recipeElement.appendChild(destinationPageLink)
    
        document.getElementById('recipes-grade').appendChild(recipeElement);
    })
};

loadRecipes();



