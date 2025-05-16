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

    let allDungeonCells = [];

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

                    tempEnemyPositions[i] = [-1, -1]; // mark enemy as dead
                

                    break;
                }
            }
           
        }
        ClearCells();
        RenderDungeon();
    
    

    }

    function GetDungeon()
    {
        fetch("/content/dungeon.json")
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

    function movePosition(amount)
    {   
        const [newX, newY] = [playerPosition[0] + amount[0], playerPosition[1] + amount[1]];

        CheckForWalls(newX, newY);
        CheckForEnemies(newX, newY);
        CheckForDoor(newX, newY);

        if(moveIsValid)
        {
            const newPlayerPosition = [
                playerPosition[0] + amount[0],
                playerPosition[1] + amount[1]
            ];
        
            
        
            playerPosition = newPlayerPosition;
        
        }

        ClearCells();
        RenderDungeon();
    }

    function CheckForDoor(posX, posY)
    {
        console.log("Check Door: " + posX + " , " + posY);

        for(let i = 0; i < doorCoordinates.length; i++)
        {
            if(doorCoordinates[i][0] === posX && doorCoordinates[i][1] === posY)
            {
                console.log("player Move to Door");
                tempDungeonIndex = 1;
                ReloadMap();
            }
        }
        
        console.log(doorCoordinates);
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
            let speedMultiplier = 2;

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
            }
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

        randomDoorCellTop = GenerateRandomPosition();
        randomDoorCellBottom = GenerateRandomPosition();

        SetPlayerStartPosition();
        SetEnemyStartPositions();
        GetDoors(dungeonData, roomIndex);
        RenderDungeon();
        
  
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

    function AddIDToEnemies()
    {
        for(let i = 0; i < enemiesInDungeon.length; i++)
        {
            enemiesInDungeon[i][2] = i;
        }
    }

    function CreateObjectsForEnemies()
    {
        enemyObjectsInDungeon  = [];

        for(let i = 0; i < enemiesInDungeon.length; i++)
        {
            let randomEnemyX = GenerateRandomPosition();
            let randomEnemyY = GenerateRandomPosition();

            while(randomEnemyX === playerPosition[0] && randomEnemyY === playerPosition[1])
            {
                randomEnemyX = GenerateRandomPosition();
                randomEnemyY = GenerateRandomPosition();
            }

            const newEnemyCell = new DungeonCell([randomEnemyX,randomEnemyY], enemiesInDungeon[i][0], enemiesInDungeon[i][1], enemiesInDungeon[i][2]);
            enemyObjectsInDungeon.push(newEnemyCell);
            
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

        
        //console.log(doorPositions);

        for(let row = 0; row < rowSize; row++)
        {
            rowNeedsDoor = false;

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

                //console.log(playerPosition);

                

                if(rowNeedsDoor && cell === randomDoorCellTop)
                {

                   // console.log("Cell: " + cell + " should be a door");

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

        /*
        const previousPositionCell = document.getElementById("map-cell-current");

        if (previousPositionCell) {
            previousPositionCell.removeAttribute("id");
            previousPositionCell.classList.remove("map-cell-current");
            previousPositionCell.textContent = " ";
        }*/
  
        
       
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
            obstacle = "wall"
            window.alert(`You hit a ${obstacle}!`);
        }

      
    }

    function CheckForEnemies(newX, newY)
    {

       
        for(let i = 0; i <tempEnemyPositions.length; i++)
        {
            if(newX === tempEnemyPositions[i][0] && newY === tempEnemyPositions[i][1])
            {
                moveIsValid = false;
                obstacle = enemiesInDungeon[i][0];
                window.alert(`A ${obstacle} blocks your path!`);
    
                
            }
        }
        
    }

    function StartEnemyLoop() {
        if (enemyLoopInterval !== null) {
            clearInterval(enemyNormalSpeedLoopInterval);
        }

    
        enemyNormalSpeedLoopInterval = setInterval(() => {
            
            ResetCanMove(normalSpeedCanMove);
            MoveEnemies();
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
