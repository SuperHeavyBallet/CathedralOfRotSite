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
    let tempEnemyPosition = [];

    let dungeonCellPositions = [];

    AddMoveEventListener(upArrow, [-1, 0]);
    AddMoveEventListener(downArrow, [1, 0]);
    AddMoveEventListener(leftArrow, [0, -1]);
    AddMoveEventListener(rightArrow, [0, 1]);


    GetDungeon();

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

        let moveIsValid = 
            newX >= 0 && newX < rowSize &&
            newY >= 0 && newY < rowSize;

            let obstacle = "wall";

            if(newX === tempEnemyPosition[0] && newY === tempEnemyPosition[1])
            {
                moveIsValid = false;
                obstacle = "enemy"
                window.alert(`You hit an ${obstacle}!`);
                return;
            }
            else if(moveIsValid)
            {
                const newPlayerPosition = [
                    playerPosition[0] + amount[0],
                    playerPosition[1] + amount[1]
                ]
        
                ClearCells();
        
                console.log(newPlayerPosition);
        
                playerPosition = newPlayerPosition;
        
                RenderDungeon(playerPosition[0], playerPosition[1], tempEnemyPosition[0], tempEnemyPosition[1])
            }
            else{
                window.alert(`You hit a ${obstacle}!`);
            }
            
        
        

    }


    function DrawDungeon()
    {
        dungeonCellPositions = []; // Reset it every time you draw

        

        let randomX = GenerateRandomPosition();
        let randomY = GenerateRandomPosition();

        let randomEnemyX = GenerateRandomPosition();
        let randomEnemyY = GenerateRandomPosition();

        while(randomEnemyX === randomX && randomEnemyY === randomY)
        {
            randomEnemyX = GenerateRandomPosition();
            randomEnemyY = GenerateRandomPosition();
        }

        playerPosition = [randomX, randomY];
        tempEnemyPosition = [randomEnemyX, randomEnemyY];
        RenderDungeon(playerPosition[0], playerPosition[1], tempEnemyPosition[0], tempEnemyPosition[1]);


        
    }

    function GenerateRandomPosition()
    {
        return  Math.floor( Math.random() * (rowSize));
    }

    function RenderDungeon(playerX, playerY, enemyX, enemyY)
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
                        if(enemyX === i & enemyY === j)
                        {
                            cell.textContent = "E";
                        }
                        else{
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
        }

        dungeonCellPositions.push(rowArray); // Add the row to the full array
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

})