document.addEventListener("DOMContentLoaded", function() {

    // Initial Setup

    let archivesData = [];
    FetchArchivesContent();

    let list_AcademicWork = document.getElementById("list_AcademicWork");
    let list_Mapping = document.getElementById("list_Mapping");
    let list_Tales = document.getElementById("list_Tales");

    let archiveTitle = document.getElementById("archiveTitle");
    let archiveCategory = document.getElementById("archiveCategory");
    let archiveTextArea = document.getElementById("archiveTextArea");
    let archiveCredit = document.getElementById("archiveCredit");

   


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
