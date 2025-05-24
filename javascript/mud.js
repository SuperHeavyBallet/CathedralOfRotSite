document.addEventListener("DOMContentLoaded", function() {

    let dungeonData = [];
    let tempDungeonIndex = 2;
    let cellCount;
    let rowSize;
    let rowArray;
    let cellRow;
    let moveIsValid = false;
    let enemyLoopInterval = null;
    let enemiesCanAct = true;
    const fastMovementDelay = 1500;
    let fastSpeedCanMove = true;
    const normalMovementDelay = 3000;
    let normalSpeedCanMove = true;
    const slowMovementDelay = 4500;
    let slowSpeedCanMove = true;

    const dungeonInputField = document.getElementById("textInput");
    const dungeonInputSend = document.getElementById("textInputSend");
    let directionInput = "";

    const textOutput = document.getElementById("textOutput");

    dungeonInputSend.addEventListener("click", (e) => {
        e.preventDefault();

        if(dungeonInputField.value === "north")
        {
            movePosition([-1,0]);
        }
        else if(dungeonInputField.value === "south")
        {
            movePosition([1,0]);
        }
        else if (dungeonInputField.value === "east")
        {
            movePosition([0, -1]);
        }
        else if (dungeonInputField.value === "west")
        {
            movePosition([0, 1]);
        }
    })

    const dungeonMap = document.getElementById("dungeonMap");

    class DungeonCell {
        constructor(position = [0, 0], contents = "", quantity = 0, id = 0) {
            this.position = position;
            this.contents = contents;
            this.quantity = quantity;
            this.id = id;
        }
    }

    let dungeonCellsWithContents = [];

    const upArrow = document.getElementById("moveUp");
    const downArrow = document.getElementById("moveDown");
    const leftArrow = document.getElementById("moveLeft");
    const rightArrow = document.getElementById("moveRight");
    let playerPosition = [0,0];

    let tempEnemyPositions= [];
    let enemiesInDungeon = [];
    let enemyObjectsInDungeon = [];
    let doorsInRoom = [];
    let randomDoorCellTop;
    let randomDoorCellBottom;
    let doorPositions = [];
    let doorCoordinates = [];

    let roomIndex = 0;
    let numberOfDeadEnemies = 0;
    let allEnemiesDead = false;

    let allDungeonCells = [];

    let textOutputArray = [];

    let allDungeonCellElements = [];

    const attackButton = document.getElementById("attackButton");

    attackButton.addEventListener("click", (e) => {
        e.preventDefault();
        Attack();
    })

    AddMoveEventListener(upArrow, [-1, 0]);
    AddMoveEventListener(downArrow, [1, 0]);
    AddMoveEventListener(leftArrow, [0, -1]);
    AddMoveEventListener(rightArrow, [0, 1]);


    const reloadButton = document.getElementById("reloadButton");
    reloadButton.addEventListener("click", (e) => {
        e.preventDefault();
        ReloadMap();

        
    })

    GetDungeon();

    function Attack()
    {
        ClearPreviousText();
        textOutputArray.push("You swing your blade!");

        const [px, py] = playerPosition;

        const directions = [
            [px - 1, py],
            [px + 1, py],
            [px, py - 1],
            [px, py + 1],
        ];

        for (const [x, y] of directions) {
            
            for(let i = 0; i < tempEnemyPositions .length; i++)
            {

                const enemyX = Number(tempEnemyPositions[i][0]);
                const enemyY = Number(tempEnemyPositions[i][1]);

                if (x === enemyX  && y === enemyY ) {
                    textOutputArray.push("You kill the enemy!");
                    tempEnemyPositions[i] = [-1, -1]; // mark enemy as dead
                    numberOfDeadEnemies ++;
                    

                    break;
                }
            }
           
        }

        

     
        
        ClearCells();
        RenderDungeon();
        DescribeCurrentPosition();
        
    
    

    }

    function ClearPreviousText()
    {


        while (textOutput.lastChild) {
            textOutput.removeChild(textOutput.lastChild);
        }
        
        textOutputArray = [];
    }

    function GetDungeon()
    {
        fetch("content/dungeon.json")
        .then(response => response.json())
        .then(data => {
            dungeonData = data;

            

            cellCount = dungeonData[tempDungeonIndex].size;
            rowSize = Math.sqrt(cellCount);
      
            enemiesInDungeon = dungeonData[tempDungeonIndex].enemies;


            BuildAllDungeonCells();
            BuildDungeon(tempDungeonIndex);
            StartEnemyLoop(); // Add this line
        });  
    }

    function GetDoors(sourceJson, roomIndex)
    {
        doorsInRoom = sourceJson[roomIndex].doorsToRoom;
  

    }

    function AddMoveEventListener(arrow, positionChange)
    {
        arrow.addEventListener("click", (e) =>
        {
            e.preventDefault();
            movePosition(positionChange);
        })
    }

    function DescribeCurrentPosition()
    {
       
        CheckRemainingEnemies();
      

        let freeNorth = PreCheckForWalls(playerPosition[0]-1, playerPosition[1]);
        let freeSouth = PreCheckForWalls(playerPosition[0]+1, playerPosition[1]);
        let freeEast = PreCheckForWalls(playerPosition[0], playerPosition[1]-1);
        let freeWest = PreCheckForWalls(playerPosition[0], playerPosition[1]+1);

        let enemyNorth = [PreCheckForEnemies(playerPosition[0]-1, playerPosition[1])[0], PreCheckForEnemies(playerPosition[0]-1, playerPosition[1])[1]];
        let enemySouth = [PreCheckForEnemies(playerPosition[0]+1, playerPosition[1])[0], PreCheckForEnemies(playerPosition[0]+1, playerPosition[1])[1]];
        let enemyWest = [PreCheckForEnemies(playerPosition[0], playerPosition[1]-1)[0], PreCheckForEnemies(playerPosition[0], playerPosition[1]-1)[1]];
        let enemyEast = [PreCheckForEnemies(playerPosition[0], playerPosition[1]+1)[0], PreCheckForEnemies(playerPosition[0], playerPosition[1]+1)[1]];




        if (!freeNorth) {
            textOutputArray.push("North is blocked.");
        }

        if (!freeSouth) {
            textOutputArray.push("South is blocked.");
        }

        if (!freeEast) {
            textOutputArray.push("East is blocked.");
        }

        if (!freeWest) {
            textOutputArray.push("West is blocked.");
        }

        if(CheckDistantEnemies(playerPosition[0], playerPosition[1]))
        {
            textOutputArray.push("Something lurks nearby.")
        }
        
        if(enemyNorth[0]) { textOutputArray.push(`A ${enemyNorth[1][0]} blocks your north!`);}
        if(enemySouth[0]) { textOutputArray.push(`A ${enemySouth[1][0]} blocks your south!`)}
        if(enemyEast[0]) { textOutputArray.push(`A ${enemyEast[1][0]} blocks your east!`)}
        if(enemyWest[0]) { textOutputArray.push(`A ${enemyWest[1][0]} blocks your west!`)}
        
        

        if(allEnemiesDead)
        {
            textOutputArray.push("You're all alone...");
        }

        for(let i = 0; i < textOutputArray.length; i++)
        {
            const newText = document.createElement("p");
            newText.textContent = textOutputArray[i];

            textOutput.appendChild(newText);
        }
    }

    function movePosition(amount)
    {   
        

        const [newX, newY] = [playerPosition[0] + amount[0], playerPosition[1] + amount[1]];

        ClearPreviousText();
        CheckForWalls(newX, newY);
        CheckForEnemies(newX, newY);
        CheckForDoor(newX, newY);
        

        if(moveIsValid)
        {

            let moveDirection = ""
           
            if(amount[0] === 1 && amount[1] === 0)
            {
                moveDirection = "south";
            }
            else if(amount[0] === -1 && amount[1] === 0)
            {
                moveDirection = "north";
            }else if(amount[0] === 0 && amount[1] === -1)
            {
                moveDirection = "east";
            }
            else if(amount[0] === 0 && amount[1] === 1)
            {
                moveDirection = "west";
            }

        
            textOutputArray.push(`You move ${moveDirection}...`);

            const newPlayerPosition = [
                playerPosition[0] + amount[0],
                playerPosition[1] + amount[1]
            ];
        
            
        
            playerPosition = newPlayerPosition;

            MoveEnemies();
        
        }

        ClearCells();
        RenderDungeon();
        DescribeCurrentPosition();
        
    }

    function PreCheckForWalls(posX, posY)
    {
        if(posX >= 0 && posX < rowSize &&
            posY >= 0 && posY < rowSize)
        {
            moveIsValid = true; 
            return true;
        }
        else
        {
            moveIsValid = false;
            return false;
          
        }
    }

    function CheckForWalls(newX, newY)
    {

        if(newX >= 0 && newX < rowSize &&
            newY >= 0 && newY < rowSize)
        {
            moveIsValid = true; 
        }
        else
        {
            moveIsValid = false;
    
          
        }

      
    }

    function CheckDistantEnemies(posX, posY)
    {

        let positionsInRange = [
             
            
        ];


        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                positionsInRange.push([posX + dx, posY + dy]);
            }
        }

        let enemiesLurkingNearby = false;

        for(let i = 0; i < positionsInRange.length; i++)
        {
            const enemyCheck = PreCheckForEnemies(positionsInRange[i][0], positionsInRange[i][1]);
            if (enemyCheck[0]) {
                enemiesLurkingNearby = true;
               
            }
        }

        return enemiesLurkingNearby;

    }

    function PreCheckForEnemies(posX, posY)
    {
        for(let i = 0; i <tempEnemyPositions.length; i++)
        {
            const enemyName = enemiesInDungeon[i][0];

            if(posX === tempEnemyPositions[i][0] && posY === tempEnemyPositions[i][1])
            {
                
                
    //To fix
                //allDungeonCellElements[posX][posY].textContent = enemyName[0];

                return [true, enemiesInDungeon[i]];

    
                
            }
            
        }

        return [false, null];
    }

   

    function CheckForEnemies(newX, newY)
    {

       
        for(let i = 0; i <tempEnemyPositions.length; i++)
        {
            if(newX === tempEnemyPositions[i][0] && newY === tempEnemyPositions[i][1])
            {
                moveIsValid = false;
                obstacle = enemiesInDungeon[i][0];
          

    
                
            }
        }
        
    }

    function CheckForDoor(posX, posY)
    {


        
    }

    function ReloadMap()
    {
        StopEnemyLoop();
        ClearCells();
        BuildDungeon(tempDungeonIndex);
        StartEnemyLoop();
    }

   

    function MoveEnemies()
    {

      
            let occupiedPositions = new Set();

        // Add player position
        occupiedPositions.add(`${playerPosition[0]},${playerPosition[1]}`);

        // Add current enemy positions
        for (let pos of tempEnemyPositions) 
        {
            occupiedPositions.add(`${pos[0]},${pos[1]}`);
        };

        // New enemy positions to replace tempEnemyPositions at end
        let newEnemyPositions = [];



        
        for(let i = 0; i < enemiesInDungeon.length; i++)
        {
            let [enemyX, enemyY] = tempEnemyPositions[i];
            let randomDirection = getRandomIntInclusive(0, 1); // 0 = x, 1 = y
            let speedMultiplier = 1;

            /*
            if(enemiesInDungeon[i][2] === "fastSpeed")
            {
                speedMultiplier = 3;
            }
            else if (enemiesInDungeon[i][2] === "slowSpeed")
            {
                speedMultiplier = 1;
            }
            else
            {
                speedMultiplier = 2;
            }*/
            let movement = getRandomIntInclusive(-1 * speedMultiplier, 1* speedMultiplier);

            let newX = enemyX;
            let newY = enemyY;

            if (randomDirection === 0) {
                newX = enemyX + movement;
            } else {
                newY = enemyY + movement;
            }

            // Stay within bounds
            if (newX < 0 || newX >= rowSize || newY < 0 || newY >= rowSize) {
                newX = enemyX;
                newY = enemyY;
            }


            // Check if new position is already occupied
            if (!occupiedPositions.has(`${newX},${newY}`)) {
                newEnemyPositions.push([newX, newY]);
                occupiedPositions.add(`${newX},${newY}`);
            } else {
                // Stay in place if move not allowed
                newEnemyPositions.push([enemyX, enemyY]);
            }
        }
            

            
        
            

            
            
        

        tempEnemyPositions = newEnemyPositions;
        
        ClearCells();
        RenderDungeon();
      
        

        
    }

    function getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
      }

    function BuildDungeon(roomIndex)
    {
        ClearCells();
        ClearPreviousText();
        numberOfDeadEnemies = 0;
        allEnemiesDead = false;
        randomDoorCellTop = GenerateRandomPosition();
        randomDoorCellBottom = GenerateRandomPosition();

        SetPlayerStartPosition();
        SetEnemyStartPositions();
        GetDoors(dungeonData, roomIndex);
        RenderDungeon();
        textOutputArray = [`You enter Dungeon ${roomIndex}...`];
        DescribeCurrentPosition();
    
  
    }

    function CheckRemainingEnemies()
    {
        if(numberOfDeadEnemies === tempEnemyPositions.length)
        {
            allEnemiesDead = true;
        }


        

     
    }



    function BuildAllDungeonCells()
    {
        allDungeonCells = [];

        for(let i = 0; i < rowSize; i++)
        {
            let dungeonCellRow = [];

            for(let j = 0; j < rowSize; j++)
            {
                const newDungeonCell = new DungeonCell([i,j],"Empty",0, i+j);
               
                dungeonCellRow.push(newDungeonCell);
            }
            allDungeonCells.push(dungeonCellRow);
        }

        
    }

    function SetPlayerStartPosition()
    {
        let randomX = rowSize - 1; // Currently forcing player to start on bottom row
        let randomY = GenerateRandomPosition();
        playerPosition = [randomX, randomY];
    }

    function SetEnemyStartPositions()
    {

        for(let i = 0; i < enemiesInDungeon.length; i++)
        {
            let randomEnemyX = GenerateRandomPosition();
            let randomEnemyY = GenerateRandomPosition();

            while(randomEnemyX === playerPosition[0] && randomEnemyY === playerPosition[1])
            {
                randomEnemyX = GenerateRandomPosition();
                randomEnemyY = GenerateRandomPosition();
            }

            tempEnemyPositions[i] = [randomEnemyX, randomEnemyY];
        }
    }

   
    function GenerateRandomPosition()
    {
        return  Math.floor( Math.random() * (rowSize));
    }

    

    function RenderDungeon()
    {
        let idIndex = 0;
        dungeonCellsWithContents = [];
        allDungeonCellElements = [];
        doorPositions = []
  
        let rowNeedsDoor;


        for(let i = 0; i < doorsInRoom.length; i++)
        {
            let nextRoomFromDoor = doorsInRoom[i];

            if(nextRoomFromDoor < tempDungeonIndex)
            {
               // console.log(`Door should go at TOP, goes to room: ${nextRoomFromDoor} From room: ${tempDungeonIndex}`);
                doorPositions.push([i, 0]);
            }
            else if(nextRoomFromDoor > tempDungeonIndex)
            {
               // console.log(`Door should go at BOTTOM, goes to room: ${nextRoomFromDoor} From room: ${tempDungeonIndex}`);
                doorPositions.push([i, rowSize - 1]);
            }
            else{
                //console.log("Door points to itself...");
            }
 
            
        }

        
  

        for(let row = 0; row < rowSize; row++)
        {
            rowNeedsDoor = false;
            allDungeonCellElements.push([]);

            for(let i = 0; i < doorPositions.length; i++)
            {
                if(doorPositions[i][1] === row)
                {
                        rowNeedsDoor = true;
                }
                else
                {
                    rowNeedsDoor = false;
                }
            }

        

            for(let cell = 0; cell < rowSize; cell++)
            {

                
                    
                  

                const cellElement = document.createElement("p"); // New cell DOM element
                cellElement.classList.add("map-cell");
                
                allDungeonCells[row][cell].id = idIndex;

         

                if(rowNeedsDoor && cell === randomDoorCellTop)
                {

          

                    allDungeonCells[row][cell].contents = "Door";
                    allDungeonCells[row][cell].quantity = 10;

                    cellElement.textContent = "D";
                    cellElement.classList.add("map-cell-door");

                    if(doorCoordinates.length === 0)
                    {
                        doorCoordinates.push([row, cell]);
                    }
                    
                    

                }

                else if(row === playerPosition[0] && cell === playerPosition[1])
                {
                    allDungeonCells[row][cell].contents = "Player";
                    allDungeonCells[row][cell].quantity = 10;
            

                    cellElement.textContent = "P";
                    cellElement.classList.add("map-cell-current");
                    cellElement.id = "map-cell-current";

                }
                else
                {
                    let enemyHere = false;
                    
                    
                    for(let i = 0; i < tempEnemyPositions.length; i++)
                    {
            
                        if(tempEnemyPositions[i][0] === row && tempEnemyPositions[i][1] === cell)
                        {
                            const enemyName = enemiesInDungeon[i][0];
                            cellElement.textContent = enemyName[0];
                            const enemyHealth = enemiesInDungeon[i][1];
                            allDungeonCells[row][cell].contents = enemyName;
                            allDungeonCells[row][cell].quantity = enemyHealth;
                            enemyHere = true;
                            break;
                            
                        }
               
                    }

                    if(!enemyHere )
                    {
                        cellElement.textContent = "///";
                        cellElement.classList.add('map-cell-empty');
                        allDungeonCells[row][cell].contents = "Empty";
                        allDungeonCells[row][cell].quantity = 0;
                    }
                    
                }
                allDungeonCellElements[row].push(cellElement);


                dungeonMap.appendChild(cellElement);
                idIndex ++;
     
            }
           
                
        } 
    }

    function ClearCells()
    {
   
        
        while(dungeonMap.firstChild){
            dungeonMap.removeChild(dungeonMap.lastChild);
        }


  
        
       
    }

    

    function StartEnemyLoop() {
        if (enemyLoopInterval !== null) {
            clearInterval(enemyNormalSpeedLoopInterval);
        }

    
        enemyNormalSpeedLoopInterval = setInterval(() => {
            
            ResetCanMove(normalSpeedCanMove);

            normalSpeedCanMove = false;

        }, normalMovementDelay);
    }

    function StopEnemyLoop() {
        if (enemyLoopInterval !== null) {
            clearInterval(enemyLoopInterval);
            enemyLoopInterval = null;
        }
    }

    function ResetCanMove(canMove)
    {
        canMove = true;
    }


})


// To Call Dungeon Cell Content
// dungeonCellsWithContents for whole 3d Array
// dungeonCellWithContents[i] with i for horizontal row number
// dungeonCellWithContents[i][j] with j for individual cell within row
// dungeonCellWithContents[i][j].position for cell position
// dungeonCellWithContents[i][j].position[0] for cell position X
// dungeonCellWithContents[i][j].position[1] for cell position Y
// dungeonCellWithContents[i][j].contents  for cell contents
// dungeonCellWithContents[i][j].quantity for cell contents quantity(health etc) (number)
// dungeonCellWithContents[i][j].id for cell id if not empty
