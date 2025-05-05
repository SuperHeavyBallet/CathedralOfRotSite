document.addEventListener("DOMContentLoaded", function() {

    const toggleElement = document.getElementById("toggle-color-theme")
    const lightImage = "☀"
    const darkImage = "⏾"
    
    toggleElement.addEventListener('click', (e) =>{
        e.preventDefault();

        document.body.classList.toggle("light-theme");

        if(toggleElement.textContent === lightImage)
        {
            toggleElement.textContent = darkImage;
        }
        else if(toggleElement.textContent === darkImage)
        {
            toggleElement.textContent = lightImage;
        }
    })

})
