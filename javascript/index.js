document.addEventListener("DOMContentLoaded", function(){

    let randomEntry;
    const entryHolder = document.getElementById("entryHolder");
    const entryTitle = document.getElementById("entryTitle");
    const entryText = document.getElementById("entryText");
    let archivesData;

    FetchArchivesContent();



    function FetchArchivesContent()
    {
        fetch('./content/archives.json')
        .then(response => response.json())
        .then(data => {
            archivesData = data;
            
      

            ShowRandomArchive();


        });
    }

    function ShowRandomArchive()
    {
        let randomInt = 0;
        let maxRange = archivesData.length;

        randomInt = Math.floor(Math.random() * maxRange);

        let chosenArchive = archivesData[randomInt];
        

        entryTitle.textContent = chosenArchive.title;
        entryText.textContent = chosenArchive.content[0];
    

    }

})