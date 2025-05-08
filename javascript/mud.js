document.addEventListener("DOMContentLoaded", function() {

    let dungeonData = [];
    let cellCount;
    let rowSize;
    let rowArray;
    let moveIsValid = false;

    const mudContainer = document.getElementById("mudContainer");
    const dungeonMap = document.getElementById("dungeonMap");

    const upArrow = document.getElementById("moveUp");
    const downArrow = document.getElementById("moveDown");
    const leftArrow = document.getElementById("moveLeft");
    const rightArrow = document.getElementById("moveRight");
    let playerPosition = [0,0];

    let tempEnemyPositions= [];

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
                if (x === tempEnemyPositions[i][0] && y === tempEnemyPositions[i][1]) {
                    console.log("Hit enemy!");
                    tempEnemyPositions[i] = [-1, -1]; // mark enemy as dead
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

            cellCount = dungeonData[2].size;
            rowSize = Math.sqrt(cellCount);

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

        

        let randomX = GenerateRandomPosition();
        let randomY = GenerateRandomPosition();

        

        playerPosition = [randomX, randomY];

        for(let i = 0; i < 5; i++)
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
        console.log(tempEnemyPositions);
        RenderDungeon(playerPosition[0], playerPosition[1], tempEnemyPositions);


        
    }

    function GenerateRandomPosition()
    {
        return  Math.floor( Math.random() * (rowSize));
    }

    function RenderDungeon(playerX, playerY, enemyPositions)
    {

        for(let i = 0; i < rowSize; i++)
        {
            
            rowArray = [];

            for(let j = 0; j < rowSize; j++)
            {
                const cell = document.createElement("p");


                    if(playerX === i && playerY === j)
                    {
                        cell.textContent = "P";
                        cell.classList.add("map-cell-current");
                        cell.id = "map-cell-current";
                    }
                    else
                    {
                        let enemyHere = false;

                        for (let k = 0; k < enemyPositions.length; k++) {
                            const [ex, ey] = enemyPositions[k];
                            if (ex === i && ey === j) {
                                cell.textContent = "E";
                                enemyHere = true;
                                break;
                            }
                        }

                        if (!enemyHere) {
                            cell.textContent = " ";
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

            }
            dungeonCellPositions.push(rowArray); // Add the row to the full array
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
                obstacle = "enemy"
                window.alert(`You see an ${obstacle}...`);
            }
        }
        
    }


})