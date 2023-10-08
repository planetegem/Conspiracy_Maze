// MOVEMENT VARIABLES
let speedX, speedY, maxSpeed,
    accelerationRate,friction, bounce;
    
// REGEN DURING GAMEPLAY
let redrawCounter = 0,
    maxRegen = 0,
    futureWalls, nextExit;

// ANIMATION VARIABLES
let trailLength, previousPos;
    
// OPTION 1: BASIC TOP DOWN MOVEMENT, SQUARE HITBOX
function simpleSquare(){
    inPlay = true;
    if (keys.left){
        speedX -= accelerationRate;
    } else if (keys.right){
        speedX += accelerationRate;
    }
    if (keys.up){
        speedY -= accelerationRate;
    } else if (keys.down){
        speedY += accelerationRate;
    }
    speedX = Math.min(maxSpeed, Math.max(-maxSpeed, speedX));
    speedX *= friction;
    speedY = Math.min(maxSpeed, Math.max(-maxSpeed, speedY));
    speedY *= friction;
    for (let i = 0; i < walls.length; i++){
        let hitX = checkColSquare(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x + speedX, player.y, player.width, player.height);
        if (hitX){
            speedX = -speedX*bounce;
        }
        let hitY = checkColSquare(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x, player.y + speedY, player.width, player.height);
        if (hitY){
            speedY = -speedY*bounce;
        }
    }
    // COLL DETECT FALLBACK
    for (let i = 0; i < walls.length; i++){
        let hitFallback = checkColSquare(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x + speedX, player.y + speedY, player.width, player.height);
        if (hitFallback){
            speedX = 0;
            speedY = 0;
        }
    }
    player.x += speedX;
    player.y += speedY;
    
    previousPos.push({x: player.x, y: player.y});
    if (previousPos.length > trailLength){
        previousPos.splice(0, 1);
    }
    
    drawMaze();
    
    // CHECK IF EXIT REACHED
    let hitExit = checkColSquare(exit.x, exit.y, exit.width, exit.height, player.x, player.y, player.width, player.height);
    if (!hitExit){
        currentAnimationFrame = requestAnimationFrame(simpleSquare);
    } else {
        inPlay = false;
        levelSound.play();
        starttime = Date.now();
        currentAnimationFrame = requestAnimationFrame(nextLevelAnimation);
    }
}

// OPTION 2: TOP DOWN MOVEMENT, ROUND HITBOX, MAZE CAN REGEN
function simpleCircle(){
    inPlay = true;
    if (keys.left){
        speedX -= accelerationRate;
    } else if (keys.right){
        speedX += accelerationRate;
    }
    if (keys.up){
        speedY -= accelerationRate;
    } else if (keys.down){
        speedY += accelerationRate;
    }
    speedX = Math.min(maxSpeed, Math.max(-maxSpeed, speedX));
    speedX *= friction;
    speedY = Math.min(maxSpeed, Math.max(-maxSpeed, speedY));
    speedY *= friction;
    for (let i = 0; i < walls.length; i++){
        let hitX = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x + speedX, player.y, player.radius);
        if (hitX){
            speedX = -speedX*bounce;
        }
        let hitY = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x, player.y + speedY, player.radius);
        if (hitY){
            speedY = -speedY*bounce;
        }
    }
    // COLL DETECT FALLBACK
    for (let i = 0; i < walls.length; i++){
        let hitFallback = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x + speedX, player.y + speedY, player.radius);
        if (hitFallback){
            speedX = 0;
            speedY = 0;
        }
    }
    player.x += speedX;
    player.y += speedY;
    
    previousPos.push({x: player.x, y: player.y});
    if (previousPos.length > trailLength){
        previousPos.splice(0, 1);
    }
    drawMaze();
    
    let hitExit = checkColCircle(exit.x, exit.y, exit.width, exit.height, player.x, player.y, player.radius);
    if (hitExit){
        if (redrawCounter < maxRegen){
            redrawCounter++;
            regenerateMaze();
        } else {
            inPlay = false;
            levelSound.play();
            starttime = Date.now();
            currentAnimationFrame = requestAnimationFrame(nextLevelAnimation);
        }
    } else {
        currentAnimationFrame = requestAnimationFrame(simpleCircle);
    }
}

// OPTION 3: ROUND PLAYER WITH GRAVITY, TIMER ON JUMP
let jumpTimer = 33,
    jumpPos, jumpCloudAlpha;

function simpleGravity(){
    inPlay = true;
    jumpTimer += 1;
    speedY += accelerationRate*0.9;
    if (keys.left){
        speedX -= accelerationRate;
        speedY -= accelerationRate*0.2;
    } else if (keys.right){
        speedX += accelerationRate;
        speedY -= accelerationRate*0.2;
    }
    if (keys.up){
        if (jumpTimer > 25){
            speedY -= accelerationRate*40;
            jumpTimer = 0;
            jumpPos = {x: player.x, y: player.y};
        }
    }
    speedX = Math.min(maxSpeed, Math.max(-maxSpeed, speedX));
    speedX *= friction;
    speedY = Math.min(maxSpeed, Math.max(-maxSpeed, speedY));
    
    for (let i = 0; i < walls.length; i++){
        let hitX = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x + speedX, player.y, player.radius);
        if (hitX){
            speedX = -speedX*bounce;
        }
        let hitY = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x, player.y + speedY, player.radius);
        if (hitY){
            speedY = -speedY*bounce;
        }
    }
    // COLL DETECT FALLBACK
    for (let i = 0; i < walls.length; i++){
        let hitFallback = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x + speedX, player.y + speedY, player.radius);
        if (hitFallback){
            speedX = 0;
            speedY = 0;
        }
    }
    player.x += speedX;
    player.y += speedY;
    
    previousPos.push({x: player.x, y: player.y});
    if (previousPos.length > trailLength){
        previousPos.splice(0, 1);
    }
    drawMaze();
    
    // JUMP TRAIL
    jumpCloudAlpha = Math.max(0, 1 - jumpTimer*0.03);
    ctx.fillStyle = "grey";
    ctx.globalAlpha = jumpCloudAlpha;
    ctx.beginPath();
    ctx.arc(jumpPos.x, jumpPos.y + player.radius*0.7, player.radius*(0.25 + jumpTimer*0.01), 0, 2 * Math.PI);
    ctx.fill();

    let hitExit = checkColCircle(exit.x, exit.y, exit.width, exit.height, player.x, player.y, player.radius);
    if (!hitExit){
        currentAnimationFrame = requestAnimationFrame(simpleGravity);
    } else {
        inPlay = false;
        levelSound.play();
        starttime = Date.now();
        currentAnimationFrame = requestAnimationFrame(nextLevelAnimation);
    }
}

// OPTION 4: TOP DOWN MOVEMENT, BUT WALLS ARE INVISIBLE UNLESS YOU TOUCH THEM
let wallsAlpha = 0,
    invisMaze = false;

function simpleCircleInvisMaze(){
    wallsAlpha -= 0.005;
    inPlay = true;
    
    if (keys.left){
        speedX -= accelerationRate;
    } else if (keys.right){
        speedX += accelerationRate;
    }
    if (keys.up){
        speedY -= accelerationRate;
    } else if (keys.down){
        speedY += accelerationRate;
    }
    speedX = Math.min(maxSpeed, Math.max(-maxSpeed, speedX));
    speedX *= friction;
    speedY = Math.min(maxSpeed, Math.max(-maxSpeed, speedY));
    speedY *= friction;
    for (let i = 0; i < walls.length; i++){
        let hitX = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x + speedX, player.y, player.radius);
        if (hitX){
            speedX = -speedX*bounce;
            wallsAlpha = 1;
        }
        let hitY = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x, player.y + speedY, player.radius);
        if (hitY){
            speedY = -speedY*bounce;
            wallsAlpha = 1;
        }
    }
    // COLL DETECT FALLBACK
    for (let i = 0; i < walls.length; i++){
        let hitFallback = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x + speedX, player.y + speedY, player.radius);
        if (hitFallback){
            speedX = 0;
            speedY = 0;
        }
    }
    player.x += speedX;
    player.y += speedY;
    
    drawInvisMaze(wallsAlpha);
    
    let hitExit = checkColCircle(exit.x, exit.y, exit.width, exit.height, player.x, player.y, player.radius);
    if (!hitExit){
        currentAnimationFrame = requestAnimationFrame(simpleCircleInvisMaze);
    } else {
        inPlay = false;
        levelSound.play();
        starttime = Date.now();
        currentAnimationFrame = requestAnimationFrame(nextLevelAnimation);
    }
}

// OPTION 5: GRAVITY, MOVEMENT DETERMINED BY ROTATION OF CANVAS
let canvasAngle = 0,
    angleIncrement = 0,
    angleCounter = 0;

function swivelCanvas(increment, target){
    if (keys.left && angleCounter === 0){
        angleIncrement = -increment;
        angleCounter = target;
    } else if (keys.right && angleCounter === 0){
        angleIncrement = increment;
        angleCounter = target;
    }
    if (angleCounter > 0){
        canvasAngle += angleIncrement;
        angleCounter -= increment;
    }
    canvasAngle %= 360;
    let rotate = "rotate(" + canvasAngle + "deg)";
    canvas.style.transform = rotate;
}
function turnTable(){
    swivelCanvas(3, 45);
    inPlay = true;
    
    let modX = Math.sin(canvasAngle*Math.PI/180).toFixed(8);
        modY = Math.cos(canvasAngle*Math.PI/180).toFixed(8);
    
    speedX += accelerationRate*modX;
    speedX = Math.min(maxSpeed, Math.max(-maxSpeed, speedX));
    speedX *= friction;
    speedY += accelerationRate*modY;
    speedY = Math.min(maxSpeed, Math.max(-maxSpeed, speedY));
    speedY *= friction;
    for (let i = 0; i < walls.length; i++){
        let hitX = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x + speedX, player.y, player.radius);
        if (hitX){
            speedX = -speedX*bounce;
        }
        let hitY = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x, player.y + speedY, player.radius);
        if (hitY){
            speedY = -speedY*bounce;
        }
    }
    // COLL DETECT FALLBACK
    for (let i = 0; i < walls.length; i++){
        let hitFallback = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x + speedX, player.y + speedY, player.radius);
        if (hitFallback){
            speedX = 0;
            speedY = 0;
        }
    }
    player.x += speedX;
    player.y += speedY;
    
    // CALCULATE PLAYER ROTATION
    let rotationModifier = (speedX*modY - speedY*modX)*0.1;
    playerRotation += rotationModifier;
    
    drawMaze();
    
    let hitExit = checkColCircle(exit.x, exit.y, exit.width, exit.height, player.x, player.y, player.radius);
    if (!hitExit){
        currentAnimationFrame = requestAnimationFrame(turnTable);
    } else {
        inPlay = false;
        levelSound.play();
        angleCounter = 0;
        starttime = Date.now();
        currentAnimationFrame = requestAnimationFrame(nextLevelAnimation);
    }
    
}
// OPTION 6: BLACK HOLE END GAME
function blackHole(){
    inPlay = true;
    
    // DRAG TO BLACK HOLE IN CENTER
    let exitDistanceX = Math.abs(player.x - exit.x + exit.width*0.5),
        exitDistanceY = Math.abs(player.y - exit.y + exit.height*0.5),
        distanceFromExit = Math.sqrt(exitDistanceX*exitDistanceX + exitDistanceY*exitDistanceY),
        proximityMod = (canvasWidth / distanceFromExit)*0.05;
    
    if (player.x < exit.x + exit.width*0.5){
        speedX += accelerationRate*proximityMod;
    } else if (player.x > exit.x + exit.width*0.5){
        speedX -= accelerationRate*proximityMod;
    }
    if (player.y < exit.y + exit.height*0.5){
        speedY += accelerationRate*proximityMod;
    } else if (player.y > exit.y + exit.height*0.5){
        speedY -= accelerationRate*proximityMod;
    }
    
    if (keys.left){
        speedX -= accelerationRate;
    } else if (keys.right){
        speedX += accelerationRate;
    }
    if (keys.up){
        speedY -= accelerationRate;
    } else if (keys.down){
        speedY += accelerationRate;
    }
    speedX = Math.min(maxSpeed, Math.max(-maxSpeed, speedX));
    speedX *= friction;
    speedY = Math.min(maxSpeed, Math.max(-maxSpeed, speedY));
    speedY *= friction;
    for (let i = 0; i < walls.length; i++){
        let hitX = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x + speedX, player.y, player.radius);
        if (hitX){
            speedX = -speedX*bounce;
        }
        let hitY = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x, player.y + speedY, player.radius);
        if (hitY){
            speedY = -speedY*bounce;
        }
    }
    // COLL DETECT FALLBACK
    for (let i = 0; i < walls.length; i++){
        let hitFallback = checkColCircle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, player.x + speedX, player.y + speedY, player.radius);
        if (hitFallback){
            speedX = 0;
            speedY = 0;
        }
    }
    player.x += speedX;
    player.y += speedY;
    
    drawMaze();
    
    let hitExit = checkColCircle(exit.x, exit.y, exit.width, exit.height, player.x, player.y, player.radius);
    if (!hitExit){
        currentAnimationFrame = requestAnimationFrame(blackHole);
    } else {
        inPlay = false;
        backgroundAudio.pause();
        explosionSound.play();
        starttime = Date.now();
        currentAnimationFrame = requestAnimationFrame(endGameFlash);
    }
}