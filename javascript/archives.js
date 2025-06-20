document.addEventListener("DOMContentLoaded", function() {

    // Initial Setup

    let archivesData = [];
    

    const list_AcademicWork = document.getElementById("list_AcademicWork");
    const list_Mapping = document.getElementById("list_Mapping");
    const list_Tales = document.getElementById("list_Tales");
    const list_Creatures = document.getElementById("list_Creatures");
    const list_Groups = document.getElementById("list_Groups");
    const list_Items = document.getElementById("list-Items");

    const archiveTitle = document.getElementById("archiveTitle");
    const archiveCategory = document.getElementById("archiveCategory");
    const archiveTextArea = document.getElementById("archiveTextArea");
    const archiveCredit = document.getElementById("archiveCredit");

    FetchArchivesContent();

    const list_Title_AcademicWork = document.getElementById("list-title-academic");
    const list_Title_Mapping = document.getElementById("list-title-mapping");
    const list_Title_Tales = document.getElementById("list-title-tales");
    const list_Title_Creatues = document.getElementById("list-title-creatures");
    const list_Title_Groups = document.getElementById("list-title-groups");
    const list_Title_Items = document.getElementById("list-title-items");

    const listTitles = [
        list_Title_AcademicWork,
        list_Title_Mapping,
        list_Title_Tales,
        list_Title_Creatues,
        list_Title_Groups,
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
    

   


    // Functions

    function FetchArchivesContent()
    {
        fetch('./content/archives.json')
        .then(response => response.json())
        .then(data => {
            archivesData = data;
            console.log(archivesData);

            AssignID(archivesData);
            console.log(archivesData);

            PopulateList(list_AcademicWork, "Academic Work");
            PopulateList(list_Mapping, "Mapping and Clarifications");
            PopulateList(list_Tales, "Tales & Found Words");
            PopulateList(list_Creatures, "Creatures");
            PopulateList(list_Groups, "Groups");
            PopulateList(list_Items, "In Game Items");

            FillArticle(archivesData[0]);

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

        archiveTitle.textContent = article.title;
        archiveCategory.textContent = article.category;
    
        archiveTextArea.textContent = ""; // Clear existing content
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
    
            archiveTextArea.appendChild(newLine);
        });
    
        archiveCredit.textContent = "~ " + article.credit;
    }

    function AddListClickEvent(listElement, article)
    {
        listElement.addEventListener('click', (e) => {
            e.preventDefault();


            FillArticle(article);

            const articleBody = document.getElementById("archiveTitle");

            articleBody.scrollIntoView({behavior: "smooth"});

            

            
            
        })
        

    }

});
