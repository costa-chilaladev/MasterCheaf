import { createRecipeCardImage, renderCategoriesForm } from "./models/recipeUtils.js"
import { getPossibleCategories, getPossibleIngredients, getRecipes } from "./apis/recipeApi.js"

const container = document.getElementById("recipes-grade");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

const filterBtn = document.getElementById("filter-btn");
const filterSection = document.getElementById("filter-section");

document.addEventListener("DOMContentLoaded", async () => {
    loadRecipes();

    searchBtn.addEventListener("click", async () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            await search(searchTerm);
        } else {
            loadRecipes();
        }
    });

    filterBtn.addEventListener("click", () => {
        filterSection.classList.toggle("inactive");
    });

    const categories = await getPossibleCategories();
    renderCategoriesForm(categories, filterSection);

    setupFilterListeners();
});

async function loadRecipes() {
    try {
        const recipes = getRecipes() 
        console.log(recipes)

        renderRecipes(recipes || []);
    } catch (error) {
        console.error("Erro interno:", error);
        container.innerHTML = `<p class="error">Ocorreu um erro ao carregar o conteúdo. Tente mais tarde.</p>`;
    }
}

function renderRecipes(recipes) {
    container.innerHTML = ""; 
    
    if (!recipes || recipes.length === 0) {
        const noResults = document.createElement("p");
        noResults.textContent = "Nenhuma receita encontrada.";
        container.appendChild(noResults);
        return;
    }

    const fragment = document.createDocumentFragment();
    recipes.forEach(recipe => {
        fragment.appendChild(createRecipeCard(recipe));
    });
    container.appendChild(fragment);
}

function createRecipeCard(recipe) {
    const destinationPageLink = document.createElement('a');
    const recipeId = encodeURIComponent(recipe.id);
    destinationPageLink.href = `recipe.html?id=${recipeId}`;

    const recipeElement = document.createElement('article');
    recipeElement.className = "recipe-card";

    const images = Array.isArray(recipe.images) ? recipe.images : [];
    createRecipeCardImage(recipeElement, images, recipe.name);
    
    const title = document.createElement('h2');
    title.textContent = recipe.name || "Receita sem título";

    const description = document.createElement('p');
    description.textContent = recipe.description || "Sem descrição disponível.";

    destinationPageLink.append(title, description);
    recipeElement.appendChild(destinationPageLink);

    return recipeElement;
}
