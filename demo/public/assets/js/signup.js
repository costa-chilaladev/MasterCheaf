import { validateEmail, validatePassword } from './utils/auth.js';

const signupButton = document.getElementById('signupButton');

signupButton.addEventListener('click', async (e) => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;

    // Validar email
    if (!validateEmail(email)) {
        alert("Email inválido. Use o formato: example@domain.com");
        return;
    }

    // Validar senha (mínimo 8 caracteres, maiúscula, minúscula, número e caractere especial)
    if (!validatePassword(password)) {
        alert("Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial (@$!%*?&)");
        return;
    }

    // Validar confirmação de senha
    if (confirmPassword && password !== confirmPassword) {
        alert("As senhas não correspondem");
        return;
    }

    window.location.href = "explore.html";
})