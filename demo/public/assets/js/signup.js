import { validateEmail, validatePassword } from '../../src/assets/js/utils/auth.js';

const signupButton = document.getElementById('signupButton');

signupButton.addEventListener('click', async (e) => {
    window.location.href = "explore.html";
})