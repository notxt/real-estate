const main = document.querySelector("main")
if (main === null) throw new Error("main is null")

main.textContent = "working!"
