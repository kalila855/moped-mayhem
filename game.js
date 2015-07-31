
var GRID_WIDTH = 10;
var GRID_HEIGHT = 11;
var TILE_WIDTH = 50; //Tiles are 50x50 pixels



//Constructor for Entitiy Class
function Entity (w,h,m,xPos,yPos,img) {
	this.width = w;
	this.height = h;
	this.canMoveOnto = m;
	this.x = xPos;
	this.y = yPos;
	this.imageSource = img;
}

function Character (xPos, yPos, img){
	this.x = xPos;
	this.y = yPos;
	this.img = img;
	this.points = 0;
}

//Constructor for Tile Class
function Tile (w,h,m,xPos,yPos,img) {
	Entity.call(this,w,h,m,xPos,yPos,img);
	this.occupyingObject = null;
} 

Tile.prototype.shiftDown = function() {
	this.y += 1;
};

//Constructor for Movable Class
function Movable (w,h,m,xPos,yPos,img,xDir) {
	Entity.call(this,w,h,m,xPos,yPos,img);
	this.xMove = xDir;
} 

Movable.prototype.move = function() {
	this.x += this.xMove;
};

//Road Tile constructor
function Road (x,y) {
	Tile.call(this,1,1,true,x,y,"testImages/road.jpg");
}

//River constructor
function River (x,y) {
	Tile.call(this,1,1,false,x,y,"testImages/water.png");
}

//Ground Tile constructor
function Ground (x,y) {
	Tile.call(this,1,1,true,x,y,"testImages/temp-tile.png");
}

//Moped constructor
function Moped (x,y,dir) {
	Movable.call(this,1,1,false,x,y,"",dir);
}

//Boat constructor
function Boat (x,y,dir) {
	Movable.call(this,1,1,true,x,y,"",dir);	
}

//Medical Kit constructor
function MedicalKit(x,y) {
	Movable.call(this,1,1,true,x,y,"",0);
}

//Building constructor
function Building(x,y) {
	Movable.call(this,1,1,false,x,y,"",0);
}

function Tree(x,y) {
	Movable.call(this,1,1,false,x,y,"",0);
}

// constructor for tileRow
function tileRow (y,rowType) {
	this.tiles = [];
	this.objects = [];
	this.y = y;
	if (rowType === 0) {
		for (var i = 0; i < GRID_WIDTH; i++) {
			this.tiles[i] = new Ground(i,y);
		}
		var numOfObjects =  Math.round(Math.random()*2) + 3;
		var curX = 0;
		for (var i = 0; i < numOfObjects; i++) {
			var objType = Math.round(Math.random()*3);
			var object;
			if (objType === 0) {
				object = new MedicalKit(curX,y);
			}
			else if (objType === 1) {
				object = new Building(curX,y);
			}
			else  {
				object = new Tree(curX,y);
			}
			this.objects.push(object);
			this.tiles[curX].occupyingObject = object;
			curX += Math.round(Math.random()*3) + 1;
			if (curX >= GRID_WIDTH) {
				break;
			}
		}
		console.log("creating Ground");
	}
	else if (rowType === 1) {
		var dir = Math.round(Math.random(2));
		if (dir === 0) {
			dir -= 1;
		}
		for (var i = 0; i < GRID_WIDTH; i++) {
			this.tiles[i] = new Road(i,y);
		}
		var numOfMopeds = Math.round(Math.random()*2) + 3;
		var curX = 0;
		for (var i = 0; i < numOfMopeds; i++) {
			var moped = new Moped(curX,y,dir);
			this.objects.push(moped);
			this.tiles[curX].occupyingObject = moped;
			curX += Math.round(Math.random()*3) + 2;
			if (curX >= GRID_WIDTH - 1) {
				break;
			}
		}	
		console.log("creating road");
	}
	else {
		var dir = Math.round(Math.random()*2);
		if (dir === 0) {
			dir -= 1;
		}
		for (var i = 0; i < GRID_WIDTH; i++) {
			this.tiles[i] = new River(i,y);
		}
		var numOfBoats = Math.round(Math.random()*2) + 3;
		var curX = 0;
		for (var i = 0; i < numOfBoats; i++) {
			var boat = new Boat(curX,y,dir);
			this.objects.push(boat);
			this.tiles[curX].occupyingObject = boat;
			curX += Math.round(Math.random()*3) + 2;
			if (curX >= GRID_WIDTH - 1) {
				break;
			}
		}	
		console.log("creating river");
	}
}

//increases the y of a tileRow by one
tileRow.prototype.shiftDown = function() {
	this.y++;	
};

//constructor for the grid
function Grid () {
	this.rows = [];
	for (var i = 0; i < GRID_HEIGHT - 1; i++) {
		var rowType = Math.round(Math.random()*4);
		if (rowType > 1) {
			rowType -= 1;
		}
		this.rows.push(new tileRow(i,rowType));
	}
	this.rows.push(new tileRow(GRID_HEIGHT - 1, 0));
}

//shifts the grid down by one
Grid.prototype.shiftDown = function() {
	this.rows.pop();
	for (var i = 0; i < this.rows.length; i++) {
		var curRow = this.rows[i];
		curRow.shiftDown();
		for (var j = 0; j < this.rows[i].tiles.length; j++) {
			curRow.tiles[j].y++;
		}
	}
	var rowType = Math.round(Math.random()*4);
	if (rowType > 1) {
		rowType -= 1;
	}
	this.rows.unshift(new tileRow(0,rowType));
};
// creates the grid
var grid = new Grid();







function tileAvailable (x,y) {
	var tile = grid.rows[y].tiles[x];
	if (tile.canMoveOnto == false && tile.occupyingObject == false) {
		console.log("the tile can't be moved onto and there is nothing occupying it");
		return false;
	}
	else if (tile.occupyingObject == false && tile.canMoveOnto == true) {
		console.log("the tile can be moved onto and there isn't something occupying it");
		return true;
	}
	else if (tile.occupyingObject) {
		if (tile.occupyingObject instanceOf MedicalKit) {
			console.log("you collected a MedicalKit");
			var medicalIndex = grid.rows[y].objects.indexOf(tile.occupyingObject);
			grid.rows[y].objects.splice(medicalIndex,1);
			character.points++;
			return true;
		}
		else if (tile.occupyingObject.canMoveOnto == true) {
			console.log("the tile has an object occupying it that can be moved onto");
			return true;
		}	
		else {
			console.log("the tile has an object occupying it that can't be moved onto");
			return false;
		}
	}
	else if (tile.canMoveOnto) {
		console.log("the tile can be moved onto");
		return true;
	}
	else {
		console.log("default false");
		return false;
	}
}
var stage;
runGame();

function runGame() {
	$(document).ready(function(){
		console.log("ready");
		stage = new createjs.Stage("demoCanvas");
		drawTiles();
   

	});
}

function drawTiles() {
	console.log("draw tiles");
	for(var row = 0; row < grid.rows.length; row++) {
		var tileRow = grid.rows[row];
		var arrayOfTiles = tileRow.tiles;
		
		for(var col = 0; col < arrayOfTiles.length; col++) {
			var tile = arrayOfTiles[col];
			//console.log("tiles");
			
			var image = new Image();
    		image.src = tile.imageSource;
    	//	image.src = "testImages/road.jpg";

    		//console.log(tile.x + " : " + tile.y);
    		
	    		var bitmap = new createjs.Bitmap(image);
	       		console.log("image loaded");
	         	
	         	stage.addChild(bitmap);
	         	bitmap.x = tile.x * TILE_WIDTH;
	         	bitmap.y = tile.y * TILE_WIDTH;  

	         	console.log(bitmap.x + " : " + bitmap.y);  
	         	
	         $(image).load(function(){
				stage.update();
         	 });	
   			

    		
		}
	}

}




//grid.shiftDown();
console.log(grid);


var gameOver = false;


function init() {
    
}

var character = new Character(5,10,"");



function printKey(e){
	console.log(e.keyCode);

	if (gameOver == false) {

	if(e.keyCode === 37){
		console.log("left");
		if (character.x > 0 && tileAvailable(character.x-1,character.y)) {
	  		character.x-=1;
		}
		else {
			console.log("game over");
			gameOver = true;
		}

	}

	if(e.keyCode === 38){
	  console.log("up");
	  if (tileAvailable(character.x,character.y-1)) {
	  	grid.shiftDown();			
	  }
	  else {
	  	console.log("game over");
	  	gameOver = true;
	  }
	  
	}

	if(e.keyCode === 39){
		console.log("right");
		if (character.x < GRID_WIDTH - 1 && tileAvailable(character.x+1,character.y)) {
	  		character.x+=1;
		}
		else {
			console.log("game over");
			gameOver = true;
		}
	}

	// if(e.keyCode === 40){
	//   console.log("down");
	//   character.y+=1;
	// }
	}
	drawTiles();
}	



