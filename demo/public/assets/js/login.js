const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async (e) => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validar mínimo 3 caracteres
    if (email.trim().length < 3) {
        alert("Email deve ter pelo menos 3 caracteres");
        return;
    }
    
    if (password.trim().length < 3) {
        alert("Senha deve ter pelo menos 3 caracteres");
        return;
    }

    localStorage.setItem("user_logged", true);
    window.location.href = "explore.html";

})