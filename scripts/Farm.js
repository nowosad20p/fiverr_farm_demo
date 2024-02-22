import { mapHeight, mapWidth, scale } from "./consts.js";
import map from "./map.js";
import decorations from "./decorations.js";
import decorations1 from "./decorations1.js";

class Farm extends Phaser.Scene {
    constructor() {
        super("game-scene");
        this.player;
        this.fences = []; //list of fences for future reference
    }

    preload() {


        // this.load.atlas('tiles', "./Assets/Tiles/fixedTiles.png", './Assets/Tiles/tiles.json');
        // this.load.atlas('decorations', "./Assets/Decorations/decorations.png", './Assets/Decorations/decorations.json');
        // this.load.image('house', "./Assets/Buildings/house_player.png");
        this.load.atlas("trees","./Assets/Decorations/treesAtlas-default.png","./Assets/Decorations/treesAtlas.json");
        this.load.atlas('decorations','./Assets/Decorations/decorations.png',"./Assets/Decorations/decorations.json");
        this.load.atlas('bridges','./Assets/Buildings/Bridges/bridges.png',"./Assets/Buildings/Bridges/bridges.json");

        this.load.atlas('fences',"./Assets/Decorations/fences.png",'./Assets/Decorations/fences.json')
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
        //loading tilemaps
        const map = this.make.tilemap({ key: 'tilemap' })
        const tileset = map.addTilesetImage('tiles', 'tiles');
        const trees = map.addTilesetImage('tree_shake', 'trees');
        const buildings = map.addTilesetImage('buildings', 'buildings');
       
        //creating ground
        map.createLayer('ground', tileset);
        map.createLayer('farm_spots', tileset);
        
        //adding bridges
        const bridgesLayer = map.getObjectLayer('bridges')['objects'];
        const bridgesPhysic = this.physics.add.staticGroup();
        this.bridges = [];
        bridgesLayer.forEach(object=>{
            this.bridges.push(bridgesPhysic.create(object.x,object.y,"bridges",object.name))
        })
        //adding fences
        const fencesLayer = map.getObjectLayer('fences')['objects'];
        const fencesPhysic = this.physics.add.staticGroup();
        fencesLayer.forEach(object=>{
            let fence = fencesPhysic.create(object.x,object.y,"fences",object.name);
            this.fences.push(fence);
            
        })

        //adding decorations on which player can step on
        const decorationsLayer = map.getObjectLayer('decorations')['objects'];
        const decorationsPhysic = this.physics.add.staticGroup();
        this.decorations = [];
        decorationsLayer.forEach(object => {
           
        
            this.decorations.push(decorationsPhysic.create(object.x,object.y-(object.height/2),"decorations",object.name))
           
         
        });

        

        //spawning player
        this.player = this.physics.add.sprite(700, 330, 'player');
        
        
        //fences collision
        this.fences.forEach(fence=>{
            let splitedName = fence.frame.name.split("_");
            if(splitedName[1]=="fence"){
                this.physics.add.collider(this.player,fence);
                if(splitedName[0]=="stone"&&splitedName[2]=="vertical"){
                    fence.body.setSize(fence.displayWidth/3,fence.displayHeight);
                    if(splitedName[3]=="right"){
                        fence.body.setOffset(0,0);
                    }else{
                        fence.body.setOffset(fence.displayWidth*2/3,0)
                    }
                }
            }
        })
       
        //spawning decorations player will be behind
        const frontDecorationsLayer = map.getObjectLayer('front_decorations')['objects'];
        const frontDecorationsPhysic = this.physics.add.staticGroup();;
        this.frontDecorations = [];
        frontDecorationsLayer.forEach(object => {
        
           if(object.name.split("_")[0]=="tree"&&object.name.split("_")[1]!="stump"){
            //setting up trees
            let tree =frontDecorationsPhysic.create(object.x+(object.width/2), object.y-(object.height/2), "trees",object.name)
            this.frontDecorations.push(tree);
            //setting up collision between player and tree stump
            this.physics.add.collider(this.player, tree);
            tree.body.setSize(10,6)
            tree.body.setOffset(object.width/3, object.height*2.5/3);

           }else{

            let decoration = frontDecorationsPhysic.create(object.x,object.y-(object.height/2),"decorations",object.name)
            if(object.name=="lantern_on_bottom"){
               this.physics.add.collider(this.player,decoration);
               decoration.body.setSize(object.width/2,object.height*0.7);
               decoration.body.setOffset(object.width/4,object.height*0.3);
            }
            this.frontDecorations.push(decoration)
           }
            
        });

        //inputs and camera setup
        this.cursor = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player, true, 0.2, 0.2);
        this.cameras.main.setZoom(3,3)
        //adding buildings
        const house = this.physics.add.sprite(720, 270, 'player_house');
        house.setImmovable(true);
        this.physics.add.collider(this.player, house);
        const market = this.physics.add.sprite(520, 460, 'market');
        market.setImmovable(true);
        this.physics.add.collider(this.player, market);
        this.player.body.setSize(this.player.width,this.player.height*2/3);
        this.player.body.setOffset(0,this.player.height/3)
        // this.cameras.main.setBounds(0, 0, window.innerWidth*3, window.innerHeight);**
        //player stats
        this.playerSpeed = 80;
    }
    update() {
      //player movement
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