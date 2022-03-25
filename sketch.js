var PLAY=1;
var END=0;
var gamestate=PLAY;
var trex,trex_running,trex_collided;
var ground,groundImage;
var invisibleGround;
var clouds,cloudsimg ,cloudsgroup;
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6,obstacle,obstaclegroup;
var score
var gameoverimg,restartimg,gameover,restart
var jump_sound,die_sound,checkpoint_sound

//for loading images 
function preload(){
    trex_running=loadAnimation('trex1.png','trex3.png','trex4.png');
    trex_collided=loadAnimation('trex_collided.png')
    groundImage=loadImage('ground2.png');
    cloudsimg=loadImage('cloud.png')
    obstacle1=loadImage('obstacle1.png')
    obstacle2=loadImage('obstacle2.png')
    obstacle3=loadImage('obstacle3.png')
    obstacle4=loadImage('obstacle4.png')
    obstacle5=loadImage('obstacle5.png')
    obstacle6=loadImage('obstacle6.png')
    gameoverimg=loadImage('gameover (2).png')
    restartimg=loadImage('restart.png')
    checkpoint_sound=loadSound('checkpoint.mp3')
    die_sound=loadSound('die.mp3')
    jump_sound=loadSound('jump.mp3')

}
//for creating sprites canvas
function setup(){
    createCanvas(600,200);
    //for creating trex
    
    trex=createSprite(50,160,20,50);
    trex.addAnimation('running',trex_running);
    trex.addAnimation('collided',trex_collided)
    edges=createEdgeSprites()
    trex.scale=.5
    trex.x=150
    //to create ground sprite
    ground=createSprite(200,180,400,20)
    ground.addImage('ground',groundImage)
    ground.x=ground.width/2
    //to create invisible sprite
    invisibleGround=createSprite(200,190,400,10)
    invisibleGround.visible=false
    //console.log('hello'+'world')
    score=0
    
    obstaclesgroup=new Group();
    cloudsgroup=new Group();
    trex.setCollider('circle',0,0,40)
    trex.debug=false
    gameover=createSprite(300,100)
    gameover.addImage('gameover',gameoverimg)
    restart=createSprite(300,140)
    restart.addImage('restart',restartimg)
    gameover.scale= 1.5
    restart.scale=.5
    
  

}
   function draw(){
  //set background color 
    background ('white')
    
    text('score: '+ score,500,50)
    console.log('this is ',gamestate)
    if (gamestate===PLAY){
      score=score+Math.round(getFrameRate()/60)
      if(score>0 && score % 200===0){
        checkpoint_sound.play()
       
      }
      //to give backward velocity to ground
    ground.velocityX=-(4+score/100)
      //for reseting the ground 
    if(ground.x<0){
      ground.x=ground.width/2
  
      }

      //jump when space key is pressed
    if (keyDown('space')&&trex.y>=160) {
      trex.velocityY= -10
      jump_sound.play()
    }

    //add gravity
    trex.velocityY=trex.velocityY+0.6

    spawnClouds()
    spawnObstacles()
      gameover.visible=false
      restart.visible=false
      //to end the game 
    if (obstaclesgroup.isTouching(trex)){
      gamestate=END
      die_sound.play()
      //trex.velocityY= -10
      //jump_sound.play()
    }
    }
    else if (gamestate===END){
      //to stop the ground
      ground.velocityX=0
      trex.velocityY=0
      trex.changeAnimation('collided',trex_collided)
      obstaclesgroup.setVelocityXEach(0)
      cloudsgroup.setVelocityXEach(0)
      obstaclesgroup.setLifetimeEach(-1)
      cloudsgroup.setLifetimeEach(-1)
      text('score: '+ score,500,50)
      gameover.visible=true
      restart.visible=true
      if (mousePressedOver(restart)){
        //console.log('restart the game')
       reset();
    }
      //console.log(obstaclesgroup.lifetime)
    }
    //for knowing trex y position
    //console.log(trex.y)
    
    //console.log(ground.x)
    
    //console.log(frameCount)
    
    
    //stop trex from falling down
    trex.collide(invisibleGround)
    
    drawSprites()
    }


    function spawnClouds(){
      if(frameCount % 60===0){
        clouds =createSprite(600,100,40,10)
        clouds.addImage(cloudsimg) 
        clouds.y=Math.round(random(10,60))
        clouds.scale=.5 
       clouds.velocityX=-4
       clouds.depth=trex.depth
       trex.depth=trex.depth+1

       // console.log(trex.depth)
        //console.log(clouds.depth)
        //time =distance/speed and velocity=frames per second
        clouds.lifetime=310;
        cloudsgroup.add(clouds);
      }
    

    }

    function spawnObstacles(){
     if (frameCount % 100===0) {
        obstacle=createSprite(600,165,10,40)
       obstacle.velocityX=-(4+score/100)

       var rand=Math.round(random(1,6))
       switch(rand){
       case 1: obstacle.addImage(obstacle1);
       break;
       case 2: obstacle.addImage(obstacle2);
       break;
       case 3: obstacle.addImage(obstacle3);
       break;
       case 4: obstacle.addImage(obstacle4);
       break;
       case 5: obstacle.addImage(obstacle5);
       break;
       case 6: obstacle.addImage(obstacle6);
       break;
       default:break;
       }
       obstacle.scale=.5;
       obstacle.lifetime=310;

       obstaclesgroup.add(obstacle);
     }


    }
    function reset(){
      gamestate=PLAY
      score=0
      gameover.visible=false
      restart.visible=false
      obstaclesgroup.destroyEach()
      cloudsgroup.destroyEach()
      trex.changeAnimation('running',trex_running)

    }
    