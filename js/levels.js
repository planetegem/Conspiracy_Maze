// LEVELS
let level = [
        {level: 0, 
            width: 25, height: 25, radius: 3,
            color: "#4287f5", background: "./assets/flat_earth.png",
            titlecard: "The Earth is flat. Massive ice walls line its edges, a fringe of cold against the void.",
            callFunction: goToLevel0, repainter: simpleSquare, mazeGenerator: generatePrimsMaze, playerSkin: arrowPlayer
        },
        {level: 1, 
            width: 25, height: 25, radius: 3,
            color: "#fc9d03", background: "./assets/allen_belt.png",
            titlecard: "You cannot claim to see the curvature of Earth from space. A radiation belt incinerates whoever leaves the atmosphere.",
            callFunction: goToLevel1, repainter: simpleSquare, mazeGenerator: doubleBacktrackMaze, playerSkin: radiationPlayer
        },
        {level: 2, 
            width: 33, height: 33, radius: 7,
            color: "#8a8a74", background: "./assets/moon_hoax.png",
            titlecard: "Of course this means the moon landing was faked: filmed by Stanley Kubrick, yet the shadows in the shot are not correct.",
            callFunction: goToLevel2, repainter: simpleCircle, mazeGenerator: doubleBacktrackMaze, playerSkin: moonPlayer
        },
        {level: 3, 
            width: 29, height: 29, radius: 3,
            color: "#abab2e", background: "./assets/moon_projection.png",
            titlecard: "In fact, the moon isn't even really there at all. It is nothing more than a projection in the sky, a decoy to distract us from the truth.",
            callFunction: goToLevel3, repainter: simpleCircle, mazeGenerator: generateBacktrackMaze, playerSkin: lampPlayer
        },
        {level: 4, 
            width: 25, height: 25, radius: 3,
            color: "#bf7122", background: "./assets/hollow_earth.png",
            titlecard: "Not only is it flat, the Earth is also hollow. At the poles you will find access points revealing the concentric, hidden worlds inside.",
            callFunction: goToLevel4, repainter: simpleGravity, mazeGenerator: generateBacktrackMaze, playerSkin: hollowPlayer
        },
        {level: 5, 
            width: 29, height: 29, radius: 3,
            color: "#769971", background: "./assets/reptile_ruler.png",
            titlecard: "The subterrean Earth is home to a reptilian species vastly more advanced than us. They hoard their marvels of technology, holding in their palms the secrets to free energy and immortality.",
            callFunction: goToLevel5, repainter: simpleGravity, mazeGenerator: doubleBacktrackMaze, playerSkin: lizardPlayer
        },
        {level: 6, 
            width: 33, height: 33, radius: 3,
            color: "#baa59b", background: "./assets/vril_society.png",
            titlecard: "The existence of our reptile rulers is kept hidden by a devious cabal within our own elites. These are known as the freemasons, specifically the Vril Society.",
            callFunction: goToLevel6, repainter: simpleCircleInvisMaze, mazeGenerator: doubleBacktrackMaze, playerSkin: roundPlayer
        },
        {level: 7, 
            width: 33, height: 33, radius: 3,
            color: "#fcf008", background: "./assets/chem_trail.png",
            titlecard: "The elites use aircraft to spread poisons in the sky. Toxins left by chemtrails work as sedatives to make the populace comply.",
            callFunction: goToLevel7, repainter: simpleCircle, mazeGenerator: generatePrimsMaze, playerSkin: poisonPlayer
        },
        {level: 8, 
            width: 29, height: 29, radius: 3,
            color: "#b50505", background: "./assets/global_warming.png",
            titlecard: "Global warming: yet another lie. The Earth is warming, but is also getting colder? As if humans have the power to destabilize the world's environment.",
            callFunction: goToLevel8, repainter: simpleGravity, mazeGenerator: doubleBacktrackMaze, playerSkin: firePlayer
        },
        {level: 9, 
            width: 25, height: 25, radius: 3,
            color: "#9c337c", background: "./assets/microchip.png",
            titlecard: "Pandemics are but an excuse to vaccinate us and sneak trackers in our bodies. The 5G network will be used to read our minds; the elites predict our thoughts before they even happen.",
            callFunction: goToLevel9, repainter: turnTable, mazeGenerator: doubleBacktrackMaze, playerSkin: pillPlayer
        },
        {level: 10, 
            width: 29, height: 29, radius: 7,
            color: "#466e6c", background: "./assets/celtic_god.png",
            titlecard: "All this while a deity is being summoned. CERN, a massive circular machine built underground, while the Celtic godking of the underworld was called CERNUNNOS – a coincidence?",
            callFunction: goToLevel10, repainter: turnTable, mazeGenerator: generateBacktrackMaze, playerSkin: celticPlayer
        },
        {level: 11, 
            width: 29, height: 29, radius: 7,
            color: "#6e132e", background: "./assets/black_hole7.png",
            titlecard: "But really it is already too late: in 2012, when the Higgs-Boson was supposedly discovered, a singularity devoured the entire globe. We simply haven't come to terms yet with our horrible demise.",
            callFunction: goToLevel11, repainter: blackHole, mazeGenerator: generatePrimsMaze, playerSkin: singularityPlayer
        }
    ];