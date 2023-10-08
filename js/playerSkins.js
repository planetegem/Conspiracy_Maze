let playerRotation;

function singularityPlayer(){
    let whiteMod = Math.max(0, Math.sin(exitAngle/20)),
        blackMod = Math.max(0, Math.cos(exitAngle/20));
    
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius*1.05, 0, 2 * Math.PI);
    ctx.fillStyle = "#57071f";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius*whiteMod*1.20, 0, 2 * Math.PI);
    ctx.fillStyle = "#8c032c";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius*blackMod*1.20, 0, 2 * Math.PI);
    ctx.fillStyle = "#cfbf11";
    ctx.fill();
}

function firePlayer(){
    let topX = previousPos[0].x,
        midX = -(player.x - topX)*0.75 + player.x,
        topY = previousPos[0].y,
        midY = -(player.y - topY)*0.75 + player.y;
    
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius*1.2, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(player.x - player.radius*1.2, player.y);
    ctx.lineTo(player.x + player.radius*1.2, player.y);
    ctx.lineTo(topX, topY - player.radius*2.5);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius*0.9, 0, 2 * Math.PI);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(player.x - player.radius*0.9, player.y);
    ctx.lineTo(player.x + player.radius*0.9, player.y);
    ctx.lineTo(midX, topY - player.radius*1.6);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius*0.6, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
}
function poisonPlayer(){
    let tempSizeModifier;
    for (let i = 0; i < previousPos.length-1; i++){
        ctx.globalAlpha = 0.5 + i*0.01;
        ctx.fillStyle = "#e808fc";
        ctx.beginPath();
        tempSizeModifier = 0.5 + i*0.01;
        ctx.arc(previousPos[i].x, previousPos[i].y, player.radius*tempSizeModifier, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.fillStyle = "#e808fc";
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fill();
}
function roundPlayer(){
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = level[currentLevel].color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    let newInterval = player.radius/5,
        centerX = player.x,
        centerY = player.y;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - newInterval*3);
    ctx.lineTo(centerX - newInterval, centerY - newInterval*2);
    ctx.moveTo(centerX, centerY - newInterval*3);
    ctx.lineTo(centerX + newInterval, centerY - newInterval*2);
    ctx.moveTo(centerX, centerY - newInterval*3);
    ctx.lineTo(centerX, centerY - newInterval);
    ctx.moveTo(centerX, centerY + newInterval*3);
    ctx.lineTo(centerX - newInterval, centerY + newInterval*2);
    ctx.moveTo(centerX, centerY + newInterval*3);
    ctx.lineTo(centerX + newInterval, centerY + newInterval*2);
    ctx.moveTo(centerX, centerY + newInterval*3);
    ctx.lineTo(centerX, centerY + newInterval);
    ctx.moveTo(centerX - newInterval*3, centerY);
    ctx.lineTo(centerX - newInterval*2, centerY - newInterval);
    ctx.moveTo(centerX - newInterval*3, centerY);
    ctx.lineTo(centerX - newInterval*2, centerY + newInterval);
    ctx.moveTo(centerX - newInterval*3, centerY);
    ctx.lineTo(centerX - newInterval, centerY);
    ctx.moveTo(centerX + newInterval*3, centerY);
    ctx.lineTo(centerX + newInterval*2, centerY - newInterval);
    ctx.moveTo(centerX + newInterval*3, centerY);
    ctx.lineTo(centerX + newInterval*2, centerY + newInterval);
    ctx.moveTo(centerX + newInterval*3, centerY);
    ctx.lineTo(centerX + newInterval, centerY);
    ctx.stroke();
}
function celticPlayer(){
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(playerRotation);
    ctx.translate(-player.x, -player.y);
    ctx.fillStyle = "#c8cc74";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1a5413";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius*0.5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(player.x - player.radius*0.75, player.y);
    ctx.lineTo(player.x + player.radius*0.75, player.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(player.x, player.y - player.radius*0.75);
    ctx.lineTo(player.x, player.y + player.radius*0.75);
    ctx.stroke();
    ctx.restore();
}

function pillPlayer(){
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(playerRotation);
    ctx.translate(-player.x, -player.y);
    ctx.fillStyle = "#f5daed";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#b38ba7";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(player.x - player.radius, player.y);
    ctx.lineTo(player.x + player.radius, player.y);
    ctx.stroke();
    ctx.strokeRect(player.x - player.radius*0.4, player.y - player.radius*0.4, player.radius*0.8, player.radius*0.8);
    ctx.restore();
}
function lizardPlayer(){
    playerRotation += speedX*0.075;
    
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(playerRotation);
    ctx.translate(-player.x, -player.y);
    ctx.fillStyle = "#f6f7da";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#3f523c";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(player.x-player.radius*0.45, player.y, player.radius*0.8, 0, 2 * Math.PI);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(player.x+player.radius*0.45, player.y, player.radius*0.8, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.restore();
}
function hollowPlayer(){
    playerRotation += speedX*0.075;

    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(playerRotation);
    ctx.translate(-player.x, -player.y);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#633a11";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 1.6 * Math.PI, 1.4 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#633a11";
    ctx.stroke();
    ctx.restore();
}
function lampPlayer(){
    let tempSizeModifier;
    for (let i = 0; i < previousPos.length-1; i++){
        ctx.globalAlpha = 0.5 + i*0.04;
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        tempSizeModifier = 0.7 + i*0.03;
        ctx.arc(previousPos[i].x, previousPos[i].y, player.radius*tempSizeModifier, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fill();
}
function moonPlayer(){
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#cfcfa9";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius*0.75, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#cfcfa9";
    ctx.beginPath();
    ctx.arc(player.x + player.radius*0.30, player.y, player.radius*0.55, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeRect(player.x, player.y, player.width, player.height);
}
function radiationPlayer(){
    // TRAIL
    for (let i = 0; i < previousPos.length-1; i++){
        ctx.fillStyle = "#21c44d";
        ctx.globalAlpha = 0.40 + 0.05*i;
        ctx.fillRect(player.x-speedX*(6-i)+player.width*(0.25-i*0.05), 
                     player.y-speedY*(6-i)+player.height*(0.25-i*0.05),
                     player.width*(0.5+i*0.1), player.height*(0.5+i*0.1));
    }
    // SKIN
    ctx.globalAlpha = 1;
    ctx.fillStyle = "yellow";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.strokeRect(player.x, player.y, player.width, player.height);
    
    let newInterval = player.width/10,
        centerX = player.x + player.width/2,
        centerY = player.y + player.height/2;
        
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, player.width*0.4, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - newInterval*3, centerY + newInterval*5);
    ctx.lineTo(centerX + newInterval*3, centerY + newInterval*5);
    ctx.closePath();
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - newInterval*5, centerY);
    ctx.lineTo(centerX - newInterval*3, centerY - newInterval*5);
    ctx.closePath();
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + newInterval*5, centerY);
    ctx.lineTo(centerX + newInterval*3, centerY - newInterval*5);
    ctx.closePath();
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX, centerY, player.width*0.12, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX, centerY, player.width*0.08, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
}
function arrowPlayer(){
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = level[currentLevel].color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    let newInterval = roundedInterval/10,
        centerX = player.x + player.width/2,
        centerY = player.y + player.height/2;
    
    ctx.globalAlpha = 1;
    ctx.strokeRect(player.x, player.y, player.width, player.height);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - newInterval*3);
    ctx.lineTo(centerX - newInterval, centerY - newInterval*2);
    ctx.moveTo(centerX, centerY - newInterval*3);
    ctx.lineTo(centerX + newInterval, centerY - newInterval*2);
    ctx.moveTo(centerX, centerY - newInterval*3);
    ctx.lineTo(centerX, centerY - newInterval);
    ctx.moveTo(centerX, centerY + newInterval*3);
    ctx.lineTo(centerX - newInterval, centerY + newInterval*2);
    ctx.moveTo(centerX, centerY + newInterval*3);
    ctx.lineTo(centerX + newInterval, centerY + newInterval*2);
    ctx.moveTo(centerX, centerY + newInterval*3);
    ctx.lineTo(centerX, centerY + newInterval);
    ctx.moveTo(centerX - newInterval*3, centerY);
    ctx.lineTo(centerX - newInterval*2, centerY - newInterval);
    ctx.moveTo(centerX - newInterval*3, centerY);
    ctx.lineTo(centerX - newInterval*2, centerY + newInterval);
    ctx.moveTo(centerX - newInterval*3, centerY);
    ctx.lineTo(centerX - newInterval, centerY);
    ctx.moveTo(centerX + newInterval*3, centerY);
    ctx.lineTo(centerX + newInterval*2, centerY - newInterval);
    ctx.moveTo(centerX + newInterval*3, centerY);
    ctx.lineTo(centerX + newInterval*2, centerY + newInterval);
    ctx.moveTo(centerX + newInterval*3, centerY);
    ctx.lineTo(centerX + newInterval, centerY);
    ctx.stroke();
}