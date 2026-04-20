import { createCarroussel } from "#/assets/js/models/recipeUtils.js";
import { getPossibleCategories, getPossibleIngredients } from "./apis/recipeApi";

const container = document.getElementById("recipes-grade");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

const filterBtn = document.getElementById("filter-btn");
const filterSection = document.getElementById("filter-section");

if (window.API_BASE) Object.freeze(window.API_BASE);

document.addEventListener("DOMContentLoaded", () => {
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
        filterSection.classList.toggle("inactive")
    })
});

async function loadRecipes() {
    try {
        const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=getAllRecipes`);
        
        if (!response.ok) throw new Error("Falha na comunicação com o servidor.");

        const data = await response.json();
        if (!data.success) throw new Error("Não foi possível carregar as receitas.");

        renderRecipes(data.data || []);
    } catch (error) {
        console.error("Erro interno:", error);
        container.innerHTML = `<p class="error">Ocorreu um erro ao carregar o conteúdo. Tente mais tarde.</p>`;
    }
}

async function search(searchTerm) {
    const recipes = await getSearchResults(searchTerm);
    renderRecipes(recipes);
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

async function getSearchResults(searchTerm) {
    try {
        const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=getAllRecipesBasedOnSearch&search=${encodeURIComponent(searchTerm)}`);
        
        if (!response.ok) return [];
        
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Erro na busca:", error);
        return []; 
    }
}

function createRecipeCard(recipe) {
    const destinationPageLink = document.createElement('a');
    const recipeId = encodeURIComponent(recipe.id);
    destinationPageLink.href = `/MasterCheaf/public/recipe.html?id=${recipeId}`;

    const recipeElement = document.createElement('article');
    recipeElement.className = "recipe-card";

    const images = Array.isArray(recipe.images) ? recipe.images : [];
    createCarroussel(recipeElement, images, recipe.name);
    
    const title = document.createElement('h2');
    title.textContent = recipe.name || "Receita sem título";

    const description = document.createElement('p');
    description.textContent = recipe.description || "Sem descrição disponível.";

    destinationPageLink.append(title, description);
    recipeElement.appendChild(destinationPageLink);

    return recipeElement;
}
