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
            window.location.href = "index.html"
        }else {
            console.log(data)
        }
    })
})