The Conspiracy Maze is a game I created in pure javascript.
I wanted the game to use procedurally generated mazes, so this is where I first started playing around with maze generation algorithms. As everything is rendered in a canvas element, it was also a nice challenge to see how much I still remembered from high school geometry (for example when building the collision detection). Finally, I wanted the rules of the game to be able to change dynamically (speeds, way of moving, gravity, etc), so this was also a nice first experience in modular coding.

Way of working:
1) An array of objects keeps track of the rules for a specific level => see levels.js
2) Every level has a specific call function to start transition animations and reset variables where necessary => see commons.js
3) Levels can have different maze generation algorithms => see mazeGenerators.js
4) Levels also have specific player skins => see playerSkins.js
5) Once the level has started, a render function continually checks all variables and decides how to change the canvas drawing. I call this function a repainter. This function also keeps track of collision detection => see repainters.js
6) Before the game starts, images are preloaded for use in the canvas. While waiting for the images to load, the game also already precreates some mazes for later use => see loadAndStart.js

