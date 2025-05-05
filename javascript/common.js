document.addEventListener("DOMContentLoaded", function() {

    // Change Per User - Name and The Copyright Text Container Element
    
    const copyrightText = document.getElementById("copyright-text");
    const personName = copyrightText?.dataset.author || "Your Name";

    CopyrightUpdateGenerator(personName);

    function CopyrightUpdateGenerator(name)
    {
        const year = new Date().getFullYear();
        const message = `Copyright © ${year} ${name}. All content and associated intellectual property are protected.`;
        if (copyrightText) {
            copyrightText.textContent = message;
        } else {
            console.warn("Copyright element not found.");
        }
    }
});
