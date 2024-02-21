import { mapHeight, mapWidth, scale } from "./consts.js";
import map from "./map.js";
import decorations from "./decorations.js";
import decorations1 from "./decorations1.js";

class Farm extends Phaser.Scene {
    constructor() {
        super("game-scene");
        this.player;
    }

    preload() {


        // this.load.atlas('tiles', "./Assets/Tiles/fixedTiles.png", './Assets/Tiles/tiles.json');
        // this.load.atlas('decorations', "./Assets/Decorations/decorations.png", './Assets/Decorations/decorations.json');
        // this.load.image('house', "./Assets/Buildings/house_player.png");
        this.load.atlas("trees","./Assets/Decorations/treesAtlas-default.png","./Assets/Decorations/treesAtlas.json");
        this.load.atlas('decorations','./Assets/Decorations/decorations.png',"./Assets/Decorations/decorations.json");
        this.load.image('player', "./Assets/Player/NPC5_door_fall.gif");
        this.load.image('buildings','./Assets/Buildings/buildings.png');
        this.load.image('tiles','./Assets/Tiles/tiles.png');
        this.load.image('player_house','./Assets/Buildings/house_player.png');
        this.load.image('market','./Assets/Buildings/market.png')
        
        this.load.image('map','./Assets/Tiles/map.png');
        this.load.image('trees','./Assets/Decorations/tree_shake.png');

        this.load.tilemapTiledJSON('tilemap','./Assets/Tiles/map.JSON');

        //domek, strach na wróble, drzewo, płotki, kwiatki
    }

    create() {
       
        const map = this.make.tilemap({ key: 'tilemap' })
        const tileset = map.addTilesetImage('tiles', 'tiles');
        const trees = map.addTilesetImage('tree_shake', 'trees');
        const  buildings = map.addTilesetImage('buildings', 'buildings');
        
        map.createLayer('ground', tileset);
        map.createLayer('farm_spots', tileset);
    


        const decorationsLayer = map.getObjectLayer('decorations')['objects'];
        const decorationsPhysic = this.physics.add.staticGroup();
        this.decorations = [];
        decorationsLayer.forEach(object => {
            // Replace each object with a tile
           if(object.name.split("_")[0]=="tree"&&object.name.split("_")[1]!="stump"){
            decorations.push(decorationsPhysic.create(object.x+(object.width/2), object.y-(object.height/2), "trees",object.name));
           }else{
            decorations.push(decorationsPhysic.create(object.x,object.y-(object.height/2),"decorations",object.name))
           }
            // Additional setup for the tile if needed
        });
        

    
        
        this.player = this.physics.add.sprite(500, 200, 'player');
        this.cursor = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player, true, 0.2, 0.2);
        this.cameras.main.setZoom(3,3)
        const house = this.physics.add.sprite(560, 110, 'player_house');
        house.setImmovable(true);
        this.physics.add.collider(this.player, house);
        const market = this.physics.add.sprite(380, 290, 'market');
        market.setImmovable(true);
        this.physics.add.collider(this.player, market);
      
        // this.cameras.main.setBounds(0, 0, window.innerWidth*3, window.innerHeight);**
        this.playerSpeed = 50;
    }
    update() {
      
        const {
            left,
            right,
            up,
            down
        } = this.cursor;

        if (left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
        
            this.playerFacing = -1;
        } else if (right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
      
            this.playerFacing = 1;
        } else {
            this.player.setVelocityX(0);
        }

        if (up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
        
            this.playerFacing = -1;
        } else if (down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
      
            this.playerFacing = 1;
        } else {
            this.player.setVelocityY(0);
        }

        

        
    }
}

export default Farm;