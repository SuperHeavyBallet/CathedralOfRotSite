document.addEventListener('DOMContentLoaded', function() {

    let eventData = [];
    const timelineContainer = document.getElementById("timelineContainter");
    FetchTimelineContent();

    function FetchTimelineContent()
    {
        fetch('./content/timeline.json')
        .then(response => response.json())
        .then(data => {
            eventData = data;

            SortEventsByDate(eventData);
            AssignID(eventData);
            DisplayEvents();

        });
        
    }

    function SortEventsByDate(data)
    {
        data.sort((a, b) => Number(a.eventDate) - Number(b.eventDate));
    }
    function AssignID(data)
    {


        const tempArray = data.map((entry, index) => ({
            ...entry,
            id: index.toString()
        }));

        eventData = tempArray;

        
    }
    function DisplayEvents()
    {
        const startPoint = document.createElement("h3");
        startPoint.textContent = "The Start of Time";
        timelineContainer.appendChild(startPoint);

        const dateNotes = document.createElement("h4");
        dateNotes.textContent = "BS = Before Skarn, AS = After Skarn";
        timelineContainer.appendChild(dateNotes);

        for(let i = 0; i < eventData.length; i++)
        {
            

            const eventCard = document.createElement("div");
            eventCard.classList.add("event-card");

            const eventTitle = document.createElement("h3");
            eventTitle.classList.add("event-title");
            eventTitle.textContent = "~ " + eventData[i].eventTitle;

            const eventDate = document.createElement("h3");
            eventDate.classList.add("event-date");
            const eventDateInt = Number(eventData[i].eventDate);

            

            if(eventDateInt  < 0)
            {
                eventDate.textContent = eventData[i].eventDate + " BS";
            }
            else
            {
                eventDate.textContent = eventData[i].eventDate + " AS";
            }
            
            const eventTopSection = document.createElement("div");
            eventTopSection.classList.add("event-top-section");
            
            eventTopSection.appendChild(eventDate);
            eventTopSection.appendChild(eventTitle);
            eventCard.appendChild(eventTopSection);

            const eventText = document.createElement("p");
            eventText.classList.add("event-text");
            eventText.textContent = eventData[i].eventText;
            eventCard.appendChild(eventText);

           

            timelineContainer.appendChild(eventCard);

            if(i % 2 === 0)
            {
                eventCard.classList.add("left");
            }
            else
            {
                eventCard.classList.add("right");
            }
        }

        const endPoint = document.createElement("h3");
        endPoint.textContent = "The End of Time";
        timelineContainer.appendChild(endPoint);
    
    }

})