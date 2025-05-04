document.addEventListener("DOMContentLoaded", function() {

    let copyrightText = document.getElementById("copyright-text");
    let baseCopyrightText = "Copyright © 2025 Alexander Gorham. All content and associated intellectual property are protected."
    copyrightText.textContent = baseCopyrightText;
    
    

    CopyrightUpdateGenerator();

    function CopyrightUpdateGenerator()
    {
        let currentYear;
        const date = new Date();
        let year = date.getFullYear();
        currentYear = year.toString();
        copyrightText.textContent = `Copyright ${year} Alexander Gorham. All content and associated intellectual property are protected.`;
    }
});
