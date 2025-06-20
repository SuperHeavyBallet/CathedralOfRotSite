document.addEventListener("DOMContentLoaded", function() {


    let writingData = [];
    
    const list_ShortStories = document.getElementById('list_shorts');
    const list_Items = document.getElementById('list_items');

    const writingTitle = document.getElementById("writingTitle");
    const writingCategory = document.getElementById("writingCategory");
    const writingTextArea = document.getElementById("writingTextArea");
    const writingCredit = document.getElementById("writingCredit");

    FetchWritingContent();

    const list_Title_ShortStories = document.getElementById("list-title-shorts");
    const list_Title_Items = document.getElementById("list-title-items");

    const listTitles = [
        list_Title_ShortStories,
        list_Title_Items
    ];

    AddClickEventstoArrayElements(listTitles, "click");

    function AddClickEventstoArrayElements(array, eventType) {
        array.forEach(element => {
            element.addEventListener(eventType, (e) => {
                e.preventDefault();
    
                const currentList = element.nextElementSibling;
                if (!currentList) return;
    
                // Hide all other sibling elements
                array.forEach(otherElement => {
                    const otherList = otherElement.nextElementSibling;
                    const otherArrow = otherElement.querySelector(".arrow");
    
                    if (!otherList) return;
    
                    if (otherElement !== element) {
                        otherList.classList.add("hidden");
                        
                        if (otherArrow) otherArrow.textContent = "⯇ ";
                    }
                });
    
                // Toggle visibility for the clicked element
                const isHidden = currentList.classList.contains("hidden");
                currentList.classList.toggle("hidden");
    
                const arrowSpan = element.querySelector(".arrow");
                if (arrowSpan) {
                    arrowSpan.textContent = isHidden ? "▼ " : "⯇ ";
                }
            });
        });
    }

    function FetchWritingContent()
    {
        fetch('./content/writing.json')
        .then(response => response.json())
        .then(data => {
            writingData = data;

            AssignID(writingData);
            console.log(writingData);

            
            PopulateList(list_ShortStories, "Short Stories");
            PopulateList(list_Items, "In Game Items");
   

            
            FillArticle(writingData[0]);

        });
    }

    function AssignID(data)
    {


        const tempArray = data.map((entry, index) => ({
            ...entry,
            id: index.toString()
        }));

        archivesData = tempArray;

        
    }


    function PopulateList(listName, jsonCategory)
    {

            archivesData.forEach(article =>
            {
                if(article.category === jsonCategory)
                {
                    console.log(article.title);
                    
                    let testDiv = document.createElement('li');
                    testDiv.textContent = "- " + article.title;

                    listName.appendChild(testDiv);

                    AddListClickEvent(testDiv, article);

                    
                }
            })
        
     
    }

    function FillArticle(article) {

        writingTitle.textContent = article.title;
        writingCategory.textContent = article.category;
    
        writingTextArea.textContent = ""; // Clear existing content
        let content = article.content;
    
        content.forEach(line => {
            let newLine = document.createElement("p");
    
            // If the line includes a manual line break, convert to <br>
            if (line.includes("\n")) {
                // Replace \n with <br> and set using innerHTML
                newLine.innerHTML = line.replace(/\n/g, "<br>");
            } else {
                newLine.textContent = line;
            }
    
            writingTextArea.appendChild(newLine);
        });
    
        writingCredit.textContent = "~ " + article.credit;
    }

    function AddListClickEvent(listElement, article)
    {
        listElement.addEventListener('click', (e) => {
            e.preventDefault();


            FillArticle(article);

            const articleBody = document.getElementById("writingTitle");

            articleBody.scrollIntoView({behavior: "smooth"});

            

            
            
        })
        

    }

});
