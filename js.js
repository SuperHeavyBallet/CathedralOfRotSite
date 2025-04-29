document.addEventListener("DOMContentLoaded", function() {
    
    let archivesData = [];

    fetch('../content/archives.json')
    .then(response => response.json())
    .then(data => {
        archivesData = data;
        console.log(archivesData);
    });

});
