// SOUNDS
const peacockSound = new Audio("./assets/audio/peacock.wav"),
      levelSound = new Audio("./assets/audio/pelelele.wav"),
      backgroundAudio = new Audio("./assets/audio/heartbeat.wav"),
      heavenAudio = new Audio("./assets/audio/heaven.wav"),
      explosionSound = new Audio("./assets/audio/end_impact.mp3"),
      zoeLoop = new Audio("./assets/audio/zoe_loop4.mp3"),
      zoeLoop2 = new Audio("./assets/audio/zoe_loop3.mp3"),
      zoeLoop3 = new Audio("./assets/audio/zoe_loop5.mp3"),
      zoeLoop4 = new Audio("./assets/audio/zoe_loop6.mp3"),
      zoeLoop5 = new Audio("./assets/audio/zoe_loop7.mp3"),
      zoeLoop6 = new Audio("./assets/audio/zoe_loop8.mp3"),
      zoeLoop7 = new Audio("./assets/audio/zoe_loop9.mp3");

function selectRandomLoop(){
    let randomLoop = Math.floor(Math.random()*7);
    console.log(randomLoop);
    switch (randomLoop) {
        case 0:
            audioFader(zoeLoop, 0.4, 2);
            break;
        case 1:
            audioFader(zoeLoop2, 0.8, 1.5);
            break;
        case 2:
            audioFader(zoeLoop3, 0.5, 2);
            break;
        case 3:
            audioFader(zoeLoop4, 0.4, 2);
            break;
        case 4:
            audioFader(zoeLoop5, 0.6, 2);
            break;
        case 5:
            audioFader(zoeLoop6, 0.6, 2);
            break;
        case 6:
            audioFader(zoeLoop7, 0.4, 3);
    }
}

function adjustVolume(){
    backgroundAudio.loop = true;
    backgroundAudio.play();

    let volume = (0.05/level.length)*currentLevel + 0.3;
    backgroundAudio.volume = volume;
    peacockSound.volume = 0.6;
    levelSound.volume = 0.6;
}
let audioControlsOn;
function toggleAudio(){
    if (!audioControlsOn){
        document.getElementById("audio-overlay").style.zIndex = "2";
        
        if (document.getElementById("muted").style.display === "block"){
            document.getElementById("muted").style.display = "none";
            document.getElementById("unmuted").style.display = "block";
            backgroundAudio.muted = false;
            peacockSound.muted = false;
            levelSound.muted = false;
            explosionSound.muted = false;
            heavenAudio.muted = false;
            zoeLoop.muted = false;
            zoeLoop2.muted = false;
            zoeLoop3.muted = false;
            zoeLoop4.muted = false;
            zoeLoop5.muted = false;
            zoeLoop6.muted = false;
            zoeLoop7.muted = false;
        } else {
            document.getElementById("muted").style.display = "block";
            document.getElementById("unmuted").style.display = "none";
            backgroundAudio.muted = true;
            peacockSound.muted = true;
            levelSound.muted = true;
            explosionSound.muted = true;
            heavenAudio.muted = true;
            zoeLoop.muted = true;
            zoeLoop2.muted = true;
            zoeLoop3.muted = true;
            zoeLoop4.muted = true;
            zoeLoop5.muted = true;
            zoeLoop6.muted = true;
            zoeLoop7.muted = true;
        }
        setTimeout(() => {
            document.getElementById("audio-overlay").style.removeProperty('animation');
            document.getElementById("audio-overlay").style.zIndex = "-1";
            audioControlsOn = false;
        }, 1000);
        audioControlsOn = true;
    }
    document.getElementById("audio-overlay").style.animation = "audioControls 1s linear";
}
function audioFader(audio, volume, duration){
    audio.play();
    audio.volume = 0;
    let musicFadeIn = setInterval(() => {
        let timeElapsed = audio.currentTime;
        if (timeElapsed < duration && audio.volume < volume){
            audio.volume += volume/10;
        }
        if (audio.volume >= volume){
            clearInterval(musicFadeIn);
        }
    }, duration*100);
    let musicFadeOut = setInterval(() => {
        let endPoint = audio.duration - duration;
        if (audio.currentTime >= endPoint && audio.volume !== 0) {
            audio.volume -= volume/10;
        } 
        if (audio.volume < volume/10) {
            clearInterval(musicFadeOut);
        }
    }, duration*100);
}