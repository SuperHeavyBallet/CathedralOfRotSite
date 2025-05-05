document.addEventListener("DOMContentLoaded", function() {

    // Initial Setup

    let archivesData = [];
    

    const list_AcademicWork = document.getElementById("list_AcademicWork");
    const list_Mapping = document.getElementById("list_Mapping");
    const list_Tales = document.getElementById("list_Tales");
    const list_Creatures = document.getElementById("list_Creatures");
    const list_Groups = document.getElementById("list_Groups");

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

    const listTitles = [
        list_Title_AcademicWork,
        list_Title_Mapping,
        list_Title_Tales,
        list_Title_Creatues,
        list_Title_Groups
    ];

    let list_Elements_AcademicWork = [];
    let list_Elements_Mapping = [];
    let list_Elements_Tales = [];
    let list_Elements_Creatures = [];
    let list_Elements_Groups = [];
    
    AddClickEventstoArrayElements(listTitles, "click");

    

    function AddClickEventstoArrayElements(array, eventType)
    {
        array.forEach(element =>
            {
                element.addEventListener(eventType, (e) =>{
                    e.preventDefault();
                    const list = element.nextElementSibling;
                    list.classList.toggle("hidden");
                })
            })

    }

   


    // Functions

    function FetchArchivesContent()
    {
        fetch('../content/archives.json')
        .then(response => response.json())
        .then(data => {
            archivesData = data;
            console.log(archivesData);

            PopulateList(list_AcademicWork, "Academic Work");
            PopulateList(list_Mapping, "Mapping and Clarifications");
            PopulateList(list_Tales, "Tales & Found Words");
            PopulateList(list_Creatures, "Creatures");
            PopulateList(list_Groups, "Groups");

            FillArticle(archivesData[0]);

        });
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

    function FillArticle(article)
    {
        archiveTitle.textContent = article.title;
        archiveCategory.textContent = article.category;

        archiveTextArea.textContent = "";
        let content = article.content;

        content.forEach(line =>
            {
                let newLine = document.createElement("p");
                newLine.textContent = line.toString();
                archiveTextArea.appendChild(newLine);
            })

            archiveCredit.textContent = "- " + article.credit;

            
   
    }

    function AddListClickEvent(listElement, article)
    {
        listElement.addEventListener('click', (e) => {
            e.preventDefault();

            FillArticle(article);
       
        })
    }

});
