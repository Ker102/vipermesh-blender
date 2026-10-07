for (const button of document.querySelectorAll("[data-copy]")) {
  let resetTimer
  button.addEventListener("click", async () => {
    const code = document.getElementById(button.dataset.copy)
    const status = button.nextElementSibling
    if (!code || !status) return
    clearTimeout(resetTimer)
    button.setAttribute("aria-label", button.title)
    try {
      await navigator.clipboard.writeText(code.textContent)
      status.textContent = "Copied"
      button.setAttribute("aria-label", "Copied to clipboard")
      resetTimer = setTimeout(() => {
        status.textContent = ""
        button.setAttribute("aria-label", button.title)
      }, 2500)
    } catch {
      status.textContent = "Select the commands above to copy."
    }
  })
}
