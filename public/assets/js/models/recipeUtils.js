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

export function renderCategoriesForm(categories, container) {
    const containers = {}
    const singleChoiceTypes = ["meal", "type"];

    categories.forEach(category => {
        if (!containers[category.type]) {
            const div = document.createElement("div")
            div.id = category.type

            const title = document.createElement("h3")
            title.textContent = category.type

            div.appendChild(title)
            container.appendChild(div)

            containers[category.type] = div
        }

        const input = document.createElement("input")
        input.type = (singleChoiceTypes.includes(category.type)) ? "radio" : "checkbox"
        input.name = (singleChoiceTypes.includes(category.type)) ? category.type : "categories[]"
        input.value = category.id

        const label = document.createElement("label")
        label.textContent = category.name

        containers[category.type].appendChild(input)
        containers[category.type].appendChild(label)
    })
}