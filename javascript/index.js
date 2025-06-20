document.addEventListener("DOMContentLoaded", function(){


    const entryTitle = document.getElementById("entryTitle");
    const entryText = document.getElementById("entryText");
    

    entryTitle.textContent = "Loading...";
    entryText.textContent = "Fetching archive content...";

    let sourceURL = './content/archives.json';
    let archivesData = [];

    let randomSourceInt = Math.floor(Math.random() * 2);

    FetchArchivesContent();

    /*
    function FetchArchivesContent()
    {
        
        if(randomSourceInt === 0){
            sourceURL = './content/archives.json';
        }
        else{
            sourceURL = './content/writing.json'
        }
        fetch(sourceURL)
        .then(response => {

            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            else{
                return response.json();
            }
        })
        .then(data => {
            archivesData = data;
            ShowRandomArchive();
        })
        .catch(error => {
            console.error("Failed to fetch archive data:" , error);
            entryTitle.textContent = "Error";
            entryText.textContent = "Unable to load archive content.";
            }   
        );
    }*/

    

});

async function FetchArchivesContent()
{
   

    try{
        const url = GetRandomSourceURL();
        SetAnchor(url);
        const response = await fetch(url);
        if(!response.ok) throw new Error();
        const data = await response.json();
        archivesData = data;
        ShowRandomArchive();
    } catch (err) {
        DisplayError("Could not load archive.");
    }
}

function GetRandomSourceURL()
{
    if(Math.random() < 0.5)
    {
        
        return './content/archives.json'
    }
    else{
        
        return './content/writing.json'
    }
 
}

function SetAnchor(source)
{
    const entryAnchor = document.getElementById("entryHolder");
    const entrySource = document.getElementById("entrySource");

    console.log(source);
    if(source === './content/archives.json')
    {
        entryAnchor.setAttribute("href", "archives.html");
        entrySource.textContent = "Archives..."
        console.log("Should go to Archives");
    }
    else{
        entryAnchor.setAttribute("href", "writing.html");
        entrySource.textContent = "Writing..."
        console.log("Should go elsewhere");
    }
   
}

function DisplayError(message)
{
    entryTitle.textContent = "Error";
    entryText.textContent = message;
}

function ShowRandomArchive()
{
    let maxRange = archivesData.length;
    let randomInt = Math.floor(Math.random() * maxRange);
        
    let chosenArchive = archivesData[randomInt];

    entryTitle.textContent = chosenArchive.title;
    entryText.textContent = chosenArchive.content[0];
}