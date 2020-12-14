
var dog ,happyDog;
var database;
var foodS, foodStock;
var allFood;
var feed, addFood;
var lastFed , fedTime; 
var foodObj;

var readState;
var gameState;

var garden, washroom, bedroom, livingRoom;
var dogImage1, dogImage, dogImage2

function preload()
{
  dog_Image=loadImage("dogImg.png");
  dog_Image1=loadImage("dogImg1.png");
  dog_Image2=loadImage("Lazy.png");

  garden=loadImage("Garden.png");
  washroom=loadImage("Wash Room.png");
  bedroom=loadImage("Bed Room.png");
  livingRoom=loadImage("Living Room.png");
}

function setup() 
{  
  database=firebase.database();

  createCanvas(1000, 400);

  foodObj= new Food();
  
  dog=createSprite(450,250,20,20);
  dog.addImage("dog1",dog_Image);
  dog.scale=0.4;

  feed=createButton("Feed the Dog ");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);


  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    
    gameState= data.val();
  });

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
}


function draw() 
{  
  currentTime=second();
  if(currentTime==(lastFed+1))
  {
    update("Playing");
    foodObj.garden();
  } 
  else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }
   else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }
   else{
    update("Hungry")
    foodObj.display();
   }
   if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
   feed.show();
   addFood.show();
   dog.addImage(dog_Image1);
  }
   
  drawSprites();
}


function readStock(data)
{
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}




function addFoods()
{
foodS++;
database.ref('/').update({
  Food:foodS
})
}

function feedDog(){
dog.addImage(dog_Image2);

foodObj.updateFoodStock(foodObj.getFoodStock()-1);
database.ref('/').update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour(),
  gameState:"Hungry"
})

}

function update(state)
{
  database.ref('/').update({
    gameState:state
  })
}



