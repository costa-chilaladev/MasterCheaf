import Cropper from "https://cdn.jsdelivr.net/npm/cropperjs@1.5.13/dist/cropper.esm.js";
import TomSelect from "https://cdn.jsdelivr.net/npm/tom-select@2.2.2/dist/esm/tom-select.complete.js";
import { renderCategoriesForm, createCarroussel } from "models/recipeUtils.js";
import { validateRecipeName,  validateRecipeDescription } from "utils/auth.js";
import { renderError } from "models/renderMessages.js";
import { 
    minRecipeDescriptionCatacteres, 
    minRecipeNameCaracteres, 
    getMeasurements, 
    getPossibleCategories, 
    getPossibleIngredients, 
    getRecipeById 
} from "./apis/recipeApi.js";

let cachedIngredients = null;
let cachedMeasurements = null;
let croppedImages = [];
let files = [];
let currentIndex = 0;
let cropper = null;
let imageElement = null;
let recipeId = null;

function getCropperInstance() {
    if (!cropper) return null;
    if (typeof cropper.getCroppedCanvas === 'function') {
        return cropper;
    }
    if (cropper.cropper && typeof cropper.cropper.getCroppedCanvas === 'function') {
        return cropper.cropper;
    }
    return null;
}

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
    window.addEventListener('beforeunload', () => {
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
        
        const allRecipeDetails = await getRecipeById(id)
        console.log(allRecipeDetails)
        
        const recipe = allRecipeDetails.recipeInfo
        const categories = allRecipeDetails.categories 

        const states = allRecipeDetails.recipeInfo.state

        const images = recipe.images || [];
        const ingredients = recipe.ingredients || [];
        const preparationSteps = recipe.preparation_steps || [];

        const comments = recipe.comments


        recipeDetailsContainer.appendChild(interactionContainer)

        constructSaveAndFavoriteButton(id, interactionContainer, states)
        createCarroussel(imageContainer, images, recipe.name);
        renderCategories(categories, categoriesContainer)
        renderRecipeTitleAndDescription(recipe.name, recipe.description, recipeDetailsContainer)

        const contentGrid = document.createElement('div');
        contentGrid.classList.add('recipe-content');
        recipeDetailsContainer.appendChild(contentGrid);

        renderIngredients(ingredients, contentGrid)
        renderPreparationSteps(preparationSteps, contentGrid)

        createCommentarySection(recipeDetailsContainer, comments, id)

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
            input.setAttribute("placeholder", "Select an ingredient...")

            const inputNumber = document.createElement("input")
            inputNumber.setAttribute("name", "ingredient-number[]")
            inputNumber.setAttribute("type", "number")
            inputNumber.setAttribute("placeholder", "2")

            deleteIngredientButton.addEventListener("click", () => {
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

            recipeName = formData.get("recipe-name") || "";
            recipeDescr = formData.get("recipe-description") || "";

            formData.delete("recipe-images[]");

            croppedImages.forEach((blob, index) => {
                formData.append("recipe-images[]", blob, `recipe-${index}.webp`);
            });

            const ingredients = formData.getAll("recipe-ingredients[]");
            const ingredientNumbers = formData.getAll("ingredient-number[]");
            const measurements = formData.getAll("measuraments[]");

            if (!validateRecipeName(recipeName)) {
                renderError(errorContainer, `Error: Invalid recipe name`);
                return;
            }

            if (!validateRecipeDescription(recipeDescr)) {
                renderError(errorContainer, `Error: Invalid Recipe description`);
                return;
            }

            const invalidIngredients = ingredients.some(ingredient => !ingredient || isNaN(ingredient));
            if (invalidIngredients) {
                renderError(errorContainer, "Error: All ingredients must be selected from the list");
                return;
            }

            const invalidNumbers = ingredientNumbers.some(num => !num || isNaN(num) || num <= 0);
            if (invalidNumbers) {
                renderError(errorContainer, "Error: All quantities must be positive numbers");
                return;
            }

            const invalidMeasurements = measurements.some(measurement => !measurement || isNaN(measurement));
            if (invalidMeasurements) {
                renderError(errorContainer, "Error: All units must be selected");
                return;
            }

            const recipeData = {
                name: recipeName,
                description: recipeDescr,
                ingredients: ingredients.map((value, index) => ({
                    id: value,
                    quantity: ingredientNumbers[index] || "",
                    measurementId: measurements[index] || ""
                })),
                steps: Array.from(document.querySelectorAll("input[name='recipe-preparation-steps[]']")).map(input => input.value),
                images: croppedImages.length
            }

            console.log("Demo recipe saved locally:", recipeData);
            renderError(errorContainer, "Recipe created successfully! (demo)");
            document.getElementById('create-recipe-form').reset();
            croppedImages = [];
            updateImageCount();
            document.getElementById('cropBtn').style.display = 'none';
            document.getElementById('noImagePlaceholder').style.display = 'block';
        });

        document.getElementById('addStepButton').addEventListener('click', () => {
            addStep()
        })
    }
});


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
    if (!selectElement || !ingredients || !Array.isArray(ingredients)) {
        console.error('Invalid parameters for TomSelect initialization');
        return;
    }

    const options = ingredients
        .filter(ingredient => ingredient && ingredient.id && ingredient.name)
        .map(ingredient => ({
            value: String(ingredient.id),
            text: String(ingredient.name)
        }));

    if (selectElement.tomselect) {
        selectElement.tomselect.destroy();
    }

    try {
        const tomSelect = new TomSelect(selectElement, {
            options: options,
            placeholder: "Select an ingredient...",
            create: false, 
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
                this.refreshOptions();
            },
            onDropdownOpen: function() {
                this.refreshOptions();
            }
        });

        selectElement.tomselect = tomSelect;

    } catch (error) {
        console.error('Error initializing TomSelect:', error);
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

        img.onerror = () => reject(new Error("Failed to load image"));
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
        })

        interactionContainer.appendChild(button)
    })
}

function createCommentarySection(recipeDetailsContainer, comments, id) {

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
        noCommentsDiv.innerHTML = "<br>No comments yet. Be the first to share your thoughts!";
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
        ratingSpan.textContent = `Rating: ${comment.rate}/5`;

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
            
            const editBtn = myCommentDiv.querySelector(".edit-btn");
            const deleteBtn = myCommentDiv.querySelector(".delete-btn");
            
            editBtn.addEventListener("click", () => {
                openEditSection(comment);
            });
            
            deleteBtn.addEventListener("click", () => {
                deleteComment(comment.id);
            });
            
            div.appendChild(myCommentDiv);
            userHaveCommented = true;
        }

        commentSection.appendChild(div);
    });

    recipeDetailsContainer.appendChild(commentSection);
}

function openEditSection(comment) {
    console.log("Editing comment:", comment);
    if (document.getElementById("userCommentCreator")) {
        document.getElementById("userCommentCreator").innerHTML = "";
    }
    createUserCommentSection(document.getElementById("recipe-details"), recipeId);
}

async function deleteComment(id) {
    console.log(`Deleted commentary ${id}`)
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

        alert(`Comment submitted!\nRating: ${data.rating}\nComment: ${data.comment}`);
    });

    section.appendChild(submitBtn);
    container.appendChild(section);
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

        const placeholder = document.getElementById('noImagePlaceholder');
        const cropBtn = document.getElementById('cropBtn');

        if (files.length > 0) {
            placeholder.style.display = 'none';
            cropBtn.style.display = 'inline-block';
            loadImage(files[currentIndex]);
        } else {
            placeholder.style.display = 'block';
            cropBtn.style.display = 'none';
            updateImageCount();
        }
    });

    cropBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        if (!cropper) {
            alert("Please select an image first");
            return;
        }

        const originalText = cropBtn.textContent;
        cropBtn.textContent = "Cortando...";
        cropBtn.disabled = true;

        try {
            const activeCropper = getCropperInstance();
            if (!activeCropper) {
                throw new Error("Invalid cropper");
            }

            const canvas = activeCropper.getCroppedCanvas({
                width: 1280,
                height: 720,
                fillColor: '#fff',
            });

            if (!canvas) {
                throw new Error("Failed to create canvas");
            }

            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob(resolve, "image/webp", 0.85);
                setTimeout(() => reject(new Error("Timeout")), 5000);
            });

            croppedImages.push(blob);
            updateImageCount();

            cropBtn.textContent = "rtada!";
            cropBtn.style.backgroundColor = "#28a745";

            setTimeout(() => {
                cropBtn.textContent = originalText;
                cropBtn.style.backgroundColor = "";
                cropBtn.disabled = false;
            }, 1500);

            if (currentIndex + 1 < files.length) {
                currentIndex++;
                setTimeout(() => loadImage(files[currentIndex]), 500);
            } else {
                setTimeout(() => {
                    alert(`🎉 All ${croppedImages.length} images were cropped successfully!`);
                }, 1500);
            }

        } catch (error) {
            console.error("Error cropping image:", error);
            alert("Error cropping image. Please try again.");
            cropBtn.textContent = originalText;
            cropBtn.disabled = false;
        }
    });
}

function loadImage(file) {
    if (!imageElement) {
        console.error("Image element not found");
        return;
    }

    const container = document.getElementById('cropperContainer');
    container.style.opacity = '0.7';

    const url = URL.createObjectURL(file);
    imageElement.src = url;

    imageElement.onload = () => {
        container.style.opacity = '1';
        imageElement.style.display = 'block';

        if (cropper) {
            cropper.destroy();
        }

        try {
            cropper = new Cropper(imageElement, {
                aspectRatio: 16 / 9,
                viewMode: 1,
                autoCropArea: 0.8,
                responsive: true,
                restore: false,
                guides: true,
                center: true,
                highlight: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                background: false,
            });

            updateImageCount();
        } catch (error) {
            console.error("Error initializing cropper:", error);
            alert("Error initializing image editor");
        }
    };

    imageElement.onerror = () => {
        container.style.opacity = '1';
        alert("Error loading image. Please try another one.");
    };
}

function updateImageCount() {
    const counter = document.getElementById("cropImageCounter");
    if (counter) {
        if (files.length > 0) {
            const progress = croppedImages.length;
            const total = files.length;
            counter.innerHTML = `
                <span style="color: var(--primary-color); font-weight: bold;">
                    Image ${currentIndex + 1}/${total}
                </span>
                <span style="color: #28a745; margin-left: 10px;">
                    ${progress} cortada(s)
                </span>
            `;
        } else {
            counter.textContent = `${croppedImages.length} imagem(ns) cortada(s)`;
        }
    }
}


