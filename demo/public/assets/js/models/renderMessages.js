export function renderError(container, message) {
    const div = document.createElement("div")

    div.innerHTML = `
        <p style="background-color: red; color: black">${message}</p>
    `

    container.appendChild(div)
}