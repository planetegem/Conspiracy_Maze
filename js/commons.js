let canvas = document.getElementById("playfield"),
    ctx = canvas.getContext("2d"),
    canvasWidth = canvas.clientWidth,
    randomIndex, starttime,
    currentLevel, walls, currentMaze, interval, roundedInterval, exit, player,
    currentAnimationFrame;

// COLLISION DETECTION IF PLAYER IS CIRCLE
function checkColCircle(sX, sY, sWidth, sHeight, cX, cY, radius){
    // credits to https://gist.github.com/vonWolfehaus/5023015
    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }
    let closestX = clamp(cX, sX, sX+sWidth),
        closestY = clamp(cY, sY, sY+sHeight),
        distanceX = cX - closestX,
        distanceY = cY - closestY,
        distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    
    if (distanceSquared < (radius * radius)){
        return true;
    }    
}
// COLLISION DETECTION IF PLAYER IS SQUARE
function checkColSquare(sX, sY, sWidth, sHeight, pX, pY, pWidth, pHeight){
    if (pX < sX + sWidth && pX + pWidth > sX && pY < sY + sHeight && pY + pHeight > sY){
        return true;
    }
}
// UTILITY FUNCTION TO RETURN SPECIFIC INDEX OF A CELL IN A MAZE
function search(posx,  posy, maze){
    let cell = maze.findIndex(cell => (cell.x === posx && cell.y === posy));
    return cell;
}
// EGALIZE MOVE SPEEDS TO SCREEN WIDTH
function egalizeMoveStats(){
    let screenSizeModifier = canvasWidth / 800; // 800px is benchmark
    
    accelerationRate *= screenSizeModifier;
    maxSpeed *= screenSizeModifier;
}
// PREPARE CURRENT EXIT & WALLS TO CHECK AGAINST COLLISIONS (RUN ONCE WHEN LOADING NEW MAZE)
function findExit(){
    exit = currentMaze.find(element => element.exit === true);
    exit = {x: exit.x*interval, y: exit.y*interval, width: roundedInterval, height: roundedInterval};
}
function createWallsArray(){
    walls = [];
    for (let i = 0; i < currentMaze.length; i++){
        if (currentMaze[i].wall === true){
            walls.push({x: currentMaze[i].x*interval, y: currentMaze[i].y*interval, width: roundedInterval*1.01, height: roundedInterval*1.01});
        }
    }
}
// UNSTUCK PLAYER
function unstuckPlayer(){
    // 1. CREATE ARRAY OF SAFE POINTS
    let safeZone = [];
    for (let i = 0; i < currentMaze.length; i++){
        if (currentMaze[i].wall === false){
            safeZone.push({x: currentMaze[i].x*interval + roundedInterval*0.5, y: currentMaze[i].y*interval + roundedInterval*0.5});
        }
    }
    // 2. FIND CLOSEST SAFE POINT
    let currentDistance = 2000,
        safeX, safeY, tempDistance;
    for (let i = 0; i < safeZone.length; i++){
        tempDistance = Math.abs(player.x - safeZone[i].x) + Math.abs(player.y - safeZone[i].y);
        if (tempDistance < currentDistance){
            safeX = safeZone[i].x;
            safeY = safeZone[i].y;
        }
        currentDistance = Math.min(currentDistance, tempDistance);
    }
    // 3. TELEPORT PLAYER
    if (level[currentLevel].repainter === simpleSquare){
        player.x = safeX - player.width*0.5;
        player.y = safeY - player.height*0.5;
    } else {
        player.x = safeX;
        player.y = safeY;
    }
}
// MAZE REGEN & MOVE EXIT AWAY FROM PLAYER
function newExit(){
    // REMOVE CURRENT EXIT
    let exitIndex = currentMaze.findIndex(object => {
        return object.exit === true;
    });
    currentMaze[exitIndex].exit = false;
    
    // SELECT NEW EXIT IN OPPOSING QUADRANT
    let possibleExit = [];
    if (player.x <= canvasWidth/2 && player.y <= canvas.height/2){
        for (let i = 0; i < currentMaze.length; i++){
            if (currentMaze[i].wall === false && (currentMaze[i].x === level[currentLevel].width-2  || currentMaze[i].y === level[currentLevel].height-2)){
               possibleExit.push({x: currentMaze[i].x, y: currentMaze[i].y});
            }
        }
    } else if (player.x <= canvasWidth/2 && player.y > canvas.height/2){
        for (let i = 0; i < currentMaze.length; i++){
            if (currentMaze[i].wall === false && (currentMaze[i].x === level[currentLevel].width-2  ||currentMaze[i].y === 1)){
               possibleExit.push({x: currentMaze[i].x, y: currentMaze[i].y});
            }
        }
    } else if (player.x > canvasWidth/2 && player.y > canvas.height/2){
        for (let i = 0; i < currentMaze.length; i++){
            if (currentMaze[i].wall === false && (currentMaze[i].x === 1 || currentMaze[i].y === 1)){
               possibleExit.push({x: currentMaze[i].x, y: currentMaze[i].y});
            }
        }
    } else if (player.x > canvasWidth/2 && player.y <= canvas.height/2){
        for (let i = 0; i < currentMaze.length; i++){
            if (currentMaze[i].wall === false && (currentMaze[i].x === 1 || currentMaze[i].y === level[currentLevel].height-2)){
               possibleExit.push({x: currentMaze[i].x, y: currentMaze[i].y});
            }
        }
    }
    randomIndex = Math.floor(Math.random()*possibleExit.length);
    let current = search(possibleExit[randomIndex].x, possibleExit[randomIndex].y, currentMaze);
    currentMaze[current].exit = true;
    nextExit = {x: currentMaze[current].x*interval, y: currentMaze[current].y*interval};
}
function regenerateMaze(){
    inPlay = false;
    peacockSound.play(); 
    cancelAnimationFrame(currentAnimationFrame);
    // GENERATE NEW MAZE
    level[currentLevel].maze = [];
    level[currentLevel].mazeGenerator(level[currentLevel].maze, level[currentLevel].width, level[currentLevel].height, level[currentLevel].radius);
    currentMaze = level[currentLevel].maze;
    futureWalls = [];
    
    for (let i = 0; i < level[currentLevel].maze.length; i++){
        if (currentMaze[i].wall === true){
            futureWalls.push({x: currentMaze[i].x*interval, y: currentMaze[i].y*interval, width: roundedInterval, height: roundedInterval});
        }
    }
    newExit();
    starttime = Date.now();
    currentAnimationFrame = requestAnimationFrame(mazeRegenAnimation);
}
// ALTERNATIVE START: PLACE PLAYER AT OUTSIDE WALLS
function placePlayerOutside(){
    let safeZone = [{x: interval, y: interval},
                    {x: interval, y: (level[currentLevel].height-2)*interval},
                    {x: (level[currentLevel].width-2)*interval, y: interval},
                    {x: (level[currentLevel].width-2)*interval, y: (level[currentLevel].height-2)*interval}];

    randomIndex = Math.floor(Math.random()*safeZone.length);
    player.x = safeZone[randomIndex].x + interval*0.5;
    player.y = safeZone[randomIndex].y + interval*0.5;
}

// RESET EVERYTHING, RUN ONCE WHEN STARTING NEW LEVEL
function resetProps(){
    currentMaze = level[currentLevel].maze;
    interval = canvasWidth / level[currentLevel].width;
    roundedInterval = Math.ceil(interval) + 0.2;
    createWallsArray();
    findExit();
    speedX = 0; 
    speedY = 0;
    previousPos = [{x: canvasWidth/2, y: canvasWidth/2}];
    invisMaze = false;
    cancelAnimationFrame(currentAnimationFrame);
    canvas.style.transform = "rotate(0deg)";
    adjustVolume();
}
// LEVEL CALL FUNCTIONS
function goToLevel0(){ // FLAT EARTH
    // BASELINE
    currentLevel = 0;
    resetProps();
    
    // MOVEMENT PARAMETERS
    bounce = 0.05;
    accelerationRate = 0.25;
    friction = 0.9;
    maxSpeed = 5;
    egalizeMoveStats();
    
    // PLAYER HITBOX
    player = {
        x: canvasWidth/2 - (interval/2)*0.85,
        y: canvasWidth/2 - (interval/2)*0.85,
        width: interval*0.85,
        height: interval*0.85
    };
    trailLength = 0;
    
    // START ANIMATION
    audioFader(zoeLoop2, 0.5, 2);
    starttime = Date.now();
    currentAnimationFrame = requestAnimationFrame(fadeInText);
}
function goToLevel1(){ // VAN ALLEN RADIATION BELT
    // BASELINE
    currentLevel = 1;
    resetProps();
    
    // MOVEMENT PARAMETERS
    bounce = 0.15;
    accelerationRate = 0.25;
    friction = 0.99;
    maxSpeed = 5;
    egalizeMoveStats();
    
    // PLAYER HITBOX
    player = {
        x: canvasWidth/2 - (interval/2)*0.85,
        y: canvasWidth/2 - (interval/2)*0.85,
        width: interval*0.85,
        height: interval*0.85
    };
    trailLength = 5;
    
    // START ANIMATION
    audioFader(zoeLoop3, 0.5, 2);
    starttime = Date.now();
    currentAnimationFrame = requestAnimationFrame(fadeInText);
}
function goToLevel2(){ // MOON HOAX
    // BASELINE
    currentLevel = 2;
    resetProps();
    
    // MOVEMENT PARAMETERS
    bounce = 0.1;
    accelerationRate = 0.1;
    friction = 1;
    maxSpeed = 2;
    egalizeMoveStats();
    
    // PLAYER HITBOX
    player = {
        x: canvasWidth/2,
        y: canvasWidth/2,
        radius: interval*0.425,
    };
    
    // REGEN COUNTER & ANIMATION
    redrawCounter = 0;
    maxRegen = 0;
    trailLength = 0;
    
    // START ANIMATION
    audioFader(zoeLoop, 0.4, 2);
    starttime = Date.now();
    currentAnimationFrame = requestAnimationFrame(fadeInText);
}
function goToLevel3(){ // MOON PROJECTION
    // BASELINE
    currentLevel = 3;
    resetProps();
    
    // MOVEMENT PARAMETERS
    bounce = 0.1;
    accelerationRate = 0.25;
    friction = 0.99;
    maxSpeed = 5;
    egalizeMoveStats();
    
    // PLAYER HITBOX
    player = {
        x: canvasWidth/2,
        y: canvasWidth/2,
        radius: interval*0.425,
    };
    
    // REGEN COUNTER & ANIMATION
    redrawCounter = 0;
    maxRegen = 1;
    trailLength = 10;
    
    // START ANIMATION
    audioFader(zoeLoop4, 0.4, 2);
    starttime = Date.now();
    currentAnimationFrame = requestAnimationFrame(fadeInText);
}
function goToLevel4(){ // HOLLOW EARTH
    // BASELINE
    currentLevel = 4;
    resetProps();
    
    // MOVEMENT PARAMETERS
    bounce = 0.2;
    accelerationRate = 0.20;
    friction = 0.99;
    maxSpeed = 5.3;
    egalizeMoveStats()
    
    // PLAYER HITBOX
    player = {
        x: canvasWidth/2,
        y: canvasWidth/2,
        radius: interval*0.375,
    }
    
    playerRotation = 0;
    jumpPos = {x: player.x, y: player.y};
    
    // START ANIMATION
    audioFader(zoeLoop6, 0.6, 2);
    starttime = Date.now();
    currentAnimationFrame = requestAnimationFrame(fadeInText);
}
function goToLevel5(){ // REPTILE RULER
    // BASELINE
    currentLevel = 5;
    resetProps();
    
    // MOVEMENT PARAMETERS
    bounce = 0.1;
    accelerationRate = 0.20;
    friction = 0.95;
    maxSpeed = 5.3;
    egalizeMoveStats();
    
    // PLAYER HITBOX
    player = {
        x: canvasWidth/2,
        y: canvasWidth/2,
        radius: interval*0.375,
    }
    
    playerRotation = 0;
    jumpPos = {x: player.x, y: player.y};
    
    // START ANIMATION
    audioFader(zoeLoop2, 0.8, 1.5);
    starttime = Date.now();
    currentAnimationFrame = requestAnimationFrame(fadeInText);
}
function goToLevel6(){ // VRIL SOCIETY
    // BASELINE
    currentLevel = 6;
    resetProps();
    
    // MOVEMENT PARAMETERS
    bounce = 0.2;
    accelerationRate = 0.25;
    friction = 0.99;
    maxSpeed = 5;
    egalizeMoveStats();
    
    // PLAYER HITBOX
    player = {
        x: canvasWidth/2,
        y: canvasWidth/2,
        radius: interval*0.425,
    }
    
    playerRotation = 0;
    trailLength = 0;
    invisMaze = true;
    
    // START ANIMATION
    audioFader(zoeLoop5, 0.6, 2);
    starttime = Date.now();
    currentAnimationFrame = requestAnimationFrame(fadeInText);
}
function goToLevel7(){ // CHEM TRAIL
    // BASELINE
    currentLevel = 7;
    resetProps();
    
    // MOVEMENT PARAMETERS
    bounce = 0.15;
    accelerationRate = 0.20;
    friction = 0.995;
    maxSpeed = 4;
    egalizeMoveStats();
    
    // PLAYER HITBOX
    player = {
        x: canvasWidth/2,
        y: canvasWidth/2,
        radius: interval*0.375,
    }
    
    // REGEN COUNTER & ANIMATION
    redrawCounter = 0;
    maxRegen = 1;
    trailLength = 50;
    
    // START ANIMATION
    audioFader(zoeLoop4, 0.4, 2);
    starttime = Date.now();
    currentAnimationFrame = requestAnimationFrame(fadeInText);
}
function goToLevel8(){ // GLOBAL WARMING
    // BASELINE
    currentLevel = 8;
    resetProps();
    
    // MOVEMENT PARAMETERS
    bounce = 0.1;
    accelerationRate = 0.20;
    friction = 0.95;
    maxSpeed = 5.3;
    egalizeMoveStats();
    
    // PLAYER HITBOX
    player = {
        x: canvasWidth/2,
        y: canvasWidth/2,
        radius: interval*0.375,
    }
    
    playerRotation = 0;
    jumpPos = {x: player.x, y: player.y};
    trailLength = 4;
    
    // START ANIMATION
    audioFader(zoeLoop5, 0.6, 2);
    starttime = Date.now();
    currentAnimationFrame = requestAnimationFrame(fadeInText);
}
function goToLevel9(){ // 5G TRACKERS
    // BASELINE
    currentLevel = 9;
    resetProps();
    
    // MOVEMENT PARAMETERS
    bounce = 0.2;
    accelerationRate = 0.25;
    friction = 0.99;
    maxSpeed = 5;
    egalizeMoveStats();
    
    // PLAYER HITBOX
    player = {
        x: canvasWidth/2,
        y: canvasWidth/2,
        radius: interval*0.375,
    }
    playerRotation = 0;

    // START ANIMATION
    audioFader(zoeLoop3, 0.5, 2);
    starttime = Date.now();
    currentAnimationFrame = requestAnimationFrame(fadeInText);
}
function goToLevel10(){ // CERNUNNOS
    // BASELINE
    currentLevel = 10;
    resetProps();
    
    // MOVEMENT PARAMETERS
    bounce = 0.2;
    accelerationRate = 0.25;
    friction = 0.99;
    maxSpeed = 5;
    egalizeMoveStats();
    
    // PLAYER HITBOX
    player = {
        x: canvasWidth/2,
        y: canvasWidth/2,
        radius: interval*0.375,
    }
    playerRotation = 0;
    canvasAngle = 0;
    canvas.style.transform = "rotate(0deg)";

    // START ANIMATION
    audioFader(zoeLoop5, 0.6, 2);
    starttime = Date.now();
    currentAnimationFrame = requestAnimationFrame(fadeInText);
}
function goToLevel11(){ // BLACK HOLE
    // BASELINE
    currentLevel = 11;
    resetProps();
    
    // MOVEMENT PARAMETERS
    bounce = 0.05;
    accelerationRate = 0.20;
    friction = 0.99;
    maxSpeed = 4;
    egalizeMoveStats();
    
    // PLAYER HITBOX
    player = {
        x: canvasWidth/2,
        y: canvasWidth/2,
        radius: interval*0.375,
    }
    placePlayerOutside();
    exit.x = canvasWidth/2 - (interval/2);
    exit.y = canvasWidth/2 - (interval/2);
    canvasAngle = 0;
    canvas.style.transform = "rotate(0deg)";

    // START ANIMATION
    audioFader(zoeLoop7, 0.4, 3);
    starttime = Date.now();
    currentAnimationFrame = requestAnimationFrame(fadeInText);
}