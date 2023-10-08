let currentX, currentY, 
    path = [], path2 = [], primsFrontier = [];

// UTILITY FUNCTIONS
function markWallsVisited(element, resultMaze){
    let current = resultMaze.findIndex(cell => (cell.x === element.x - 1 && cell.y === element.y));
    resultMaze[current].visited = true;
    current = resultMaze.findIndex(cell => (cell.x === element.x + 1 && cell.y === element.y));
    resultMaze[current].visited = true;
    current = resultMaze.findIndex(cell => (cell.x === element.x && cell.y === element.y + 1));
    resultMaze[current].visited = true;
    current = resultMaze.findIndex(cell => (cell.x === element.x && cell.y === element.y - 1));
    resultMaze[current].visited = true;
}
function markCellVisited(currentX, currentY, resultMaze){
    let current = search(currentX, currentY, resultMaze);
    resultMaze[current].visited = true;
}
function createStartZone(resultMaze, mazeWidth, mazeHeight, radius, frontier){
    // CREATE ARRAY & INDICATE BORDERS AS WALLS
    let rownIndex, colIndex;
    for (rowIndex = 1; rowIndex <= mazeHeight; rowIndex++){
        for (colIndex = 1; colIndex <= mazeWidth; colIndex++){
            if (rowIndex != 1 && colIndex != 1 && colIndex != mazeWidth && rowIndex != mazeHeight){
                resultMaze.push({x: colIndex-1, y: rowIndex-1, visited: false, wall: true, exit: false});
            } else {
                resultMaze.push({x: colIndex-1, y: rowIndex-1, visited: true, wall: true, exit: false});
            }
        }
    }
    // PREPARE STARTING ZONE
    let midX = Math.floor(mazeWidth/2),
        midY = Math.floor(mazeHeight/2),
        current;
        
    for (let x = -((radius-1)/2); x < (radius-1)/2 +1; x++){
        for (let y = -((radius-1)/2); y < (radius-1)/2 +1; y++){
            current = search(midX + x, midY + y, resultMaze);
            resultMaze[current].visited = true;
            resultMaze[current].wall = false;
            markWallsVisited(resultMaze[current], resultMaze);
        }
    }
    // CREATE ARRAY WITH POSSIBLE STARTING LOCATIONS
    for (let f = -((radius-1)/2); f < (radius-1)/2 +1; f++){
        frontier.push({x: midX+3, y: midY-f});
        frontier.push({x: midX-f, y: midY-3});
        frontier.push({x: midX-f, y: midY+3});
        frontier.push({x: midX-3, y: midY-f});
        f++;
    }
}
function prepareStartCell(frontier, path, resultMaze, mazeWidth, mazeHeight){
    let midX = Math.floor(mazeWidth/2),
        midY = Math.floor(mazeHeight/2);
    
    // SELECT RANDOM CELL FROM FRONTIER
    randomIndex = Math.floor(Math.random()*frontier.length);
    currentX = frontier[randomIndex].x;
    currentY = frontier[randomIndex].y;
    path.push({x: currentX, y: currentY});
    frontier.splice(randomIndex, 1);
    markCellVisited(currentX, currentY, resultMaze);
    
    // 2. BREAK WALL TO CENTER
    if (currentX === midX+3){
        current = search(midX+2, currentY, resultMaze);
        resultMaze[current].wall = "false";
    } else if (currentX === midX-3){
        current = search(midX-2, currentY, resultMaze);
        resultMaze[current].wall = "false";
    } else if (currentY === midY-3){
        current = search(currentX, midY-2, resultMaze);
        resultMaze[current].wall = "false";
    } else if (currentY === midY+3){
        current = search(currentX, midY+2, resultMaze);
        resultMaze[current].wall = "false";
    } 
}
function placeExit(currentMaze, mazeWidth, mazeHeight){
    let possibleExit = [];
    for (let i = 0; i < currentMaze.length; i++){
        if (currentMaze[i].wall === false && (currentMaze[i].x === 1 || currentMaze[i].y === 1 || currentMaze[i].x === mazeWidth-2  || currentMaze[i].y === mazeHeight -2)){
               possibleExit.push({x: currentMaze[i].x, y: currentMaze[i].y});
        }
    }
    randomIndex = Math.floor(Math.random()*possibleExit.length);
    let current = search(possibleExit[randomIndex].x, possibleExit[randomIndex].y, currentMaze);
    currentMaze[current].exit = true;
}

// PRIM'S ALGORITHM, SHORT HALLS
function generatePrimsMaze(resultMaze, mazeWidth, mazeHeight, radius){
    createStartZone(resultMaze, mazeWidth, mazeHeight, radius, primsFrontier);
    
    // 1. MARK FRONTIER AS VISITED
    for (let i = 0; i < primsFrontier.length; i++){
        markCellVisited(primsFrontier[i].x, primsFrontier[i].y, resultMaze);
    }
    function createMaze(){
        // 2. CHOOSE CELL FROM FRONTIER
        randomIndex = Math.floor(Math.random()*primsFrontier.length);
        currentX = primsFrontier[randomIndex].x;
        currentY = primsFrontier[randomIndex].y;
        
        // 3. REMOVE FROM FRONTIER
        primsFrontier.splice(randomIndex, 1);
        
        // 4. OPEN CELL AND MAKE PART OF MAZE
        let current = search(currentX, currentY, resultMaze);
        resultMaze[current].wall = false;
        
        // 5. CHECK WHICH WALLS CONNECT TO MAZE
        let possibleExits = [];
        if (currentX > 2){
            current = search(currentX-2, currentY, resultMaze);
            if (!resultMaze[current].wall){
                possibleExits.push({x: currentX-1, y: currentY});
            }
        }
        if (currentX < mazeWidth - 2){
            current = search(currentX+2, currentY, resultMaze);
            if (!resultMaze[current].wall){
                possibleExits.push({x: currentX+1, y: currentY});
            }
        }
        if (currentY > 2){
            current = search(currentX, currentY-2, resultMaze);
            if (!resultMaze[current].wall){
                possibleExits.push({x: currentX, y: currentY-1});
            }
        }
        if (currentY < mazeHeight - 2){
            current = search(currentX, currentY+2, resultMaze);
            if (!resultMaze[current].wall){
                possibleExits.push({x: currentX, y: currentY+1});
            }
        }
        // 6. CHOOSE RANDOM WALL TO BREAK
        if (possibleExits.length > 0){
            randomIndex = Math.floor(Math.random()*possibleExits.length);
            current = search(possibleExits[randomIndex].x, possibleExits[randomIndex].y, resultMaze);
            resultMaze[current].wall = false;
        }
        // 7. FURTHER FILL FRONTIER
        if (currentX > 2){
            current = search(currentX-2, currentY, resultMaze);
            if (!resultMaze[current].visited){
                primsFrontier.push({x: currentX-2, y: currentY});
                resultMaze[current].visited = true;
            }
        }
        if (currentX < mazeWidth - 2){
            current = search(currentX+2, currentY, resultMaze);
            if (!resultMaze[current].visited){
                primsFrontier.push({x: currentX+2, y: currentY});
                resultMaze[current].visited = true;
            }
        }
        if (currentY > 2){
            current = search(currentX, currentY-2, resultMaze);
            if (!resultMaze[current].visited){
                primsFrontier.push({x: currentX, y: currentY-2});
                resultMaze[current].visited = true;
            }
        }
        if (currentY < mazeHeight-2){
            current = search(currentX, currentY+2, resultMaze);
            if (!resultMaze[current].visited){
                primsFrontier.push({x: currentX, y: currentY+2});
                resultMaze[current].visited = true;
            } 
        }
        // 8. IF PRIMS FRONTIER IS NOT EMPTY, GO BACK TO STEP 2
        if (primsFrontier.length > 0){
            createMaze();
        }
    }
    createMaze();
    placeExit(resultMaze, mazeWidth, mazeHeight);
}
function generateBacktrackMaze(resultMaze, mazeWidth, mazeHeight, radius){
    let frontier = [];
        
    createStartZone(resultMaze, mazeWidth, mazeHeight, radius, frontier);
    prepareStartCell(frontier, path, resultMaze, mazeWidth, mazeHeight);
    
    function cutPath(){
        // MARK CURRENT CELL AS VISITED & REMOVE WALL
        let current = search(currentX, currentY, resultMaze);
        resultMaze[current].visited = true;
        resultMaze[current].wall = false;
    
        // CREATE FRONTIER & REMEMBER DIRECTION
        let frontier = [];
        if (currentX > 2){
            current = search(currentX-2, currentY, resultMaze);
            if (resultMaze[current].visited === false){
                frontier.push({x: currentX-2, y: currentY, direction: "left"});
            }
        }
        if (currentX < mazeWidth - 3){
            current = search(currentX+2, currentY, resultMaze);
            if (resultMaze[current].visited === false){
                frontier.push({x: currentX+2, y: currentY, direction: "right"});
            }
        }
        if (currentY > 2){
            current = search(currentX, currentY-2, resultMaze);
            if (resultMaze[current].visited === false){
                frontier.push({x: currentX, y: currentY-2, direction: "up"});
            }
        }
        if (currentY < mazeHeight-3){
            current = search(currentX, currentY+2, resultMaze);
            if (resultMaze[current].visited === false){
                frontier.push({x: currentX, y: currentY+2, direction: "down"});
            } 
        }
        
        // SELECT NEXT CELL FROM FRONTIER OR RETURN IF FRONTIER EMPTY
        if (frontier.length > 0){
            randomIndex = Math.floor(Math.random()*frontier.length);
            switch (frontier[randomIndex].direction){
                case "left":
                    current = search(currentX-1, currentY, resultMaze);
                    resultMaze[current].wall = false;
                    markWallsVisited(resultMaze[current], resultMaze);
                    break;
                case "right":
                    current = search(currentX+1, currentY, resultMaze);
                    resultMaze[current].wall = false;
                    markWallsVisited(resultMaze[current], resultMaze);
                    break;
                case "down":
                    current = search(currentX, currentY+1, resultMaze);
                    resultMaze[current].wall = false;
                    markWallsVisited(resultMaze[current], resultMaze);
                    break;
                case "up":
                    current = search(currentX, currentY-1, resultMaze);
                    resultMaze[current].wall = false;
                    markWallsVisited(resultMaze[current], resultMaze);
            }
            current = search(frontier[randomIndex].x, frontier[randomIndex].y, resultMaze);
            currentX = resultMaze[current].x;
            currentY = resultMaze[current].y;
            path.push({x: currentX, y: currentY});
        } else {
            path.pop();
            if (path.length > 0){
                currentX = path[path.length-1].x;
                currentY = path[path.length-1].y;
            }
        }
        if (path.length > 0){
            cutPath();
        }
    }
    cutPath();
    placeExit(resultMaze, mazeWidth, mazeHeight);
}
function doubleBacktrackMaze(resultMaze, mazeWidth, mazeHeight, radius){
     let frontier = [];
        
    createStartZone(resultMaze, mazeWidth, mazeHeight, radius, frontier);
    prepareStartCell(frontier, path, resultMaze, mazeWidth, mazeHeight);
    prepareStartCell(frontier, path2, resultMaze, mazeWidth, mazeHeight);
    
    function cutPath(){
        // FIRST PATH
        if (path.length > 0){
            currentX = path[path.length-1].x;
            currentY = path[path.length-1].y;
            let current = search(currentX, currentY, resultMaze);
            resultMaze[current].visited = true;
            resultMaze[current].wall = false;
            
            let frontier = [];
            if (currentX > 2){
                current = search(currentX-2, currentY, resultMaze);
                if (resultMaze[current].visited === false){
                    frontier.push({x: currentX-2, y: currentY, direction: "left"});
                }
            }
            if (currentX < mazeWidth - 3){
                current = search(currentX+2, currentY, resultMaze);
                if (resultMaze[current].visited === false){
                    frontier.push({x: currentX+2, y: currentY, direction: "right"});
                }
            }
            if (currentY > 2){
                current = search(currentX, currentY-2, resultMaze);
                if (resultMaze[current].visited === false){
                    frontier.push({x: currentX, y: currentY-2, direction: "up"});
                }
            }
            if (currentY < mazeHeight-3){
                current = search(currentX, currentY+2, resultMaze);
                if (resultMaze[current].visited === false){
                    frontier.push({x: currentX, y: currentY+2, direction: "down"});
                } 
            }
            if (frontier.length > 0){
                randomIndex = Math.floor(Math.random()*frontier.length);
                switch (frontier[randomIndex].direction){
                    case "left":
                        current = search(currentX-1, currentY, resultMaze);
                        resultMaze[current].wall = false;
                        markWallsVisited(resultMaze[current], resultMaze);
                        break;
                    case "right":
                        current = search(currentX+1, currentY, resultMaze);
                        resultMaze[current].wall = false;
                        markWallsVisited(resultMaze[current], resultMaze);
                        break;
                    case "down":
                        current = search(currentX, currentY+1, resultMaze);
                        resultMaze[current].wall = false;
                        markWallsVisited(resultMaze[current], resultMaze);
                        break;
                    case "up":
                        current = search(currentX, currentY-1, resultMaze);
                        resultMaze[current].wall = false;
                        markWallsVisited(resultMaze[current], resultMaze);
                }
                current = search(frontier[randomIndex].x, frontier[randomIndex].y, resultMaze);
                path.push({x: resultMaze[current].x, y: resultMaze[current].y});
                resultMaze[current].visited = true;
            } else {
                path.pop();
            }
        }
        // SECOND PATH
        if (path2.length > 0){
            currentX = path2[path2.length-1].x;
            currentY = path2[path2.length-1].y;
            let current = search(currentX, currentY, resultMaze);
            resultMaze[current].visited = true;
            resultMaze[current].wall = false;
            
            let frontier = [];
            if (currentX > 2){
                current = search(currentX-2, currentY, resultMaze);
                if (resultMaze[current].visited === false){
                    frontier.push({x: currentX-2, y: currentY, direction: "left"});
                }
            }
            if (currentX < mazeWidth - 3){
                current = search(currentX+2, currentY, resultMaze);
                if (resultMaze[current].visited === false){
                    frontier.push({x: currentX+2, y: currentY, direction: "right"});
                }
            }
            if (currentY > 2){
                current = search(currentX, currentY-2, resultMaze);
                if (resultMaze[current].visited === false){
                    frontier.push({x: currentX, y: currentY-2, direction: "up"});
                }
            }
            if (currentY < mazeHeight-3){
                current = search(currentX, currentY+2, resultMaze);
                if (resultMaze[current].visited === false){
                    frontier.push({x: currentX, y: currentY+2, direction: "down"});
                } 
            }
            if (frontier.length > 0){
                randomIndex = Math.floor(Math.random()*frontier.length);
                switch (frontier[randomIndex].direction){
                    case "left":
                        current = search(currentX-1, currentY, resultMaze);
                        resultMaze[current].wall = false;
                        markWallsVisited(resultMaze[current], resultMaze);
                        break;
                    case "right":
                        current = search(currentX+1, currentY, resultMaze);
                        resultMaze[current].wall = false;
                        markWallsVisited(resultMaze[current], resultMaze);
                        break;
                    case "down":
                        current = search(currentX, currentY+1, resultMaze);
                        resultMaze[current].wall = false;
                        markWallsVisited(resultMaze[current], resultMaze);
                        break;
                    case "up":
                        current = search(currentX, currentY-1, resultMaze);
                        resultMaze[current].wall = false;
                        markWallsVisited(resultMaze[current], resultMaze);
                }
                current = search(frontier[randomIndex].x, frontier[randomIndex].y, resultMaze);
                path2.push({x: resultMaze[current].x, y: resultMaze[current].y});
                resultMaze[current].visited = true;
            } else {
                path2.pop();
            }
        }
    }
    while (path.length > 0 || path2.length > 0){
        cutPath();
    }
    placeExit(resultMaze, mazeWidth, mazeHeight);
}