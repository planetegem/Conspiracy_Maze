function drawMaze(){
    ctx.clearRect(0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = 1;
    ctx.drawImage(level[currentLevel].img, 0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = 1;
    ctx.fillStyle = level[currentLevel].color;
    for (let i = 0; i < walls.length; i++){
        ctx.fillRect(walls[i].x, walls[i].y, walls[i].width, walls[i].height);
    }
    level[currentLevel].playerSkin();
    drawExit();
}
function drawInvisMaze(alpha){
    let alphaHere = Math.max(0, alpha),
        distanceHere = roundedInterval * 2,
        alphaClose = Math.max(0, alpha - 0.2),
        distanceClose = roundedInterval * 3,
        alphaMedium = Math.max(0, alpha - 0.4),
        distanceMedium = roundedInterval * 4,
        alphaFar = Math.max(0, alpha - 0.6),
        distanceFar = roundedInterval * 6,
        alphaFarthest = Math.max(0, alpha - 0.8),
        distanceFarthest = roundedInterval * 10,
        tempDistanceX, tempDistanceY, tempDistance;
    
    ctx.clearRect(0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = 1;
    ctx.drawImage(level[currentLevel].img, 0, 0, canvasWidth, canvasWidth);
    ctx.fillStyle = level[currentLevel].color;
    
    // OUTSIDE WALLS ALWAYS VISIBLE
    for (let i = 0; i < currentMaze.length; i++){
        if (currentMaze[i].x === 0 || currentMaze[i].y === 0 || currentMaze[i].x === level[currentLevel].width-1 || currentMaze[i].y === level[currentLevel].height-1){
            ctx.fillRect(currentMaze[i].x*interval,currentMaze[i].y*interval, roundedInterval, roundedInterval);
        }  
    }
    
    // OTHER WALLS: CHECK PROXIMITY & ADAPT ALPHA
    for (let i = 0; i < walls.length; i++){
        tempDistanceX = Math.abs(walls[i].x + walls[i].width*0.5 - player.x);
        tempDistanceY = Math.abs(walls[i].y + walls[i].height*0.5 - player.y);
        tempDistance = Math.sqrt(tempDistanceX*tempDistanceX + tempDistanceY*tempDistanceY);
        
        if (tempDistance < distanceHere){
            ctx.globalAlpha = alphaHere;
        } else if (tempDistance < distanceClose){
            ctx.globalAlpha = alphaClose;
        } else if (tempDistance < distanceMedium){
            ctx.globalAlpha = alphaMedium;
        } else if (tempDistance < distanceFar){
            ctx.globalAlpha = alphaFar;
        } else if (tempDistance < distanceFarthest){
            ctx.globalAlpha = alphaFarthest;
        } else {
            ctx.globalAlpha = 0;
        }
        ctx.fillRect(walls[i].x, walls[i].y, walls[i].width, walls[i].height);
    }
    level[currentLevel].playerSkin();
    drawExit();
}

// ROTATING EXIT, SIZE & ROTATION SPEED IS MULTIPIED BY LEVEL
let exitAngle = 0;
    
function drawExit(){
    let blinkFrame = 20,
        centerX = Math.floor(exit.x + exit.width/2),
        centerY = Math.floor(exit.y + exit.height/2),
        tempX = centerX - exit.width*0.4,
        tempY = centerY - exit.height*0.4,
        mazeWidthMod = level[currentLevel].width / 25,
        multiplier = (0.95 + currentLevel*0.05)*(0.95 + currentLevel*0.05),
        multipliedAngle = exitAngle*multiplier*multiplier*Math.PI / 720;
        alpha = Math.abs(Math.cos(multipliedAngle*1.5));
    
    exitAngle += 5;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(multipliedAngle);
    ctx.translate(-centerX, -centerY);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    drawZoeStar(multiplier*mazeWidthMod, centerX, centerY);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "black";
    drawZoeStar(multiplier*mazeWidthMod, centerX, centerY);
    ctx.restore();
}
function drawZoeStar(sizeMultiplier, centerX, centerY){
    let starUnit = (roundedInterval*sizeMultiplier*1.3)/8;

    ctx.beginPath();
    ctx.moveTo(centerX - starUnit*2, centerY);
    ctx.lineTo(centerX - starUnit*4, centerY - starUnit);
    ctx.lineTo(centerX - starUnit, centerY - starUnit);
    ctx.lineTo(centerX - starUnit, centerY - starUnit*4);
    ctx.lineTo(centerX, centerY - starUnit*2);
    ctx.lineTo(centerX + starUnit, centerY - starUnit*4);
    ctx.lineTo(centerX + starUnit, centerY - starUnit);
    ctx.lineTo(centerX + starUnit*4, centerY - starUnit);
    ctx.lineTo(centerX + starUnit*2, centerY);
    ctx.lineTo(centerX + starUnit*4, centerY + starUnit);
    ctx.lineTo(centerX + starUnit, centerY + starUnit);
    ctx.lineTo(centerX + starUnit, centerY + starUnit*4);
    ctx.lineTo(centerX, centerY + starUnit*2);
    ctx.lineTo(centerX - starUnit, centerY + starUnit*4);
    ctx.lineTo(centerX - starUnit, centerY + starUnit);
    ctx.lineTo(centerX - starUnit*4, centerY + starUnit);
    ctx.lineTo(centerX - starUnit*2, centerY);
    ctx.closePath();
    ctx.fill();
}

// TITLECARDS
let fontSize = canvasWidth/25,
    titlecardFont = fontSize + "px Arial";

function drawTitleCard(alpha){
    ctx.globalAlpha = alpha;
    ctx.fillStyle = level[currentLevel].color;
    ctx.fillRect(0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = alpha/5;
    ctx.drawImage(level[currentLevel].img, 0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "black";
    ctx.font = titlecardFont;
    writeText(alpha);
}
function writeText(alpha) {
    let words = level[currentLevel].titlecard.split(' '),
        xpos = canvasWidth / 12,
        line = '',
        ypos = canvasWidth / 3,
        lineHeight = canvasWidth / 20;
    
    ctx.globalAlpha = alpha;
    for(let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ',
            metrics = ctx.measureText(testLine),
            testWidth = metrics.width;

        if (testWidth > canvasWidth - xpos*2 && i > 0) {
            ctx.fillText(line, xpos, ypos);
            line = words[i] + ' ';
            ypos += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    ctx.fillText(line, xpos, ypos);
    lineLevel = ypos + lineHeight;
}