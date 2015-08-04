
var GRID_WIDTH = 10;
var GRID_HEIGHT = 11;
var TILE_WIDTH = 50; //Tiles are 50x50 pixels
var CHAR_SPEED = 10;

function loadImages() {//Preloads the images
	queue = new createjs.LoadQueue(false);//true loads file as XHR, whatever that means
	queue.on("complete", startGame, this);
	queue.loadManifest(["testImages/water.png", "testImages/ground.jpg", "testImages/road.png",
		"testImages/medical-kit.png", "testImages/boat.png", "testImages/tree.png", 
		"testImages/mopeds.png", "testImages/nurse-f.png", 
		"testImages/nurse-b.png", "testImages/nurse-r.png", "testImages/nurse-l.png",
		"testImages/temple.png","testImages/house.png","testImages/moped2.png", "testImages/back.jpg"]);
}

function TileRow (type,row,img) {// Represents a row object. Type is 0 for ground, 1 for road and 2 for water
	this.type = type;
	this.row = row;
    var image = queue.getResult(img);
	// var bitmap = new createjs.Bitmap(image);
	// bitmap.x = 0;
	// bitmap.y = this.row * TILE_WIDTH;
	// stage.addChild(bitmap);

	this.shiftDown = function() {
        this.row ++;
     
    }
    this.draw = function() { 	    
		// bitmap.y = this.row * TILE_WIDTH;	         	   
	   //console.log("drawing a " + this.type + " at " + this.row );   
 		// stage.update();	   
 		context.drawImage(image,0,this.row * TILE_WIDTH);		
    }
}

function Character (xPos, yPos, onBoat, imgB, imgF, imgR, imgL){ //Represents our beautiful character
	this.x = xPos;
	this.y = yPos;
	this.xCoord = this.x * TILE_WIDTH;
	this.xCoordAct = this.x * TILE_WIDTH + 14;//The x coordinate of the actual image
	this.yCoord = this.y * TILE_WIDTH;//Should currently be 100;
	this.width = 22;
	this.speed = CHAR_SPEED;//Onlys used when character is on a boat
	this.onBoat = onBoat;
	var imageB = queue.getResult(imgB);
	var imageF = queue.getResult(imgF);
	var imageR = queue.getResult(imgR);
	var imageL = queue.getResult(imgL);
	this.currentImage = imageF;
//	var bitmapB = new createjs.Bitmap(imageB);
//	var bitmapF = new createjs.Bitmap(imageF);
//	var bitmapR = new createjs.Bitmap(imageR);
//	var bitmapL = new createjs.Bitmap(imageL);
//	bitmapB.x = this.x * TILE_WIDTH;
//	bitmapB.y = this.y * TILE_WIDTH;  
//	stage.addChild(bitmapB);
//	stage.addChild(bitmapF);
//	stage.addChild(bitmapR);
//	stage.addChild(bitmapL);
	this.switchImage = function(letter) {
		if(letter === 'R') {
			this.currentImage = imageR;
		}
		else if(letter === 'L') {
			this.currentImage = imageL;
		}
		else if(letter === 'B') {
			this.currentImage = imageB;
		}
	}

	this.draw = function() {
		context.drawImage(this.currentImage,this.xCoord ,this.yCoord);	
	}
	this.up = function() {
		if (this.y < 7) {//MOVE TO KEY INPUT IF POSSIBLE
            game.shiftGame();
        }
        else {    	
          	this.y -= 1;
            this.yCoord = this.y * TILE_WIDTH;
        }	
    	this.currentImage = imageB;
    }
    this.down = function() {
    	this.y += 1;
        this.yCoord = this.y * TILE_WIDTH;
    	this.currentImage = imageF;
    }
    this.left = function() {
    	this.xCoord -= TILE_WIDTH;
    	this.xCoordAct -= TILE_WIDTH;
    	this.currentImage = imageL;
    }
    this.right = function() {
    	this.xCoord += TILE_WIDTH;
    	this.xCoordAct += TILE_WIDTH;
    	this.currentImage = imageR;
    }
    this.leftOnBoat = function() {
    	this.xCoord -= this.speed;
    	this.xCoordAct -= this.speed;
    	//this.currentImage = imageL;
    }
    this.rightOnBoat = function() {
    	this.xCoord += this.speed;
    	this.xCoordAct += this.speed;
    	//this.currentImage = imageR;
    }
}


//Constructor for Movable Class
function Movable(xPos,yPos,speed,type,img) {	//Type: 0 for medicine bag, 1 for moped and 2 for boat
	this.x = xPos;
	this.y = yPos;
	this.xCoord = this.x * TILE_WIDTH;//x Coordinate, used for moving
	this.yCoord = this.y * TILE_WIDTH;
	this.speed = speed;        //Speed can be negative
	this.type = type;
	var image = queue.getResult(img);
	// var bitmap = new createjs.Bitmap(image);
	// stage.addChild(bitmap);
	this.shiftDown = function() {
        this.y ++;
        this.yCoord += TILE_WIDTH;
    }
    this.move = function() {
    	this.xCoord += this.speed; 
    }
    this.draw = function() {
    	// bitmap.x = this.xCoord;
	    // bitmap.y = this.y * TILE_WIDTH;  
 		// stage.update();	 
 		context.drawImage(image, this.xCoord, this.y * TILE_WIDTH);	

    }
    this.outOfBounds = function(){
    	return ((this.xCoord + TILE_WIDTH) < 0 || this.xCoord > GRID_WIDTH*TILE_WIDTH);
    }
} 

function Obstacle(xPos,yPos,offset,width,img) {	
	this.x = xPos;
	this.y = yPos;
	this.xCoord = xPos * TILE_WIDTH;
	this.xCoordAct = xPos * TILE_WIDTH + offset;
	this.width = width;
	var image = queue.getResult(img);
	this.shiftDown = function() {
        this.y = this.y + 1;

    }
    this.draw = function() {
 		context.drawImage(image, this.x * TILE_WIDTH, this.y * TILE_WIDTH);	
    }
} 

//Ground Tile constructor
function Ground (row) {
	TileRow.call(this,0,row,"testImages/ground.jpg");
}
//Road Tile constructor
function Road (row) {
	TileRow.call(this,1,row,"testImages/road.png");
}

//River constructor
function River (row) {
	TileRow.call(this,2,row,"testImages/water.png");
}



//Moped constructor
function Moped (x,y,speed) {
	var mopedImg;
	if (speed < 0) {
		mopedImg = "testImages/mopeds.png";
	}
	else {
		mopedImg = "testImages/moped2.png";
	}
	Movable.call(this,x,y,speed,1, mopedImg);
}

//Boat constructor
function Boat (x,y,speed) {
	Movable.call(this,x,y,speed,2,"testImages/boat.png");	
}

//Medical Kit constructor
function MedicalKit(x,y) {
	Movable.call(this,x,y,0,0,"testImages/medical-kit.png");
}

//Building constructor
function Building(x,y) {
	Obstacle.call(this,x,y,6,25,"testImages/house.png");
}

function Temple(x,y) {
	Obstacle.call(this,x,y,10, 29,"testImages/temple.png");
}

function Tree(x,y) {
	Obstacle.call(this,x,y,0,50,"testImages/tree.png");
}
function Game(numMoved) {
	this.score = numMoved;
	this.numKits = 0;
	this.inProgress = true;
	this.shiftGame = function() {
		shiftTileRow();
		shiftMovables();
		shiftObstacles();
		this.score ++;
	}
	this.reset = function() {
		makeTileRows();	
		drawTileRow();
		makeMovablesAndObstacles();		
		game.score = 0;//CHANGE IF LEVELS ADDED
		game.numKits = 0;
		
		character.x = GRID_WIDTH/2;
		character.xCoord = character.x*TILE_WIDTH;
		character.xCoordAct = character.xCoord + 14;
		character.y = GRID_HEIGHT-1;
		character.yCoord = character.y*TILE_WIDTH;
		createjs.Ticker.addEventListener("tick", handleTick);
	}
	this.sleep = function(miliseconds) {
		var currentTime = new Date().getTime();
	    while (currentTime + miliseconds >= new Date().getTime()) {
	        
	    }
	    
	}
}


var game, context, scoreContext, stage, container, tileRows, obstacles, movables, character;//These will be initialized


function startGame() {
	
	board = document.getElementById("demoCanvas");
	scoreBoard = document.getElementById("info");
    context = board.getContext("2d");
    scoreContext = scoreBoard.getContext("2d");
    container = new createjs.Container();//DELETE
 	
 	game = new Game(0);
 	stage = new createjs.Stage("demoCanvas");
 	
	makeTileRows();
	console.log(tileRows);	
	drawTileRow();
	console.log(tileRows);
	makeMovablesAndObstacles();
	console.log(movables);	
	console.log(obstacles);
	setOffTicker();
	character = new Character(GRID_WIDTH/2,GRID_HEIGHT-1,false, "testImages/nurse-b.png", "testImages/nurse-f.png",
  	"testImages/nurse-r.png", "testImages/nurse-l.png");
		

}

function setOffTicker() {  
	createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", handleTick);

}                   
function handleTick(event) {
     // Actions carried out each tick (aka frame)
    if (!event.paused) {
    	
    	drawTileRow();
     	drawMovables();
     	drawObstacles();
     	drawChar();
     	drawScores();
         // Actions carried out when the Ticker is not paused.
	}	   
 }


function makeTileRows () {// initializes backgound of game with tileRows
	tileRows = [];
	for(var i = 0; i<GRID_HEIGHT-2; i++) {
		tileRows.push(getNewTileRow(i));
	}
	tileRows.push(new Ground(GRID_HEIGHT-2)); //This makes sure there is ground row at bottom
	tileRows.push(new Ground(GRID_HEIGHT-1));
}
function shiftTileRow() {
	tileRows.unshift(getNewTileRow(-1));//Adds a tile to beginning of array
	tileRows.pop();//Removes the last element in the array
	for(var i = 0; i<tileRows.length; i++) {
		tileRows[i].shiftDown();	
	}


	//game.numMoved++;	
}

function drawTileRow () {
	for(var i = 0; i<tileRows.length; i++) {
		tileRows[i].draw();
	}
}

function getNewTileRow(row) {
	var rand = Math.floor(Math.random()*3);//This returns 0, 1, or 2 in equal proportions
	if(rand === 0) {
		return new Road(row);	
	}
	else if(rand === 1)  {
		return new River(row);	
	}
	else {
		return new Ground(row);	
	}
}

function makeMovablesAndObstacles() {//Initializes the array of boats and mopeds
	movables = [];
	obstacles = [];
	for(var i = 0; i<tileRows.length; i++) {
		var type = tileRows[i].type;
		addNewMovables(type, i);//Adds row of movables 
		if(type === 0) {
			addNewObstacles(i);
		}
	}
}
function shiftMovables() {
	for(var i = 0; i<movables.length; i++) {
		movables[i].shiftDown();
		if(movables[i].y >= GRID_HEIGHT) {//chops off elements that are no longer on the screen
			movables.splice(i, 1);
			i--;
		}
	}
	if(tileRows[0].type === 0) {//Adds new movables
		addNewMovables(0, 0);
	}
	else if(tileRows[0].type === 1) {
		addNewMovables(1, 0);		
	}
	else {//if(tileRows[0].type === 2) {
		addNewMovables(2, 0);
	}

	
}
function shiftObstacles() {
	for(var i = 0; i<obstacles.length; i++) {
		obstacles[i].shiftDown();
		if(obstacles[i].y >= GRID_HEIGHT) {//chops off elements that are no longer on the screen
			obstacles.splice(i, 1);
			i--;
		}
	}
	if(tileRows[0].type === 0) {//Adds new movables
		addNewObstacles(0);
	}
	
}

function drawMovables() {//Moves the movables and draws them
	for (var i=0; i<movables.length; i++) {
        movables[i].move();
        if (movables[i].outOfBounds()) {
            if(movables[i].speed < 0) {
            	movables[i].xCoord = GRID_WIDTH * TILE_WIDTH;
            }
            else {
            	movables[i].xCoord = 0 - TILE_WIDTH;
            }
        }
        movables[i].draw();
    }
}
function drawObstacles() {//Draws them obstacles
	for (var i=0; i<obstacles.length; i++) {
        obstacles[i].draw();
    }
}

function addNewMovables(type, row) {//Adds new row of movables
	var rand = Math.floor(Math.random()*3);//This returns 0, 1, or 2 in equal proportions
	var speed = Math.random()*10 - 5;//Returns number from -5 to 5, should be pretty slow!!!!!
	if(speed <= 2 && speed > 0) {
		console.log(Math.abs(speed));
		speed += (Math.random()*2 + 2);//Generates from 2 to 4
	}
	else if(speed >= -2 && speed < 0) {
		speed -= (Math.random()*2 + 2);//Generates from 2 to 4
	}
	for(var xPos = rand; xPos<GRID_WIDTH; xPos+= rand) {
		rand = 0;
		if(type === 0) {//If ground type..
			xPos+= Math.floor(Math.random()*5);
			movables.push(new MedicalKit(xPos, row, 0));
			rand = Math.floor(Math.random()*5);//This is to decrease the frequency of medical kit spawns
		}
		else if(type === 1) {//If road type..
			movables.push(new Moped(xPos, row, speed));
		}		
		else {//If water type..
			movables.push(new Boat(xPos, row, speed));
		}	
		rand += Math.floor((Math.random() * 3) + 3);//This returns 2, 3, or 4 in equal proportions
	}
}
function addNewObstacles(row) {//Adds new row of obstacles
	var rand = Math.floor(Math.random()*7);//This returns 0, 1, 2, 3, 4, 5, 6 in equal proportions
	for(var xPos = rand; xPos<GRID_WIDTH; xPos+= rand) {
		if(rand % 3 === 0)
			obstacles.push(new Tree(xPos, row));
		else if(rand % 3 === 1)
			obstacles.push(new Building(xPos, row));	
		else
			obstacles.push(new Temple(xPos, row));//Should be the least common..NOT
		rand = Math.floor(Math.random()*7) + 1;
	}
}
function drawChar() {//Should be called constantly and check for collisions
	var collided = movableCollision();
	var fellOffEdge = isOutOfBounds();
	character.draw();
	if(collided === 0) {
		console.log("medicine bag collected");
		game.numKits++;

	}
	else if(collided === 1) {
		console.log("Moped Collision");
		gameOver();
	}
	else if(collided !== -1) {
		console.log("boat collision");
		
		character.onBoat = true;//DELETE
		character.speed = Math.abs(collided);
		if(fellOffEdge == true) {
			gameOver();
		}
		if(collided < 0) {
			character.leftOnBoat();
		}
		else if(collided > 0){
			character.rightOnBoat();
		}
		
		
	}
	else {
		character.onBoat = false;
		var drowned = waterCollision();
		if(drowned == true) {
			console.log("drowned");
			gameOver();
		}	
	}
	
}

function collides(x1, y1, w1, h1, x2, y2, w2, h2) {   //Some beautiful collision detection, box-style, copied from elsewhere
    y1 +=20;
    h1 -=40;
    h2 -=20;
    var isCollision = (((x1 <= x2+w2 && x1 >=x2) && (y1 <= y2+h2 && y1 >= y2)) ||
            ((x1+w1 <= x2+w2 && x1+w1 >= x2) && (y1 <= y2+h2 && y1 >= y2)) ||
            ((x1 <= x2+w2 && x1 >=x2) && (y1+h1 <= y2+h2 && y1+h1 >= y2)) ||
            ((x1+w1 <= x2+w2 && x1+w1 >= x2) && (y1+h1 <= y2+h2 && y1+h1 >= y2)));
    return isCollision;
}

function movableCollision() { //return -1 for no collision, 0 for medicine bag collision, 1 for moped collision, and the boat's speed for boat collision
    for (var i=0; i<movables.length; i++) {
        if (collides(character.xCoordAct, character.yCoord, character.width, TILE_WIDTH, movables[i].xCoord, movables[i].yCoord, TILE_WIDTH-1, TILE_WIDTH-1)) {//shrank tiles a bit to fix error
        	var type = movables[i].type;
        	if (type === 0) {
        		movables.splice(i, 1);
        		i--;
        	}
        	else if (type === 2) {
        		type = movables[i].speed;
        	}
        	return type;
        }
    }
    
    return -1;
}
function waterCollision() { //returns true or false
    for (var i=0; i<tileRows.length; i++) {
        if (tileRows[i].type === 2 && collides(character.xCoordAct, character.yCoord, character.width, TILE_WIDTH, 0, 
        	tileRows[i].row * TILE_WIDTH, TILE_WIDTH * GRID_WIDTH-2, TILE_WIDTH-2)) {  //Could write another collision function for this
        	return true;
        }
    }
    
    return false;
}
function obstacleCollision(potX, potY) { //returns -1 for no collision, 0 for potential collision with obstacle, and 1 for collision with boundary
    for (var i=0; i<obstacles.length; i++) {
        if (collides(potX, potY, character.width, TILE_WIDTH, obstacles[i].xCoordAct, obstacles[i].y * TILE_WIDTH, obstacles[i].width, TILE_WIDTH-2)) 
        	
        	return obstacles[i].xCoordAct;//RETURNS THE COORDINATE OF THE OBSTACLE CHARACTER IS HEADED FOR
    }
    if(potX < 0 || potX + character.width > TILE_WIDTH * GRID_WIDTH) {   	
        return 1;
    }
    return -1;
}


function isOutOfBounds() {
	if(character.xCoordAct < 0 || character.xCoordAct + character.width > TILE_WIDTH * GRID_WIDTH) 
        return true;
    return false;
}

function drawScores() {
    var image = queue.getResult("testImages/back.jpg")  
	scoreContext.drawImage(image,0,0);
    scoreContext.font = "bold 16pt arial";
    scoreContext.fillStyle = "#FF33CC";
    scoreContext.fillText("Score: ", 5, 30); 
    scoreContext.fillText(game.score, 90, 30);

    scoreContext.fillText(game.numKits, 140, 60);  
    if(game.numKits == 1)
    	scoreContext.fillText("Medical Kit:", 5, 60);
    else
    	scoreContext.fillText("Medical Kits:", 5, 60);
}

function printKey(e){

	if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
            e.preventDefault();
    	}
        if (game.inProgress == true) {
            if (e.keyCode == 38 && obstacleCollision(character.xCoordAct,character.yCoord - TILE_WIDTH) === -1){ //-1 is no collision, 
            	//0 is obstacle collision, 1 is boundary collision
                character.up();

            } 
            else if (e.keyCode == 40 && obstacleCollision(character.xCoordAct,character.yCoord + TILE_WIDTH) === -1){
                character.switchImage('F');
                if (character.y < GRID_HEIGHT - 1) {
                	character.down();
                }
            } 
            else if (e.keyCode == 37){
            	character.switchImage('L');
            	var potCollision = obstacleCollision(character.xCoordAct - TILE_WIDTH,character.yCoord);
                if(character.onBoat == true) 
                	character.leftOnBoat();
                else if (potCollision === 1) {//Snap to edge
          console.log("snap to edge");      	
					character.xCoord = 0;
					character.xCoordAct = 14;
				}
				else if(potCollision === -1)//no collision
                	character.left();

				else {//if (potCollision === 0 ) {//Snap to edge of obstac;e
			console.log("snap to edge obstacle on left");  		
					character.xCoord = potCollision +TILE_WIDTH;
					character.xCoordAct = character.xCoord + 14;
				}
                


            } 
            else if (e.keyCode == 39){
            	character.switchImage('R');
            	var potCollision = obstacleCollision(character.xCoordAct + TILE_WIDTH,character.yCoord);
                if(character.onBoat == true) 
                	character.rightOnBoat();
                else if (potCollision === 1) {//Snap to edge
          console.log("snap to edge");
					character.xCoord = GRID_WIDTH*TILE_WIDTH - TILE_WIDTH;
					character.xCoordAct = character.xCoord + 14;
				}
				else if(potCollision === -1)//no potential collision
                	character.right();
				
				else {//Snap to edge of boundary
		console.log("snap to edge obstacle right potentialCollision = " + potCollision);  			
					character.xCoord = potCollision -TILE_WIDTH;
					character.xCoordAct = character.xCoord + 14;
				}
                
            } 
            character.draw();
        }
        console.log("xCoord is " + character.xCoord + " xCoordAct is " + character.xCoordAct);
	
}	

function gameOver() {
	createjs.Ticker.off("tick", handleTick);
	
	game.inProgress = false;
	game.sleep(2000);//Wait 2 seconds until gameOver page is shown
	game.reset();
	game.inProgress = true;

}










