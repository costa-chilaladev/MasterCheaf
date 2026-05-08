import { createRecipeCardImage, renderCategoriesForm } from "./models/recipeUtils.js"
import { getPossibleCategories, getPossibleIngredients, saveRecipe } from "./apis/recipeApi.js"

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
        const response = await fetch(`../src/controllers/RecipeController.php?action=getAllRecipes`);
        
        if (!response.ok) throw new Error("Failed to communicate with the server.");

        const data = await response.json();
        
        if (!data.success) throw new Error("Could not load recipes.");

        renderRecipes(data.data || []);
    } catch (error) {
        console.error("Internal error:", error);
        container.innerHTML = `<p class="error">An error occurred while loading content. Please try again later.</p>`;
    }
}

async function search(searchTerm) {
    const recipes = await getSearchResults(searchTerm);
    renderRecipes(recipes);
}

function setupFilterListeners() {
    // Listen for changes in all filter inputs
    const filterInputs = document.querySelectorAll('#filter-section input[type="checkbox"], #filter-section input[type="radio"]');

    filterInputs.forEach(input => {
        input.addEventListener('change', async () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                await search(searchTerm);
            } else {
                await applyFilters();
            }
        });
    });

    // Add clear filters functionality
    const clearBtn = document.getElementById('clear-filters-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', async () => {
            // Clear all checkboxes and radio buttons
            document.querySelectorAll('#filter-section input[type="checkbox"], #filter-section input[type="radio"]')
                .forEach(input => input.checked = false);

            // Clear search input
            searchInput.value = '';

            // Reload all recipes
            await loadRecipes();
        });
    }
}

async function applyFilters() {
    const recipes = await getSearchResults('');
    renderRecipes(recipes);
}

function renderRecipes(recipes) {
    container.innerHTML = ""; 
    
    if (!recipes || recipes.length === 0) {
        const noResults = document.createElement("p");
        noResults.textContent = "No recipes found.";
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

    const formData = new FormData()

    formData.append("searchTerm", searchTerm)

    const inputs = document.querySelectorAll(
    'input[type="checkbox"], input[type="radio"]'
    )

    const names = [...new Set(
    Array.from(inputs).map(input => input.name)
    )]

    names.forEach(name => {
        const elements = document.querySelectorAll(`input[name="${name}"]`)

        if (elements[0].type === 'radio') {
            const selected = document.querySelector(`input[name="${name}"]:checked`)
            if (selected) {
                formData.append(name, selected.value)
            }
        }

        if (elements[0].type === 'checkbox') {
            const checked = document.querySelectorAll(`input[name="${name}"]:checked`)
            
            checked.forEach(el => {
            formData.append(name, el.value)
            })
        }
    })

    const response = await fetch(`../src/controllers/RecipeController.php?action=getAllRecipesBasedOnSearchAnFilter`, {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    console.log(data);

    return data.data || [];
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
    title.textContent = recipe.name || "Untitled recipe";

    const description = document.createElement('p');
    description.textContent = recipe.description || "No description available.";

    destinationPageLink.append(title, description);
    recipeElement.appendChild(destinationPageLink);

    return recipeElement;
}
