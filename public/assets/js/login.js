document.getElementById("loginForm").addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    fetch(`${window.API_BASE}/controllers/AuthController.php?action=login`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('user_logged', 'true')
            window.location.href = "explore.html"
        }else {
            console.log(data)
        }
    })
})