<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Explore Recipes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- 1. Define a variável global para o JS saber onde está a API -->
        <script>
            window.API_BASE = "http://localhost/MasterCheaf/src";
        </script>

        <!-- 2. Chama o script gerenciado pelo Vite -->
        <!-- (Certifica-te que o 'npm run dev' está a correr) -->
        <script type="module" src="http://localhost:5173/public/assets/js/recipe.js"></script>
        <link rel="stylesheet" href="assets/css/recipe.css">

    </head>

    <body>
        <header>
            <a href="index.php">Home</a>
        </header>

        <main>
            <form id="create-recipe-form" enctype="multipart/form-data">
                <div>
                    <label for="recipe-name">Recipe Name:</label>
                    <input type="text" id="recipe-name" name="recipe-name" required>
                </div>
                <div>
                    <label for="recipe-description">Description:</label>
                    <textarea id="recipe-description" name="recipe-description" required></textarea>
                </div>
    
                <div>
                    <select multiple name="recipe-ingredients[]" id="recipe-ingredients">Ingredients</select>
                </div>

                <div>
                    <input type="file" name="recipe-images[]" id="recipe-images" multiple accept="image/*">
                </div>

                <div>
                    <div id="steps-container">
                        <h3>Steps</h3>
                        <label for="step-1">1</label>
                        <input type="text" id="step-1" name="recipe-preparation-steps[]">
                    </div>
                    <button id="addStepButton" type="button">Add Step</button>
                </div>

                <button type="submit">Create Recipe</button>
            </form>
        </main>

        <footer class="footer">
            <p>© 2026 MasterChefAOA. All rights reserved.</p>
        </footer>

    </body>
</html>