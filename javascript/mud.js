document.addEventListener("DOMContentLoaded", function() {

    let dungeonData = [];
    let cellCount;
    let rowSize;
    let rowArray;
    let cellRow;
    let moveIsValid = false;

    const dungeonMap = document.getElementById("dungeonMap");

    class DungeonCell {
        constructor(position = [0, 0], contents = ["", 0]) {
            this.position = position;
            this.contents = contents;
        }
    }

    let dungeonCellsWithContents = [];

    console.log(dungeonCellsWithContents);

    const upArrow = document.getElementById("moveUp");
    const downArrow = document.getElementById("moveDown");
    const leftArrow = document.getElementById("moveLeft");
    const rightArrow = document.getElementById("moveRight");
    let playerPosition = [0,0];

    let tempEnemyPositions= [];
    let enemiesInDungeon = [];

    const attackButton = document.getElementById("attackButton");

    attackButton.addEventListener("click", (e) => {
        e.preventDefault();
        Attack();
    })

    let dungeonCellPositions = [];

    AddMoveEventListener(upArrow, [-1, 0]);
    AddMoveEventListener(downArrow, [1, 0]);
    AddMoveEventListener(leftArrow, [0, -1]);
    AddMoveEventListener(rightArrow, [0, 1]);


    const reloadButton = document.getElementById("reloadButton");
    reloadButton.addEventListener("click", (e) => {
        e.preventDefault();
        ClearCells();
        DrawDungeon();
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

                    //tempEnemyPositions[i] = [-1, -1]; // mark enemy as dead

                    const targetEnemyCell = dungeonCellsWithContents[enemyX][enemyY];
                    const targetEnemyName = targetEnemyCell.contents[0];
                    const targetEnemyHealth = targetEnemyCell.contents[1];
                    console.log(targetEnemyName);
                    console.log(targetEnemyHealth);

                    console.log(dungeonCellsWithContents[enemyX][enemyY].contents[0]);
                    dungeonCellsWithContents[enemyX][enemyY].contents[0] = "Hit";
                    console.log(dungeonCellsWithContents[enemyX][enemyY].contents[0]);

                    break;
                }
            }
           
        }
        ClearCells();
        RenderDungeon(playerPosition[0], playerPosition[1], tempEnemyPositions);
    
    

    }

    function GetDungeon()
    {
        fetch("/content/dungeon.json")
        .then(response => response.json())
        .then(data => {
            dungeonData = data;

            let tempDungeonIndex = 2;

            cellCount = dungeonData[tempDungeonIndex].size;
            rowSize = Math.sqrt(cellCount);
      
            enemiesInDungeon = dungeonData[tempDungeonIndex].enemies;
 

            DrawDungeon();
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
                ]
        
                ClearCells();
        
                playerPosition = newPlayerPosition;
        
                RenderDungeon(playerPosition[0], playerPosition[1], tempEnemyPositions)
            }
            
        
        

    }


    function DrawDungeon()
    {
        dungeonCellPositions = []; // Reset it every time you draw
        dungeonCellsWithContents = [];
        

        let randomX = rowSize - 1; // Currently forcing player to start on bottom row
        let randomY = GenerateRandomPosition();

  
        

        playerPosition = [randomX, randomY];

        for(let i = 0; i < enemiesInDungeon.length; i++)
        {
            let randomEnemyX = GenerateRandomPosition();
            let randomEnemyY = GenerateRandomPosition();

            while(randomEnemyX === randomX && randomEnemyY === randomY)
            {
                randomEnemyX = GenerateRandomPosition();
                randomEnemyY = GenerateRandomPosition();
            }

            tempEnemyPositions[i] = [randomEnemyX, randomEnemyY];
        }
      
        RenderDungeon(playerPosition[0], playerPosition[1], tempEnemyPositions);


        
    }

    function GenerateRandomPosition()
    {
        return  Math.floor( Math.random() * (rowSize));
    }

    function RenderDungeon(playerX, playerY, enemyPositions)
    {

        dungeonCellPositions = [];
        dungeonCellsWithContents = [];

        for(let i = 0; i < rowSize; i++)
        {
            
            rowArray = [];
            cellRow = [];


            for(let j = 0; j < rowSize; j++)
            {
                const cell = document.createElement("p");
                let newCell = new DungeonCell([i,j], ["", 0]);

                    if(playerX === i && playerY === j)
                    {
                        cell.textContent = "P";
                        cell.classList.add("map-cell-current");
                        cell.id = "map-cell-current";

                        
                        newCell.contents = ["player", 10];
                    }
                    else
                    {
                        
                        let enemyHere = false;

                        for (let k = 0; k < enemyPositions.length; k++) {
                            const [ex, ey] = enemyPositions[k];
                            if (ex === i && ey === j) {

                                
                                console.log(dungeonCellsWithContents[j]);
                                const enemyName = enemiesInDungeon[k][0];
                                const enemyHealth = enemiesInDungeon[k][1];

                                //console.log(enemyName , enemyHealth);

                                
                                    cell.textContent = enemyName[0] + enemyName[1] + enemyName[2];

                                    
                                    newCell.contents = [enemyName, enemyHealth];
                                
                                
                                enemyHere = true;
                                break;
                            }
                        }

                        if (!enemyHere) {
                            cell.textContent = " ";
                            newCell.contents = ["", null];
                        }

                    }

                cell.classList.add("map-cell")
                dungeonMap.appendChild(cell);

                

                cell.addEventListener('click', (e) =>
                {
                    e.preventDefault();

                    ClearCells();
                    cell.textContent = "O";
                    cell.classList.add("map-cell-current");
                    cell.id = "map-cell-current";
                })

                rowArray.push(cell); // Add the cell to the row
                cellRow.push(newCell);

            }
            dungeonCellPositions.push(rowArray); // Add the row to the full array
            dungeonCellsWithContents.push(cellRow);
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
        const upCell = [newX, newY];
        const downCell = [newX, newY];
        const leftCell = [newX, newY];
        const rightCell = [newX, newY];

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
        const upCell = [newX, newY];
        const downCell = [newX, newY];
        const leftCell = [newX, newY];
        const rightCell = [newX, newY];


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