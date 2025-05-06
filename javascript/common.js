document.addEventListener("DOMContentLoaded", function() {

    let quotesData;
    let randomQuoteElement = document.getElementById("random-quote");

    

    FetchQuotesContent();

    function FetchQuotesContent()
    {
        fetch("/content/quotes.json")
        .then(response => response.json())
        .then(data => {
            quotesData = data;
            RandomQuoteGenerator(quotesData);

            randomQuoteElement.addEventListener("click", (e) => {
                e.preventDefault();
                RandomQuoteGenerator(quotesData);
            })
        })
    }

    function RandomQuoteGenerator(quotesArray)
    {
       const randomInt = Math.floor(Math.random() * quotesArray.length);

            randomQuoteElement.textContent = `"` + quotesArray[randomInt].quote + `"`;
        
    }

  
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
