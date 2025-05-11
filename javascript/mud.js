document.addEventListener("DOMContentLoaded", function() {

    let dungeonData = [];
    let tempDungeonIndex = 2;
    let cellCount;
    let rowSize;
    let rowArray;
    let cellRow;
    let moveIsValid = false;

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
        ClearCells();
        BuildDungeon();
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
            BuildDungeon();
        });  
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

        if(moveIsValid)
        {
            const newPlayerPosition = [
                playerPosition[0] + amount[0],
                playerPosition[1] + amount[1]
            ];
        
            ClearCells();
        
            playerPosition = newPlayerPosition;
        
            MoveEnemies();
            RenderDungeon()
        }
    }

    function MoveEnemies()
    {

        for(let i = 0; i < enemiesInDungeon.length; i++)
        {
            let randomX = Math.floor(Math.random() * 1);

            let enemyX = tempEnemyPositions[i][0];
            let enemyY = tempEnemyPositions[i][1];

            enemyX += getRandomIntInclusive(-1, 1);
            enemyY += getRandomIntInclusive(-1, 1);

            if(enemyX === playerPosition[0] && enemyY === playerPosition[1])
            {
               break;
            }
            else{
                tempEnemyPositions[i] = [enemyX, enemyY];
            }
            
        }

        
    }

    function getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
      }

    function BuildDungeon()
    {
        SetPlayerStartPosition();
        SetEnemyStartPositions();
        //AddIDToEnemies();
        //CreateObjectsForEnemies();
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
        console.log(enemiesInDungeon);

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

        console.log(tempEnemyPositions);
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

        for(let row = 0; row < rowSize; row++)
        {
            for(let cell = 0; cell < rowSize; cell++)
            {
                
                const cellElement = document.createElement("p"); // New cell DOM element
                cellElement.classList.add("map-cell");
                
                allDungeonCells[row][cell].id = idIndex;

                if(row === playerPosition[0] && cell === playerPosition[1])
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

        const previousPositionCell = document.getElementById("map-cell-current");

        if (previousPositionCell) {
            previousPositionCell.removeAttribute("id");
            previousPositionCell.classList.remove("map-cell-current");
            previousPositionCell.textContent = " ";
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
