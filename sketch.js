var bg, bg_img;
var play_btn, play_img,rules,rules_img;
var gameState = "start";
var player, player_animation;
var ground;
var bad_obstacle, bad_group, bad_img1, bad_img2, bad_img3;
var good_obstacle, good_group, good_img1, good_img2, good_img3;
var score1, score2;
var reset_btn, reset_img, gameOver, gameOver_img
var jump_sound, over_sound;



function preload(){
    bg_img = loadImage("images/bg.jpeg");
    play_img = loadImage("images/play.png");
    rules_img = loadImage("images/rules.png");

    player_animation = loadImage("images/boy.png");

    bad_img1 = loadImage("images/banana.png")
    bad_img2 = loadImage("images/waterGarbage.png")
    bad_img3 = loadImage("images/trashcan.png")

    good_img1 = loadImage("images/recycleBin.png")
    good_img2 = loadImage("images/tree.png")
    good_img3 = loadImage("images/wet_dry_waste.png")

    reset_img = loadImage("images/reset.png")
    gameOver_img = loadImage("images/game_over.png")

    jump_sound = loadSound("jumps.mp4")
    over_sound = loadSound("over.mp3")

}

function setup(){
    createCanvas(windowWidth,windowHeight);

    bg = createSprite(width/2,height/2,width,height);
    bg.addImage(bg_img);
    bg.scale = 1.9  ;

    play_btn = createSprite(width/2,height-175,50,20);
    play_btn.addImage(play_img);
    play_btn.scale = 1.2;

    rules = createSprite(width - 110,100,50,20);
    rules.addImage(rules_img);
    rules.scale = 0.9;

    player = createSprite(250,height - 300,50,50);
    player.addImage(player_animation);
    player.scale = 0.2;
    // player.debug = true;
    player.setCollider("rectangle", 0, 0, 300, 800);

    ground = createSprite(width/3, height - 200, width, 20);
    ground.visible = false;

    bad_group = createGroup()
    good_group = createGroup()

    score1 = 0;
    score2 = 0;

    reset_btn = createSprite(width/2, height/2  + 200, 50 , 20);
    reset_btn.addImage(reset_img);
    reset_btn.scale = 0.5;
    reset_btn.visible = false;

    gameOver = createSprite(width/2, height/2 , 50 ,50);
    gameOver.addImage(gameOver_img);
    gameOver.visible = false;

}

function draw(){
    background("blue");


    if(gameState === "start"){
        play_btn.visible = true;
        rules.visible = true;
        if( touches.length > 0 || mousePressedOver(play_btn)){
            gameState = "play";
            touches = [];
        }

    }

    if(gameState === "play"){
        play_btn.visible = false;
        rules.visible = false;

        bg.velocityX = -7;

        if(bg.x < 0){
            bg.x = width/2;
        }

        if(touches.length > 0 || keyDown("space") && player.y >= height-350){
            player.velocityY = -13 ;
            jump_sound.play();
            touches = [];
        }
        player.velocityY += 0.5;

        var rand_num = Math.round(random(1, 2));
        
        switch(rand_num){
        case 1: spawn_bad_obstacle();
        break; 

        case 2: spawn_good_obstacle()
        break;
        default:break;
        }

        if(player.isTouching(good_group)){
            score1 +=1;
            good_group.destroyEach();
        }
        if(player.isTouching(bad_group)){
            score2 += 1;
            bad_group.destroyEach();
        }
        if(score2 == 5){
            gameState = "end";
            over_sound.play();
        }
    }

    if(gameState === "end"){
        play_btn.visible = false;
        rules.visible = false;
        gameOver.visible = true;
        reset_btn.visible = true;

        bg.velocityX = 0;
        player.velocityX = 0;
        bad_group.setVelocityXEach(0);
        good_group.setVelocityXEach(0);
        bad_group.setLifetimeEach(-1);
        good_group.setLifetimeEach(-1);


        if( touches.length > 0 || mousePressedOver(reset_btn)){
            reset()
            touches = []
        }
    }

    player.collide(ground);
    
    drawSprites();
    fill("#006400");
    textSize(40);
    textStyle(BOLD);
    text("Good: " + score1, 120, 75); 


    fill("brown");
    textSize(40);
    textStyle(BOLD);
    text("Bad: " + score2, 120, 120); 
    
}

function spawn_bad_obstacle(){
    if(frameCount % 130 === 0){
        bad_obstacle = createSprite(width, height - 280, 30, 30);
        // bad_obstacle.debug = true;
        bad_obstacle.velocityX = -7;
        bad_obstacle.lifetime = width/7;

        var rand = Math.round(random(1,3))

        switch(rand){
            case 1: bad_obstacle.addImage(bad_img1);
                    bad_obstacle.scale = 0.8; 
            break;
            case 2: bad_obstacle.addImage(bad_img2);
                    bad_obstacle.scale  = 0.3;
            break;
            case 3: bad_obstacle.addImage(bad_img3);
                    bad_obstacle.scale = 0.5;
            break;
            default: break;
        }
        bad_group.add(bad_obstacle);
    }
}

function spawn_good_obstacle(){
    if(frameCount % 130 === 0){
        good_obstacle = createSprite(width, height - 280, 30, 30);
        // good_obstacle.debug = true;
        good_obstacle.velocityX = -7;
        good_obstacle.lifetime = width/7;

        var rand = Math.round(random(1,3))

        switch(rand){
            case 1: good_obstacle.addImage(good_img1);
                    good_obstacle.scale = 0.3; 
            break;
            case 2: good_obstacle.addImage(good_img2);
                    good_obstacle.scale  = 0.7;
            break;
            case 3: good_obstacle.addImage(good_img3);
                    good_obstacle.scale = 0.7;
            break;
            default: break;
        }
        good_group.add(good_obstacle);
    }
}

function reset(){
    gameState = "start";
    score1 = 0;
    score2 = 0;
    reset_btn.visible = false;
    gameOver.visible = false;
    bad_group.destroyEach();
    good_group.destroyEach();
}