const loadRecipes = async () => {
    // O Vite vai trocar o @ pelo caminho real na hora de rodar
    const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=getAllRecipes`);
    const data = await response.json();

    console.log(data)
    
    data.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');
        recipeElement.innerHTML = `
            <h2>${recipe.name}</h2>
            <p>${recipe.description}</p>
        `;
        document.getElementById('recipes-grade').appendChild(recipeElement);
    })
};

loadRecipes();


