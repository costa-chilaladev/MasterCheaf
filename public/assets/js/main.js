const loadRecipes = async () => {
    // O Vite vai trocar o @ pelo caminho real na hora de rodar
    const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=getAllRecipes`);
    const data = await response.json();

    console.log(data)
    
    data.forEach(recipe => {
        const recipeElement = document.createElement('article');
        const figure = document.createElement('figure');

        const images = recipe.images || [];

        if (images && images.length > 0) {
            const img = document.createElement('img');
            img.alt = recipe.name;
            figure.appendChild(img);

            if (images.length > 1) {
                // Função para alternar imagens automaticamente
                let currentIndex = 0;
                img.src = `/MasterCheaf/uploads/recipes/${images[currentIndex]}`;
                
                const intervalId = setInterval(() => {
                    currentIndex = (currentIndex + 1) % images.length;
                    img.src = `/MasterCheaf/uploads/recipes/${images[currentIndex]}`;
                }, 3000);
                
                recipeElement.intervalId = intervalId;
            } else {
                img.src = `/MasterCheaf/uploads/recipes/${images[0]}`;
            }
        }

        recipeElement.appendChild(figure);
        const title = document.createElement('h2');
        title.textContent = recipe.name;
        recipeElement.appendChild(title);

        const description = document.createElement('p');
        description.textContent = recipe.description;
        recipeElement.appendChild(description);
        recipeElement.setAttribute("class", "recipe-card");
        
        document.getElementById('recipes-grade').appendChild(recipeElement);
    })
};

loadRecipes();


