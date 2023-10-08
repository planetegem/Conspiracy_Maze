// GENERAL ANIMATIONS
function fadeInText(){
    let runtime = Date.now() - starttime,
        duration = 600,
        progress = runtime / duration;
    
    progress = Math.min(progress, 1);
    ctx.clearRect(0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = 1;
    ctx.fillStyle = level[currentLevel].color;
    ctx.fillRect(0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = 0.2;
    ctx.drawImage(level[currentLevel].img, 0, 0, canvasWidth, canvasWidth);
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.font = titlecardFont;
    if (runtime < duration + 1000){
        writeText(progress);
        currentAnimationFrame = requestAnimationFrame (fadeInText);
    }
    else {
        writeText(progress);
        currentAnimationFrame = requestAnimationFrame(blinkKeyToContinue);
    }
}
let currentFrame = 0,
    lineLevel,
    blinkAlpha = 1,
    blinkTextFont = fontSize*0.66 + "px Arial";

function blinkKeyToContinue(){
    let blinkFrame = 60;
        
    currentFrame++;
    if (currentFrame >= blinkFrame && blinkAlpha === 0){
        currentFrame = 0;
        blinkAlpha = 1;
    } else if (currentFrame >= blinkFrame && blinkAlpha === 1){
        currentFrame = 0;
        blinkAlpha = 0;
    }
    drawMaze();
    drawTitleCard(1);
    ctx.globalAlpha = blinkAlpha;
    ctx.fillStyle = "black";
    ctx.font = blinkTextFont;
    ctx.fillText("press [z] to continue", canvasWidth/11, lineLevel);

    if (keys.continue && !invisMaze){
        starttime = Date.now();
        currentAnimationFrame = requestAnimationFrame(fadeOut);
    } else if (keys.continue && invisMaze) {
        starttime = Date.now();
        currentAnimationFrame = requestAnimationFrame(invisFadeOut);
    } else {
        currentAnimationFrame = requestAnimationFrame(blinkKeyToContinue);
    } 
}
function fadeOut(){
    let runtime = Date.now() - starttime,
        progress = 1 - (runtime/ 2000);
        
    progress = Math.min(progress, 1); 
    if (runtime < 2000){
        drawMaze();
        drawTitleCard(progress);
        currentAnimationFrame = requestAnimationFrame(fadeOut);
    } else {
        currentAnimationFrame = requestAnimationFrame(level[currentLevel].repainter);
    }
}
function nextLevelAnimation(){
    let runtime = Date.now() - starttime,
        duration = 450,
        progress = runtime / duration,
        newX = exit.x - exit.x*progress,
        newY = exit.y - exit.y*progress,
        newWidth = exit.width + (canvasWidth - exit.width)*progress,
        newHeight = exit.height + (canvasWidth - exit.height)*progress;
    
    // IF CANVAS IS ANGLED, RETURN TO 0
    if (canvasAngle !== 0){
        if (canvasAngle > 180){ // GO TO 360
            canvasAngle += (360 - canvasAngle)*progress;
        } else if (canvasAngle < -180){ // GO TO -360
            canvasAngle -= (canvasAngle + 360)*progress;
        } else if (canvasAngle < 180 && canvasAngle > -180){ // GO TO 0
            canvasAngle -= canvasAngle*progress;
        }
        let rotate = "rotate(" + canvasAngle + "deg)";
        canvas.style.transform = rotate;
    }
    
    drawMaze();
    if (runtime < duration){
        ctx.globalAlpha = 1;
        ctx.fillStyle = level[currentLevel+1].color;
        ctx.fillRect(newX, newY, newWidth, newHeight);
        ctx.globalAlpha = 0.2;
        ctx.drawImage(level[currentLevel+1].img, newX, newY, newWidth, newHeight);
        currentAnimationFrame = requestAnimationFrame(nextLevelAnimation);
    } else {
        currentLevel++;
        ctx.fillStyle = level[currentLevel].color;
        ctx.fillRect(0, 0, canvasWidth, canvasWidth);
        ctx.globalAlpha = 0.2;
        ctx.drawImage(level[currentLevel].img, 0, 0, canvasWidth, canvasWidth);
        currentAnimationFrame = requestAnimationFrame(level[currentLevel].callFunction);
    }
}

// END SCREEN ANIMATIONS
function endGameFlash(){
    let runtime = Date.now() - starttime,
        duration = 2000,
        progress = runtime / duration;
    
    ctx.clearRect(0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = 1;
    ctx.drawImage(level[currentLevel].img, 0, 0, canvasWidth, canvasWidth);
    
    ctx.globalAlpha = progress*2;
    ctx.beginPath();
    ctx.arc(exit.x, exit.y, canvasWidth/3, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = level[currentLevel].color;
    for (let i = 0; i < walls.length; i++){
        ctx.fillRect(walls[i].x, walls[i].y, walls[i].width, walls[i].height);
    }
    level[currentLevel].playerSkin();
    drawExit();
    
    ctx.globalAlpha = Math.max(0, progress*1.3 - 0.3);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasWidth);
    
    if (runtime < duration){
        currentAnimationFrame = requestAnimationFrame(endGameFlash);
    } else {
        audioFader(heavenAudio, 0.5, 5);
        starttime = Date.now();
        currentAnimationFrame = requestAnimationFrame(maatFadeIn);
    }
}
function maatFadeIn(){
    let runtime = Date.now() - starttime,
        duration = 8000,
        progress = runtime / duration;
        
    ctx.clearRect(0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = 1;
    ctx.drawImage(startMenu[4].img, 0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = 1.2 - progress*0.6;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasWidth);
    
    if (runtime < duration){
        currentAnimationFrame = requestAnimationFrame(maatFadeIn);
    } else {
        starttime = Date.now();
        currentAnimationFrame = requestAnimationFrame(victoryFadeIn);
    }
}
function victoryFadeIn(){
    let runtime = Date.now() - starttime,
        duration = 16000,
        progress = runtime / duration;
    
    ctx.clearRect(0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = 1;
    ctx.drawImage(startMenu[4].img, 0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasWidth);
    ctx.fillStyle = "black";
    
    ctx.globalAlpha = Math.max(0, Math.min(1, progress*4));
    ctx.textAlign = "center";
    ctx.font = fontSize*1.6 + "px Arial";
    ctx.fillText("Congratulations!", canvasWidth/2, canvasWidth/10);
    
    ctx.globalAlpha = Math.max(0, Math.min(1, progress*4 - 1));
    ctx.font = fontSize*1.2 + "px Arial";
    ctx.fillText("You have finally found the truth.", canvasWidth/2, canvasWidth/10 + fontSize*1.8);
    
    ctx.globalAlpha = Math.max(0, Math.min(1, progress*4 - 2));
    ctx.fillText("Ma'at has set you free.", canvasWidth/2, canvasWidth/10 + fontSize*3.6);
    
    if (runtime < duration){
        currentAnimationFrame = requestAnimationFrame(victoryFadeIn);
    } else {
        currentAnimationFrame = requestAnimationFrame(victoryScreen);
    }
}
function victoryScreen(){
    ctx.clearRect(0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = 1;
    ctx.drawImage(startMenu[4].img, 0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasWidth);
    
    ctx.fillStyle = "black";
    ctx.globalAlpha = 1;
    ctx.textAlign = "center";
    ctx.font = fontSize*1.6 + "px Arial";
    ctx.fillText("Congratulations!", canvasWidth/2, canvasWidth/10);
    ctx.font = fontSize*1.2 + "px Arial";
    ctx.fillText("You have finally found the truth.", canvasWidth/2, canvasWidth/10 + fontSize*1.8);
    ctx.fillText("Ma'at has set you free.", canvasWidth/2, canvasWidth/10 + fontSize*3.6);
    
    let blinkFrame = 60;
    currentFrame++;
    if (currentFrame >= blinkFrame && blinkAlpha === 0){
        currentFrame = 0;
        blinkAlpha = 1;
    } else if (currentFrame >= blinkFrame && blinkAlpha === 1){
        currentFrame = 0;
        blinkAlpha = 0;
    }
    ctx.globalAlpha = blinkAlpha;
    ctx.font = blinkTextFont;
    ctx.fillText("press [z] to start over", canvasWidth/2, canvasWidth/10 + fontSize*5.4);

    if (keys.continue){
        levelsLoaded = 0;
        heavenAudio.pause();
        loaderFunction();
    } else {
        currentAnimationFrame = requestAnimationFrame(victoryScreen);
    } 
}

// SPECIALTY ANIMATIONS
function invisFadeOut(){
    let runtime = Date.now() - starttime,
        progress = 1 - (runtime/ 2000);
        
    progress = Math.min(progress, 1); 
    if (runtime < 2000){
        drawInvisMaze(0);
        drawTitleCard(progress);
        currentAnimationFrame = requestAnimationFrame(invisFadeOut);
    } else {
        currentAnimationFrame = requestAnimationFrame(level[currentLevel].repainter);
    }
}
function exitMove(){
    runtime = Date.now() - starttime,
    duration = 300,
    progress = runtime / duration;
    
    exit.x += (nextExit.x - exit.x)*progress;
    exit.y += (nextExit.y - exit.y)*progress;
    
    if (runtime < duration*0.33){
        dissociativeEpisode(progress*2);
    } else if (runtime > duration*0.33 && runtime < duration*0.66){
        dissociativeEpisode(1);
    } else if (runtime > duration*0.66){
        dissociativeEpisode(2 - progress*2);
    }

    if (runtime < duration){
        currentAnimationFrame = requestAnimationFrame(exitMove);
    } else {
        findExit();
        currentAnimationFrame = requestAnimationFrame(level[currentLevel].repainter);
    }
    
}
function dissociativeEpisode(alpha){
    // 1. DRAW BACKGROUND
    ctx.globalAlpha = 1;
    ctx.drawImage(level[currentLevel].img, 0, 0, canvasWidth, canvasWidth);
    
    // 2. FLASH WHITE
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasWidth);

    // 3. DRAW MAZE
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = level[currentLevel].color;
    for (let i = 0; i < walls.length; i++){
        ctx.fillRect(walls[i].x, walls[i].y, walls[i].width, walls[i].height);
    }
    level[currentLevel].playerSkin();
    drawExit();
}
function mazeRegenAnimation(){
    let runtime = Date.now() - starttime,
        duration = 300,
        progress = runtime / duration;
    
    exit.x += (nextExit.x - exit.x)*progress;
    exit.y += (nextExit.y - exit.y)*progress;
    
    ctx.globalAlpha = progress;
    ctx.fillStyle = level[currentLevel].color;
    for (let i = 0; i < futureWalls.length; i++){
        ctx.fillRect(futureWalls[i].x, futureWalls[i].y, futureWalls[i].width, futureWalls[i].height);
    }
        if (runtime < duration*0.33){
        dissociativeEpisode(progress*2);
    } else if (runtime > duration*0.33 && runtime < duration*0.66){
        dissociativeEpisode(1);
    } else if (runtime > duration*0.66){
        dissociativeEpisode(2 - progress*2);
    }
    
    if (runtime < duration){
        currentAnimationFrame = requestAnimationFrame(mazeRegenAnimation);
    } else {
        currentMaze = level[currentLevel].maze;
        createWallsArray();
        unstuckPlayer();
        currentAnimationFrame = requestAnimationFrame(level[currentLevel].repainter);
    }
}
