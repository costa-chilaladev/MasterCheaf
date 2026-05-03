import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import TomSelect from "tom-select";
import "tom-select/dist/css/tom-select.css";
import { createCarroussel } from "#/assets/js/models/recipeUtils.js";
import { getPossibleCategories, getPossibleIngredients } from "#/assets/js/apis/recipeApi.js";
import { renderCategoriesForm } from "#/assets/js/models/recipeUtils.js";
import { validateRecipeName,  validateRecipeDescription } from "#/assets/js/utils/auth.js";
import { renderError } from "#/assets/js/models/renderMessages.js";
import { minRecipeDescriptionCatacteres, minRecipeNameCaracteres, getMeasurements, saveRecipe } from "#/assets/js/apis/recipeApi.js";

// Global variables
let cachedIngredients = null;
let cachedMeasurements = null;
let croppedImages = [];
let files = [];
let currentIndex = 0;
let cropper = null;
let imageElement = null;
let recipeId = null;
let recipeDetailsContainer = document.getElementById("recipe-details");
let recipeName = "";
let recipeDescr = "";

async function loadIngredients() {
    if (!cachedIngredients) {
        try {
            cachedIngredients = await getPossibleIngredients();
        } catch (error) {
            console.error('Error loading ingredients:', error);
            cachedIngredients = [];
        }
    }
    return cachedIngredients;
}

async function loadMeasurements() {
    if (!cachedMeasurements) {
        try {
            cachedMeasurements = await getMeasurements();
        } catch (error) {
            console.error('Error loading measurements:', error);
            cachedMeasurements = [];
        }
    }
    return cachedMeasurements;
}
 
document.addEventListener("DOMContentLoaded", async () => {
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        // Clean up all TomSelect instances
        document.querySelectorAll('select').forEach(select => {
            if (select.tomselect) {
                select.tomselect.destroy();
            }
        });
    });

    const params = new URLSearchParams(window.location.search);

    if (params.has('id')) {
        const id = params.get('id');
        recipeId = id;
        recipeDetailsContainer = document.getElementById('recipe-details');

        const imageContainer = document.getElementById('image-container')
        const categoriesContainer = document.getElementById("categories")
        const interactionContainer = document.createElement("div")
    
        const allRecipeDetails = await getRecipeDetails(id)
        const recipe = allRecipeDetails.recipeInfo
        const categories = allRecipeDetails.categories 

        const states = recipe.state

        const images = recipe.images || [];
        const ingredients = recipe.ingredients || [];
        const preparationSteps = recipe.preparation_steps || [];

        const comments = recipe.comments


        recipeDetailsContainer.appendChild(interactionContainer)

        constructSaveAndFavoriteButton(id, interactionContainer, states)
        createCarroussel(imageContainer, images, recipe.name);
        renderCategories(categories, categoriesContainer)
        renderRecipeTitleAndDescription(recipe.name, recipe.description, recipeDetailsContainer)

        // Create content grid for ingredients and preparation steps
        const contentGrid = document.createElement('div');
        contentGrid.classList.add('recipe-content');
        recipeDetailsContainer.appendChild(contentGrid);

        renderIngredients(ingredients, contentGrid)
        renderPreparationSteps(preparationSteps, contentGrid)

        createComentarySection(recipeDetailsContainer, comments, id)

    }
    else {
        const categoriesContainer = document.getElementById("categories-container")
        const ingredientContainer = document.getElementById('ingredients-container');
        const addIngredientButton = document.getElementById('addIngredientButton');
        const errorContainer = document.getElementById("error-container")

        const categories = await getPossibleCategories()
        const ingredients = await loadIngredients()
        const measurements = await loadMeasurements()

        addIngredientButton.addEventListener("click", async () => {
            const wrapper = document.createElement("div")
            const deleteIngredientButton = document.createElement("button")
            deleteIngredientButton.textContent = "x"

            const measurementsList = await getMeasurementsElementList(measurements)

            const input = document.createElement("select")
            input.setAttribute("name", "recipe-ingredients[]")
            input.setAttribute("placeholder", "Selecione um ingrediente...")

            const inputNumber = document.createElement("input")
            inputNumber.setAttribute("name", "ingredient-number[]")
            inputNumber.setAttribute("type", "number")
            inputNumber.setAttribute("placeholder", "2")

            deleteIngredientButton.addEventListener("click", () => {
                // Clean up TomSelect instance before removing
                if (input.tomselect) {
                    input.tomselect.destroy();
                }
                wrapper.remove()
            })

            wrapper.appendChild(inputNumber)
            wrapper.appendChild(measurementsList)
            wrapper.appendChild(input)
            wrapper.appendChild(deleteIngredientButton)
            ingredientContainer.appendChild(wrapper)

            initializeTomSelect(input, ingredients)
        })

        renderCategoriesForm(categories, categoriesContainer)

        initializeCropperUI();
        
        document.getElementById('create-recipe-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);

            // Extract recipe name and description from form
            recipeName = formData.get("recipe-name") || "";
            recipeDescr = formData.get("recipe-description") || "";

             // remove original
            formData.delete("recipe-images[]");

            // adiciona todas cortadas
            croppedImages.forEach((blob, index) => {
                formData.append("recipe-images[]", blob, `recipe-${index}.webp`);
            });

            const ingredients = formData.getAll("recipe-ingredients[]");
            const ingredientNumbers = formData.getAll("ingredient-number[]");
            const measurements = formData.getAll("measuraments[]");

            // Validate recipe name
            if (!validateRecipeName(recipeName)) {
                renderError(errorContainer, `Error: Recipe name inválido`);
                return;
            }

            // Validate recipe description
            if (!validateRecipeDescription(recipeDescr)) {
                renderError(errorContainer, `Error: Invalid Recipe description`);
                return;
            }

            // Validate ingredients
            const invalidIngredients = ingredients.some(ingredient => !ingredient || isNaN(ingredient));
            if (invalidIngredients) {
                renderError(errorContainer, "Erro: Todos os ingredientes devem ser selecionados da lista");
                return;
            }

            // Validate ingredient numbers
            const invalidNumbers = ingredientNumbers.some(num => !num || isNaN(num) || num <= 0);
            if (invalidNumbers) {
                renderError(errorContainer, "Erro: Todas as quantidades devem ser números positivos");
                return;
            }

            // Validate measurements
            const invalidMeasurements = measurements.some(measurement => !measurement || isNaN(measurement));
            if (invalidMeasurements) {
                renderError(errorContainer, "Erro: Todas as unidades devem ser selecionadas");
                return;
            }

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
        });

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
        const span = document.createElement("span");
        span.classList.add("category-tag");
        span.textContent = category;
        container.appendChild(span);
    });
}

function renderRecipeTitleAndDescription(title, description, container) {
    const headerSection = document.createElement('section');
    headerSection.classList.add('recipe-header');

    const recipeTitle = document.createElement('h1');
    recipeTitle.classList.add('recipe-title');
    recipeTitle.textContent = title;
    headerSection.appendChild(recipeTitle);

    const recipeDescription = document.createElement('p');
    recipeDescription.classList.add('recipe-description');
    recipeDescription.textContent = description;
    headerSection.appendChild(recipeDescription);

    container.appendChild(headerSection);
}

function renderIngredients(ingredients, container){
    const section = document.createElement('section');
    section.classList.add('content-section');

    const title = document.createElement('h2');
    title.textContent = 'Ingredients';
    section.appendChild(title);

    const ingredientsList = document.createElement('ol');
    ingredientsList.classList.add('ingredients-list');

    ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('li');
        const quantitySpan = document.createElement('span');
        quantitySpan.classList.add('ingredient-quantity');
        quantitySpan.textContent = `${ingredient.number} ${ingredient.measurement_name}`;

        const nameSpan = document.createElement('span');
        nameSpan.textContent = ingredient.ingredient_name;

        ingredientItem.appendChild(quantitySpan);
        ingredientItem.appendChild(nameSpan);
        ingredientsList.appendChild(ingredientItem);
    });

    section.appendChild(ingredientsList);
    container.appendChild(section);
}

function renderPreparationSteps(preparationSteps, container){
    const section = document.createElement('section');
    section.classList.add('content-section');

    const title = document.createElement('h2');
    title.textContent = 'Preparation Steps';
    section.appendChild(title);

    const preparationStepsList = document.createElement('ol');
    preparationStepsList.classList.add('preparation-steps');

    preparationSteps.forEach(step => {
        const stepItem = document.createElement('li');
        stepItem.textContent = step.description;
        preparationStepsList.appendChild(stepItem);
    });

    section.appendChild(preparationStepsList);
    container.appendChild(section);
}

function initializeTomSelect(selectElement, ingredients) {
    // Validate inputs
    if (!selectElement || !ingredients || !Array.isArray(ingredients)) {
        console.error('Invalid parameters for TomSelect initialization');
        return;
    }

    // Create options array with validation
    const options = ingredients
        .filter(ingredient => ingredient && ingredient.id && ingredient.name)
        .map(ingredient => ({
            value: String(ingredient.id),
            text: String(ingredient.name)
        }));

    // Check if element already has TomSelect instance
    if (selectElement.tomselect) {
        selectElement.tomselect.destroy();
    }

    try {
        const tomSelect = new TomSelect(selectElement, {
            options: options,
            placeholder: "Selecione um ingrediente...",
            create: false, // Disable creation of new ingredients
            maxOptions: null,
            maxItems: 1,
            hideSelected: false,
            closeAfterSelect: true,
            allowEmptyOption: true,
            plugins: ['dropdown_input'],
            render: {
                option: function(data, escape) {
                    return '<div class="ts-option">' + escape(data.text) + '</div>';
                },
                item: function(data, escape) {
                    return '<div class="ts-item">' + escape(data.text) + '</div>';
                }
            },
            onInitialize: function() {
                // Ensure the dropdown is properly positioned
                this.refreshOptions();
            },
            onDropdownOpen: function() {
                // Ensure options are visible when dropdown opens
                this.refreshOptions();
            }
        });

        // Store reference for cleanup
        selectElement.tomselect = tomSelect;

    } catch (error) {
        console.error('Error initializing TomSelect:', error);
        // Fallback to regular select if TomSelect fails
        selectElement.innerHTML = options.map(opt =>
            `<option value="${opt.value}">${opt.text}</option>`
        ).join('');
    }
}

function addStep() {
    const container = document.getElementById('steps-container');
    const div = document.createElement("div")
    
    const stepCount = container.querySelectorAll('input').length + 1;


    const label = document.createElement('label');
    label.setAttribute('for', `step-${stepCount}`);
    label.textContent = stepCount;
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `step-${stepCount}`;
    input.name = 'recipe-preparation-steps[]';
    div.appendChild(label);
    div.appendChild(input);
    
    container.appendChild(div)
}

async function cropToRatio(file, width, height, outputWidth, outputHeight, quality) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        img.onload = () => {
            const targetRatio = width / height;
            const currentRatio = img.width / img.height;

            let cropWidth = img.width;
            let cropHeight = img.height;

            if (currentRatio > targetRatio) {
                cropWidth = img.height * targetRatio;
                cropHeight = img.height;
            } else {
                cropWidth = img.width;
                cropHeight = img.width / targetRatio;
            }

            const offsetX = (img.width - cropWidth) / 2;
            const offsetY = (img.height - cropHeight) / 2;

            canvas.width = outputWidth;
            canvas.height = outputHeight;

            ctx.drawImage(
                img,
                offsetX,
                offsetY,
                cropWidth,
                cropHeight,
                0,
                0,
                canvas.width,
                canvas.height
            );

            canvas.toBlob((blob) => {
                resolve(blob);
            }, "image/webp", quality);
        };

        img.onerror = () => reject(new Error("Falha ao carregar imagem"));
        img.src = URL.createObjectURL(file);
    });
}


function getMeasurementsElementList(measurements) { 
    const measurementsList = document.createElement("select")
    measurementsList.setAttribute("name", "measuraments[]")

    measurements.forEach(m => {
        const option = document.createElement("option")
        option.value = m.id
        option.innerText = m.name
        measurementsList.appendChild(option)
    })

    return measurementsList
}

async function constructSaveAndFavoriteButton(id, interactionContainer, states) {
    interactionContainer.classList.add("interaction-buttons");

    const list = ["favorite", "save"]

    list.forEach(element => {
        const button = document.createElement("button")
        button.textContent = element
        button.classList.add(element)

        states.forEach(state => {
            if (state == element) {
                button.classList.add(element + "-active")
            }
        })

        button.addEventListener("click", () => {
            button.classList.toggle(element + "-active")

            saveRecipe(id, element)
        })

        interactionContainer.appendChild(button)
    })
}

function createComentarySection(recipeDetailsContainer, comments, id) {

    const commentSection = document.createElement("section");
    commentSection.classList.add("comments-section");
    commentSection.setAttribute("id", "comments");

    const h2 = document.createElement("h2");
    h2.textContent = "Comments";
    commentSection.appendChild(h2);

    let userHaveCommented = false;

    if (comments.length < 1) {
        const noCommentsDiv = document.createElement("div");
        noCommentsDiv.classList.add("no-results");
        noCommentsDiv.innerHTML = "🍳<br>No comments yet. Be the first to share your thoughts!";
        commentSection.appendChild(noCommentsDiv);
        recipeDetailsContainer.appendChild(commentSection);
        createUserCommentSection(recipeDetailsContainer, id);
        return;
    }

    comments.forEach(comment => {
        const div = document.createElement("div");
        div.classList.add("comment-item");

        const authorSpan = document.createElement("div");
        authorSpan.classList.add("comment-author");
        authorSpan.textContent = comment.username;

        const ratingSpan = document.createElement("div");
        ratingSpan.classList.add("comment-rating");
        ratingSpan.textContent = `Rating: ${'★'.repeat(comment.rate)}${'☆'.repeat(5-comment.rate)} (${comment.rate}/5)`;

        const textP = document.createElement("div");
        textP.classList.add("comment-text");
        textP.textContent = comment.comment;

        div.appendChild(authorSpan);
        div.appendChild(ratingSpan);
        div.appendChild(textP);

        const myCommentDiv = document.createElement("div");
        myCommentDiv.classList.add("comment-actions");

        if (comment.is_mine) {
            myCommentDiv.innerHTML = `
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            `;
            div.appendChild(myCommentDiv);
            userHaveCommented = true;
        }

        commentSection.appendChild(div);
    });

    recipeDetailsContainer.appendChild(commentSection);
}

function openEditSection(comment) {
    console.log("A editar o comentário:", comment);
    if (document.getElementById("userCommentCreator")) {document.getElementById("userCommentCreator").innerHTML = ""}
    createUserCommentSection(recipeId)
}

async function deleteComment(id) {
    const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=deleteComment&id=${id}`)
    const data = response.json()
    console.log(data)

    await refreshComments(document.getElementById("comments"), recipeId)
}


function createUserCommentSection(container, id = recipeId) {

    let section = document.getElementById("userCommentCreator");

    if (!section) {
        section = document.createElement("section");
        section.id = "userCommentCreator";
    } else {
        section.innerHTML = "";
    }

    const title = document.createElement("h2");
    title.textContent = "Add Your Comment";
    section.appendChild(title);

    const formDiv = document.createElement("div");
    formDiv.classList.add("comment-form-group");

    const commentLabel = document.createElement("label");
    commentLabel.textContent = "Your Comment";
    formDiv.appendChild(commentLabel);

    const commentTextarea = document.createElement("textarea");
    commentTextarea.name = "comment";
    commentTextarea.id = "comment";
    commentTextarea.placeholder = "Share your thoughts about this recipe...";
    commentTextarea.rows = 4;
    formDiv.appendChild(commentTextarea);

    section.appendChild(formDiv);

    const ratingDiv = document.createElement("div");
    ratingDiv.classList.add("comment-form-group");

    const ratingLabel = document.createElement("label");
    ratingLabel.textContent = "Your Rating";
    ratingDiv.appendChild(ratingLabel);

    const starDiv = document.createElement("div");
    starDiv.classList.add("rating-stars");

    for (let i = 5; i >= 1; i--) {
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "star";
        input.id = "star" + i;
        input.value = i;

        const label = document.createElement("label");
        label.htmlFor = "star" + i;
        label.textContent = "★";

        starDiv.appendChild(input);
        starDiv.appendChild(label);
    }

    ratingDiv.appendChild(starDiv);
    section.appendChild(ratingDiv);

    const submitBtn = document.createElement("button");
    submitBtn.classList.add("comment-submit-btn");
    submitBtn.textContent = "Submit Comment";

    submitBtn.addEventListener("click", async () => {
        const selectedStar = starDiv.querySelector("input[name='star']:checked");
        const commentTextareaEl = document.getElementById("comment");

        if (!selectedStar) {
            alert("Please select a rating");
            return;
        }

        const data = {
            id: id,
            comment: commentTextareaEl.value,
            rating: selectedStar.value
        };

        const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=sendComment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const responseJson = await response.json();
        console.log(responseJson);
        await refreshComments(document.getElementById("comments"), recipeId);
    });

    section.appendChild(submitBtn);
    container.appendChild(section);
}

async function refreshComments(container, recipeId) {
    const data = await getRecipeDetails(recipeId)

    const oldSection = container
    if (oldSection) oldSection.innerHTML = ""

    if (document.getElementById("userCommentCreator") != null) {document.getElementById("userCommentCreator").innerHTML = ""}

    createComentarySection(container, data.recipeInfo.comments, recipeId)
}

function initializeCropperUI() {
    const input = document.getElementById("inputImage");
    const cropBtn = document.getElementById("cropBtn");
    
    if (!input || !cropBtn) return;
    imageElement = document.getElementById("image");
    if (!imageElement) return;

    input.addEventListener("change", (e) => {
        files = Array.from(e.target.files);
        currentIndex = 0;
        croppedImages = [];

        if (files.length > 0) {
            loadImage(files[currentIndex]);
        }
    });

    cropBtn.addEventListener("click", async () => {
        if (!cropper) return;

        const canvas = cropper.getCroppedCanvas({
            width: 1280,
            height: 720,
        });

        const blob = await new Promise(resolve =>
            canvas.toBlob(resolve, "image/webp", 0.85)
        );

        croppedImages.push(blob);
        currentIndex++;

        if (currentIndex < files.length) {
            loadImage(files[currentIndex]);
        } else {
            updateImageCount();
        }
    });
}

function loadImage(file) {
    if (!imageElement) return;
    
    const url = URL.createObjectURL(file);
    imageElement.src = url;

    imageElement.onload = () => {
        if (cropper) cropper.destroy();

        cropper = new Cropper(imageElement, {
            aspectRatio: 16 / 9,
            viewMode: 1,
            autoCropArea: 1,
            responsive: true,
            restore: true,
            guides: true,
            center: true,
            highlight: true,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: true,
        });
    };
}

function updateImageCount() {
    const counter = document.getElementById("cropImageCounter");
    if (counter) {
        counter.textContent = `${croppedImages.length} imagem(ns) cortada(s)`;
    }
}


