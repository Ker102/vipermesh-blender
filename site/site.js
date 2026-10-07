for (const button of document.querySelectorAll("[data-copy]")) {
  button.addEventListener("click", async () => {
    const code = document.getElementById(button.dataset.copy)
    const status = button.nextElementSibling
    try {
      await navigator.clipboard.writeText(code.textContent)
      status.textContent = "Copied"
    } catch {
      status.textContent = "Select the commands above to copy."
    }
  })
}
