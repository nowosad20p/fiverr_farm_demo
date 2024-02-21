import Farm from "./scripts/Farm.js";
import { screenSize } from "./scripts/consts.js";

const config = {
    type: Phaser.WEBGL,
    width: screenSize.width,
    height: screenSize.height,
    scene: [Farm],
    canvas: gameCanvas,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);