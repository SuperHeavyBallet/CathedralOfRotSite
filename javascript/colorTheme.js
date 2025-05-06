document.addEventListener("DOMContentLoaded", function () {
    const toggleElement = document.getElementById("toggle-color-theme");
    const lightImage = "☀";
    const darkImage = "⏾";

    // Set correct icon after load
if (document.documentElement.classList.contains("light-theme")) {
    toggleElement.textContent = darkImage;
} else {
    toggleElement.textContent = lightImage;
}

toggleElement.addEventListener("click", (e) => {
    e.preventDefault();

    const isLight = document.documentElement.classList.toggle("light-theme");

    if (isLight) {
        localStorage.setItem("theme", "light");
        toggleElement.textContent = darkImage;
    } else {
        localStorage.setItem("theme", "dark");
        toggleElement.textContent = lightImage;
    }
})

})
