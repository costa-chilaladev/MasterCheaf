export function createCarroussel(recipeElement, images, recipeName) {
    const img = document.createElement('img');
    const figure = document.createElement('figure');
    img.alt = recipeName;
    figure.appendChild(img);
    recipeElement.appendChild(figure);

    if (images.length > 1) {
        // Função para alternar imagens automaticamente
        let currentIndex = 0;
        img.src = `/MasterCheaf/uploads/recipes/${images[currentIndex]}`;
        
        const intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            img.src = `/MasterCheaf/uploads/recipes/${images[currentIndex]}`;
        }, 3000);
        
        recipeElement.intervalId = intervalId;
    } else if (images.length === 1) {
        img.src = `/MasterCheaf/uploads/recipes/${images[0]}`;
    }
}