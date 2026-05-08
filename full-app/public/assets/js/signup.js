import { validateEmail, validatePassword } from '../../src/assets/js/utils/auth.js';

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const email = formData.get('email');
    const password = formData.get('password');

    if (!validateEmail(email) || !validatePassword(password)) {
        console.log("Invalid email or password format.");
        return;
    }
    
    fetch(`${window.API_BASE}/controllers/AuthController.php?action=signup`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            window.location.href = "login.html";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
