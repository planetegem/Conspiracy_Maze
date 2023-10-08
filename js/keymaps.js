let keys = {up: false, down: false, left: false, right: false, continue: false};

function detectKeyDown(e){
    if (e.keyCode == "38") { // UP ARROW
        e.preventDefault();
        keys.up = true;
    }
    if (e.keyCode == "40") { // DOWN ARROW
        e.preventDefault();
        keys.down = true;
    }
    if (e.keyCode == "37") { // LEFT ARROW
        e.preventDefault();
        keys.left = true;
    }
    if (e.keyCode == "39") { // RIGHT ARROW
        e.preventDefault();
        keys.right = true;
    }
    if (e.keyCode == "90"){
        keys.continue = true; 
    }
    if (e.keyCode == "77"){
        toggleAudio();
    }
}
function detectKeyUp(e){
    e.preventDefault();
    if (e.keyCode == "38") { // UP ARROW
        keys.up = false;
    }
    if (e.keyCode == "40") { // DOWN ARROW
        keys.down = false;
    }
    if (e.keyCode == "37") { // LEFT ARROW
        keys.left = false;
    }
    if (e.keyCode == "39") { // RIGHT ARROW
        keys.right= false;
    }
    if (e.keyCode == "90"){
        keys.continue = false; 
    }
}
document.onkeydown = detectKeyDown;
document.onkeyup = detectKeyUp;