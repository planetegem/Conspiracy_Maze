// PRELOADER
function drawLoadScreen(){
    let maxBar = level.length + startMenu.length,
        barWidth = canvasWidth*0.30,
        barHeight = canvasWidth*0.075,
        blockWidth = (barWidth/maxBar),
        blockHeight = barHeight;
    
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0, 0, canvasWidth, canvasWidth);
    ctx.fillStyle = "darkgrey";
    ctx.fillRect(canvasWidth/2 - barWidth/2 - canvasWidth*0.01, canvasWidth/2 - barHeight*0.5 - canvasWidth*0.01, barWidth + canvasWidth*0.02, barHeight + canvasWidth*0.02);
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(canvasWidth/2 - barWidth/2, canvasWidth/2 - barHeight*0.5, barWidth, barHeight);
    ctx.fillStyle = "darkgrey";
    for (let i = 0; i < levelsLoaded; i++){
        ctx.fillRect(canvasWidth/2 - barWidth/2 + blockWidth*0.1 + blockWidth*i, canvasWidth/2 - barHeight*0.5 + blockHeight*0.05, blockWidth*0.8, blockHeight*0.9);
    }
}


function setScene(){
    let isMobile = window.matchMedia("(pointer:coarse)").matches;
    if (isMobile){
        canvas.style.display = "none";
        document.getElementById("playfield-container").style.display = "none";
        document.getElementById("manual").style.display = "none";
        document.getElementById("mobile_fallback").style.display = "block";
    } else {
        canvas.setAttribute("width", canvasWidth);
        canvas.setAttribute("height", canvasWidth);
        drawLoadScreen();
        loaderFunction();
    }
}
let levelsLoaded = 0;
function loaderFunction(){
    // CREATE MAZE
    level[levelsLoaded].maze = [];
    level[levelsLoaded].mazeGenerator(level[levelsLoaded].maze, level[levelsLoaded].width, level[levelsLoaded].height, level[levelsLoaded].radius);
    
    // PRELOAD BACKGROUND
    let img = new Image();
    img.onload = imageLoaded;
    img.src = level[levelsLoaded].background;
    level[levelsLoaded].img = img;
    function imageLoaded(){
        levelsLoaded++;
        drawLoadScreen();
        console.log("Level " + levelsLoaded + " loaded");
        
        // ADD CHEAT MENU BUTTON
        let button = document.createElement("button");
        document.getElementById("levelSelector").appendChild(button);
        button.classList.add("cheatButton");
        button.innerHTML = levelsLoaded;
        button.addEventListener("click", level[levelsLoaded-1].callFunction)
        
        if (levelsLoaded < level.length){
            loaderFunction();
        } else if (levelsLoaded === level.length){
            loadMenu();
        }
    }
}
let startMenu = [{src: "./assets/menu/background.png"},
                 {src: "./assets/menu/logo.png"},
                 {src: "./assets/menu/start_off.png"},
                 {src: "./assets/menu/start_on.png"},
                 {src: "./assets/maat.png"}];

function loadMenu(){
    let menuCounter = levelsLoaded - level.length;
    
    let img = new Image();
    img.onload = imageLoaded;
    img.src = startMenu[menuCounter].src;
    startMenu[menuCounter].img = img;
    
    function imageLoaded(){
        levelsLoaded++;
        drawLoadScreen();
       
        if (levelsLoaded - level.length < startMenu.length){
            loadMenu();
        } else if (levelsLoaded - level.length === startMenu.length){
            starttime = Date.now();
            console.log("Menu assets loaded");
            fadeInMenu();
        }
    }
}
// MAIN MENU
let menuAngle = 0,
    startClick, startOver;
    
function fadeInMenu(){
    let runtime = Date.now() - starttime,
        duration = 1000,
        progress = runtime / duration;
        
    ctx.globalAlpha = 1;
    drawLoadScreen();
    
    ctx.globalAlpha = progress;
    ctx.save();
    ctx.translate(canvasWidth/2, canvasWidth/2);
    ctx.rotate(menuAngle);
    ctx.translate(-canvasWidth/2, -canvasWidth/2);
    ctx.drawImage(startMenu[0].img, -canvasWidth*0.3, -canvasWidth*0.3, canvasWidth*1.6, canvasWidth*1.6);
    ctx.restore();
    ctx.drawImage(startMenu[1].img, canvasWidth*0.1, canvasWidth*0.1, canvasWidth*0.8, canvasWidth*0.8);
    ctx.drawImage(startMenu[2].img, canvasWidth/2-canvasWidth*0.16, canvasWidth*0.75-canvasWidth*0.04, canvasWidth*0.32, canvasWidth*0.08);
    
    menuAngle += 0.005;
    
    if (runtime < duration){
        currentAnimationFrame = requestAnimationFrame (fadeInMenu);
    } else {
        drawMenu();
    }
}    
function drawMenu(){
    ctx.clearRect(0, 0, canvasWidth, canvasWidth);
    
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(canvasWidth/2, canvasWidth/2);
    ctx.rotate(menuAngle);
    ctx.translate(-canvasWidth/2, -canvasWidth/2);
    ctx.drawImage(startMenu[0].img, -canvasWidth*0.3, -canvasWidth*0.3, canvasWidth*1.6, canvasWidth*1.6);
    ctx.restore();
    
    ctx.drawImage(startMenu[1].img, canvasWidth*0.1, canvasWidth*0.1, canvasWidth*0.8, canvasWidth*0.8);
    
    if (startOver){
        ctx.drawImage(startMenu[3].img, canvasWidth/2-canvasWidth*0.16, canvasWidth*0.75-canvasWidth*0.04, canvasWidth*0.32, canvasWidth*0.08);
    } else {
        ctx.drawImage(startMenu[2].img, canvasWidth/2-canvasWidth*0.16, canvasWidth*0.75-canvasWidth*0.04, canvasWidth*0.32, canvasWidth*0.08);
    }
    
    menuAngle += 0.005;
    
    if (startClick){
        starttime = Date.now();
        currentAnimationFrame = requestAnimationFrame(fadeOutMenu);
    } else {
        currentAnimationFrame = requestAnimationFrame(drawMenu);
    }
}
function fadeOutMenu(){
    let runtime = Date.now() - starttime,
        duration = 2000,
        progress = runtime / duration;
       
    ctx.clearRect(0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(canvasWidth/2, canvasWidth/2);
    ctx.rotate(menuAngle);
    ctx.translate(-canvasWidth/2, -canvasWidth/2);
    ctx.drawImage(startMenu[0].img, -canvasWidth*0.3, -canvasWidth*0.3, canvasWidth*1.6, canvasWidth*1.6);
    ctx.restore();
    
    ctx.drawImage(startMenu[1].img, canvasWidth*0.1, canvasWidth*0.1, canvasWidth*0.8, canvasWidth*0.8);
    ctx.drawImage(startMenu[3].img, canvasWidth/2-canvasWidth*0.16, canvasWidth*0.75-canvasWidth*0.04, canvasWidth*0.32, canvasWidth*0.08);
    menuAngle += 0.005;
    
    ctx.globalAlpha = progress*2;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasWidth);
    
    ctx.globalAlpha = Math.max(0, progress*2 - 1);
    ctx.fillStyle = level[0].color;
    ctx.fillRect(0, 0, canvasWidth, canvasWidth);
    ctx.globalAlpha = Math.max(0, progress*0.4 - 0.2);
    ctx.drawImage(level[0].img, 0, 0, canvasWidth, canvasWidth);
    
    if (runtime < duration){
        currentAnimationFrame = requestAnimationFrame(fadeOutMenu);
    } else {
        currentAnimationFrame = requestAnimationFrame(level[0].callFunction);
    }
}

// CHEAT BUTTONS
let inPlay = false;
function unstuckButton(){
    if (inPlay){
        unstuckPlayer();
    }
}
document.getElementById("unstuckButton").addEventListener("click", unstuckButton);
function regenButton(){
    if (inPlay){
        regenerateMaze();
    }
}
document.getElementById("regenButton").addEventListener("click", regenButton);

// MOUSE EVENTS
function mouseDown(e){
    let offsetX = canvas.getBoundingClientRect().left,
        offsetY = canvas.getBoundingClientRect().top,
        mouseX = e.clientX - offsetX,
        mouseY = e.clientY - offsetY;
    
    if (mouseX > canvasWidth/2 - canvasWidth*0.18 && mouseX < canvasWidth/2 + canvasWidth*0.18 &&
        mouseY > canvasWidth*0.75-canvasWidth*0.045 && mouseY < canvasWidth*0.75 + canvasWidth*0.045){
        startClick = true;
    }
}
function mouseOver(e){
    let offsetX = canvas.getBoundingClientRect().left,
        offsetY = canvas.getBoundingClientRect().top,
        mouseX = e.clientX - offsetX,
        mouseY = e.clientY - offsetY;
    
    if (mouseX > canvasWidth/2 - canvasWidth*0.18 && mouseX < canvasWidth/2 + canvasWidth*0.18 &&
        mouseY > canvasWidth*0.75-canvasWidth*0.045 && mouseY < canvasWidth*0.75 + canvasWidth*0.045){
        startOver = true;
    } else {
        startOver = false;
    }
}
canvas.onmousedown = mouseDown;
canvas.onmousemove = mouseOver;