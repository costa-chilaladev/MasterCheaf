const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async (e) => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    localStorage.setItem("user_logged", true);
    window.location.href = "explore.html";

})