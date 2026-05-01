import { createCarroussel } from "#/assets/js/models/recipeUtils.js";
import { getPossibleCategories, getPossibleIngredients } from "#/assets/js/apis/recipeApi.js";
import { renderCategoriesForm } from "#/assets/js/models/recipeUtils.js";
import { validateRecipeName,  validateRecipeDescription } from "#/assets/js/utils/auth.js";
import { renderError } from "#/assets/js/models/renderMessages.js";
import { minRecipeDescriptionCatacteres, minRecipeNameCaracteres, getMeasurements, saveRecipe } from "#/assets/js/apis/recipeApi.js";

let recipeId = 0
const recipeDetailsContainer = document.getElementById('recipe-details')

 
document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);

    if (params.has('id')) {
        const id = params.get('id');
        recipeId = id

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
        renderIngredients(ingredients, recipeDetailsContainer)
        renderPreparationSteps(preparationSteps, recipeDetailsContainer)  
        createComentarySection(recipeDetailsContainer, comments, id)

    }
    else {
        const categoriesContainer = document.getElementById("categories-container")
        const ingredientContainer = document.getElementById('ingredients-container');
        const addIngredientButton = document.getElementById('addIngredientButton');
        const errorContainer = document.getElementById("error-container")

        const categories = await getPossibleCategories()
        const ingredients = await getPossibleIngredients()

        const dataList = document.createElement("datalist")
        dataList.setAttribute("id", "ingredientsList")
        ingredientContainer.appendChild(dataList)
        
        setIngredientsToDatalist(ingredients, dataList)

        const measurements = await getMeasurements()

        addIngredientButton.addEventListener("click", async () => {
            const wrapper = document.createElement("div")
            const deleteIngredientButton = document.createElement("button")
            deleteIngredientButton.textContent = "x"

            const measurementsList = await getMeasurementsElementList(measurements)

            const input = document.createElement("input")
            input.setAttribute("name", "recipe-ingredients[]")
            input.setAttribute("list", "ingredientsList")
            input.setAttribute("placeholder", "tomate")

            const inputNumber = document.createElement("input")
            inputNumber.setAttribute("name", "ingredient-number[]")
            inputNumber.setAttribute("type", "number")
            inputNumber.setAttribute("placeholder", "2")

            deleteIngredientButton.addEventListener("click", () => {
                wrapper.remove()
            })

            wrapper.appendChild(input) 
            wrapper.appendChild(inputNumber)
            wrapper.appendChild(measurementsList) 
            wrapper.appendChild(deleteIngredientButton)
            ingredientContainer.appendChild(wrapper)
        })

        renderCategoriesForm(categories, categoriesContainer)
        
        document.getElementById('create-recipe-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);

            const imageFile = formData.get("image");

            if (imageFile && imageFile.size > 0) {
                const croppedBlob = await cropTo4x3(imageFile);

                formData.set("image", croppedBlob, "recipe.webp");
            }

            const recipeName = formData.get("recipe-name")
            const recipeDescr = formData.get("recipe-description")

            errorContainer.innerHTML = ""

            if (!validateRecipeName(recipeName)) {
                renderError(errorContainer, `Error: Recipe name must have ${minRecipeNameCaracteres}+ caracteres`)
                return
            }

            if (!validateRecipeDescription(recipeDescr)) {
                renderError(errorContainer, `Error: Recipe description must have ${minRecipeDescriptionCatacteres}+ caracteres`)
                return
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
        })

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
        const span = document.createElement("span")
        span.textContent = category
        container.appendChild(span)
    })
}

function renderRecipeTitleAndDescription(title, description, container) {
    const recipeTitle = document.createElement('h2');
    recipeTitle.textContent = title;
    container.appendChild(recipeTitle); 

    const recipeDescription = document.createElement('p');
    recipeDescription.textContent = description;
    container.appendChild(recipeDescription);
}

function renderIngredients(ingredients, container){
    const ingredientsList = document.createElement('ol');

    ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('li');
        ingredientItem.innerHTML = `${ingredient.number} ${ingredient.measurement_name} of ${ingredient.ingredient_name}`;
        ingredientsList.appendChild(ingredientItem);
    });

    container.appendChild(ingredientsList);
}

function renderPreparationSteps(preparationSteps, container){
    const preparationStepsList = document.createElement('ol');

    preparationSteps.forEach(step => {
        const stepItem = document.createElement('li');
        stepItem.textContent = `${step.description}`;
        preparationStepsList.appendChild(stepItem);
    });
    container.appendChild(preparationStepsList);
}

function setIngredientsToDatalist(ingredients, datalist) {
        ingredients.forEach(ingredient => {
            const option = document.createElement("option")
            option.value = ingredient.id
            option.textContent = ingredient.name

            datalist.appendChild(option)
        })
}

function addStep() {
    const div = document.getElementById('steps-container');
    const stepCount = div.querySelectorAll('input').length + 1;
    const label = document.createElement('label');
    label.setAttribute('for', `step-${stepCount}`);
    label.textContent = stepCount;
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `step-${stepCount}`;
    input.name = 'recipe-preparation-steps[]';
    div.appendChild(label);
    div.appendChild(input);
}

function cropTo4x3(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const targetRatio = 4 / 3;

      let width = img.width;
      let height = img.height;

      const currentRatio = width / height;

      let cropWidth, cropHeight, offsetX, offsetY;

      if (currentRatio > targetRatio) {
        cropHeight = height;
        cropWidth = height * targetRatio;
        offsetX = (width - cropWidth) / 2;
        offsetY = 0;
      } else {
        cropWidth = width;
        cropHeight = width / targetRatio;
        offsetX = 0;
        offsetY = (height - cropHeight) / 2;
      }

      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 900;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        img,
        offsetX,
        offsetY,
        cropWidth,
        cropHeight,
        0,
        0,
        1200,
        900
      );

      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/webp");
    };
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
    commentSection.setAttribute("id", "comments")
    
    const h2 = document.createElement("h2");
    h2.textContent = "Secção de Comentários";
    commentSection.appendChild(h2);

    let userHaveCommented = false

    if (comments.length < 1) {
        const div = document.createElement("div")
        div.innerHTML = "There is no comments"
        recipeDetailsContainer.appendChild(div)
        createUserCommentSection(recipeDetailsContainer, id)
        return
    }

    comments.forEach(comment => {
        const div = document.createElement("div");
        div.classList.add("comment-item"); 

        div.innerHTML = `
            <span><strong>${comment.username}</strong></span>
            <p>${comment.comment} (Nota: ${comment.rate})</p>
        `;

        const myCommentDiv = document.createElement("div")
        myCommentDiv.innerHTML = `
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Apagar</button>
        `

        if (comment.is_mine) {
            div.appendChild(myCommentDiv)
            userHaveCommented = true
        }


        if (comment.is_mine) {
            const editBtn = div.querySelector(".edit-btn");
            const deleteBtn = div.querySelector(".delete-btn");

            editBtn.addEventListener("click", () => {
                openEditSection(comment); 
            });

            deleteBtn.addEventListener("click", () => {
                if(confirm("Tens a certeza que queres apagar?")) {
                    deleteComment(comment.id);
                }
            });
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
    
    const starDiv = document.createElement("div")
    const commentDiv = document.createElement("div")

    let section = document.getElementById("userCommentCreator")

    if (!section) {
        section = document.createElement("section")
        section.id = "userCommentCreator"
    }

    const button = document.createElement("button")

    let p = document.createElement("p")
    p.textContent = "My Comment"

    const comment = Object.assign(document.createElement("input"), {
        type: "text",
        name: "comment",
        id: "comment",
        placeholder: "comment"
    })

    commentDiv.appendChild(p)
    commentDiv.appendChild(comment)

    starDiv.classList.add("rating")

    for (let i = 5; i >= 1; i--) {
        const input = Object.assign(document.createElement("input"), {
            type: "radio",
            name: "star",
            id: "star" + i,
            value: i
        })

        const label = Object.assign(document.createElement("label"), {
            htmlFor: "star" + i,
            textContent: "★"
        })

        starDiv.appendChild(input)
        starDiv.appendChild(label)
    }

    button.textContent = "Send"

    button.addEventListener("click", async () => {
        const selectedStar = starDiv.querySelector("input[name='star']:checked")
        const comment = document.getElementById("comment")

        const data = {
            id: id,
            comment: comment.value,
            rating: selectedStar.value
        }

        if (selectedStar) {
            const response = await fetch(`${window.API_BASE}/controllers/RecipeController.php?action=sendComment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const responseJson = await response.json()
            console.log(responseJson)
            await refreshComments(document.getElementById("comments"), recipeId)
        }
    })

    section.appendChild(commentDiv)
    section.appendChild(starDiv)
    section.appendChild(button)

    recipeDetailsContainer.appendChild(section)
}

async function refreshComments(container, recipeId) {
    const data = await getRecipeDetails(recipeId)

    const oldSection = container
    if (oldSection) oldSection.innerHTML = ""

    if (document.getElementById("userCommentCreator") != null) {document.getElementById("userCommentCreator").innerHTML = ""}

    createComentarySection(container, data.recipeInfo.comments, recipeId)
}


