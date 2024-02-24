import { mapHeight, mapWidth, scale, animalSpeed } from "./consts.js";


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
        //map assets
        this.load.atlas("trees","./Assets/Decorations/treesAtlas-default.png","./Assets/Decorations/treesAtlas.json");
        this.load.atlas('decorations','./Assets/Decorations/decorations.png',"./Assets/Decorations/decorations.json");
        this.load.atlas('bridges','./Assets/Buildings/Bridges/bridges.png',"./Assets/Buildings/Bridges/bridges.json");
        this.load.atlas('fences',"./Assets/Decorations/fences.png",'./Assets/Decorations/fences.json')
        this.load.image('buildings','./Assets/Buildings/buildings.png');
        this.load.image('tiles','./Assets/Tiles/tiles.png');
        this.load.image('player_house','./Assets/Buildings/house_player.png');
        this.load.image('market','./Assets/Buildings/market.png')
        this.load.image('map','./Assets/Tiles/map.png');
        this.load.image('trees','./Assets/Decorations/tree_shake.png');
        this.load.spritesheet('sheep','./Assets/Animals/sheep animation.png',{
            frameWidth:17,
            frameHeight:17,

        })
        this.load.spritesheet('baby_sheep','./Assets/Animals/sheep_baby animation.png',{
            frameWidth:16,
            frameHeight:16,

        })
      
        //player
        this.load.spritesheet('player', "./Assets/Player/char1.png",{
            frameWidth:32, 
            frameHeight:32
        });
        //tilemap
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
        const water = map.createLayer('water',tileset);
        water.setCollisionByExclusion([-1]);
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

      
       
        //setting up player animations
        this.anims.create({
            key:"walkBottom",
            frames:this.anims.generateFrameNumbers("player",{frames:[0,1,2,3,4,5,6,7]}),
            frameRate:8,
            repeat:-1
        })
        this.anims.create({
            key:"walkUp",
            frames:this.anims.generateFrameNumbers("player",{frames:[8,9,10,11,12,13,14,15]}),
            frameRate:8,
            repeat:-1
        })
        this.anims.create({
            key:"walkRight",
            frames:this.anims.generateFrameNumbers("player",{frames:[16,17,18,19,20,21,22,23]}),
            frameRate:8,
            repeat:-1
        })
        this.anims.create({
            key:"walkLeft",
            frames:this.anims.generateFrameNumbers("player",{frames:[24,25,26,27,28,29,30,31]}),
            frameRate:8,
            repeat:-1
        })
        //setting up animals animations
        this.anims.create({
            key:"sheepWalkBottom",
            frames:this.anims.generateFrameNumbers("sheep",{frames:[0,1,2,3]}),
            frameRate:4,
            repeat:-1
        })
        this.anims.create({
            key:"sheepWalkUp",
            frames:this.anims.generateFrameNumbers("sheep",{frames:[4,5,6,7]}),
            frameRate:4,
            repeat:-1
        })
        this.anims.create({
            key:"sheepWalkRight",
            frames:this.anims.generateFrameNumbers("sheep",{frames:[8,9,10,11]}),
            frameRate:4,
            repeat:-1
        })
        this.anims.create({
            key:"sheepWalkLeft",
            frames:this.anims.generateFrameNumbers("sheep",{frames:[12,13,14,15]}),
            frameRate:4,
            repeat:-1
        })

        this.anims.create({
            key:"baby_sheepWalkBottom",
            frames:this.anims.generateFrameNumbers("baby_sheep",{frames:[0,1,2,3]}),
            frameRate:4,
            repeat:-1
        })
        this.anims.create({
            key:"baby_sheepWalkUp",
            frames:this.anims.generateFrameNumbers("baby_sheep",{frames:[4,5,6,7]}),
            frameRate:4,
            repeat:-1
        })
        this.anims.create({
            key:"baby_sheepWalkLeft",
            frames:this.anims.generateFrameNumbers("baby_sheep",{frames:[8,9,10,11]}),
            frameRate:4,
            repeat:-1
        })
        this.anims.create({
            key:"baby_sheepWalkRight",
            frames:this.anims.generateFrameNumbers("baby_sheep",{frames:[12,13,14,15]}),
            frameRate:4,
            repeat:-1
        })
        //spawning player
       
        
        this.player = this.physics.add.sprite(700, 330, 'player');

        this.physics.add.collider(this.player,water);



        //spawning animals
        this.animals=[];
        this.animals.push(this.physics.add.sprite(500,800,"sheep"));
        this.animals[this.animals.length-1].name = "sheep";
        this.animals.push(this.physics.add.sprite(700,700,"sheep"));
        this.animals[this.animals.length-1].name = "sheep";
        this.animals.push(this.physics.add.sprite(730,670,"sheep"));
        this.animals[this.animals.length-1].name = "sheep";
        this.animals.push(this.physics.add.sprite(700,750,"sheep"));
        this.animals[this.animals.length-1].name = "sheep";

        this.animals.push(this.physics.add.sprite(550,750,"baby_sheep"));
        this.animals[this.animals.length-1].name = "baby_sheep";
        this.animals.push(this.physics.add.sprite(650,750,"baby_sheep"));
        this.animals[this.animals.length-1].name = "baby_sheep";
        this.animals.push(this.physics.add.sprite(580,780,"baby_sheep"));
        this.animals[this.animals.length-1].name = "baby_sheep";
        //fences collision
        this.fences.forEach(fence=>{
            let splitedName = fence.frame.name.split("_");
            this.animals.forEach(animal=>{
                this.physics.add.collider(fence,animal);
            })
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
        this.cameras.main.startFollow(this.player, true, 1, 1);
        this.cameras.main.setZoom(3,3)
        this.cameras.main.scrollY=1;
        this.cameras.main.scrollX=1;
        this.physics.world.fixedStep = false;
        //adding buildings
        const house = this.physics.add.sprite(720, 270, 'player_house');
        house.setImmovable(true);
        this.physics.add.collider(this.player, house);
        const market = this.physics.add.sprite(520, 460, 'market');
        market.setImmovable(true);
        this.physics.add.collider(this.player, market);
        this.player.body.setSize(this.player.width/2,this.player.height*2/3);
        this.player.body.setOffset(this.player.width/4,this.player.height/3)
        this.animalTriggers = [];
        //collision with animals
        this.animals.forEach(animal=>{
            this.physics.add.collider(this.player,animal);
            this.animalTriggers.push(this.time.addEvent({
                callback:()=>{this.moveAnimals(animal)},
                callbackScope: this,
                delay:1000,
                loop:true
            }))
        })
        
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
        let playingAnimation = false;
        if (left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.play("walkLeft",true);
            playingAnimation = true;
            this.playerFacing = -1;
        } else if (right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.play("walkRight",true);
            playingAnimation = true;
            this.playerFacing = 1;
        } else {
            this.player.setVelocityX(0);
        }

        if (up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
           if(!playingAnimation) this.player.play("walkUp",true);
           
            
            this.playerFacing = -1;
        } else if (down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
            if(!playingAnimation)this.player.play("walkBottom",true);
            this.playerFacing = 1;
        } else {
            this.player.setVelocityY(0);
            if(!playingAnimation){
                this.player.anims.stop();
            }
        }

        
     
        
        
    }
    moveAnimals(animal){
        let velX = Math.floor(Math.random() * (animalSpeed - (-animalSpeed) + 1) + -animalSpeed);
        let velY = Math.floor(Math.random() * (animalSpeed - (-animalSpeed) + 1) + -animalSpeed);
        animal.setVelocityX(velX)
        animal.setVelocityY(velY)
        if(velX>0){
            if(velX>Math.sign(velY)*velY){
                animal.play(animal.name+"WalkRight",true);
            }else{
                if(velY>0){
                    animal.play(animal.name+"WalkBottom",true);
                }else{
                    animal.play(animal.name+"WalkUp",true);
                }
            }
        }else{
            if(Math.sign(velX)*velX>Math.sign(velY)*velY){
                animal.play(animal.name+"WalkLeft",true);
            }else{
                if(velY>0){
                    animal.play(animal.name+"WalkBottom",true);
                }else{
                    animal.play(animal.name+"WalkUp",true);
                }
            }
        }
    }
}

export default Farm;