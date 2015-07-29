
var GRID_WIDTH = 10;
var GRID_HEIGHT = 11;



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

//Road Tile constructor
function Road (x,y) {
	Tile.call(this,1,1,true,x,y,"");
}

//River constructor
function River (x,y) {
	Tile.call(this,1,1,false,x,y,"");
}

//Ground Tile constructor
function Ground (x,y) {
	Tile.call(this,1,1,true,x,y,"");
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
function tileRow (y) {
	this.tiles = [];
	this.objects = [];
	this.y = y;
	var rowType = Math.round(Math.random()*5);
	console.log(rowType);
	if (rowType === 0) {
		for (var i = 0; i < GRID_WIDTH; i++) {
			this.tiles[i] = new Ground(i,y);
		}
		var numOfObjects =  Math.round(Math.random()*2) + 3;
		var curX = 0;
		console.log(numOfObjects);
		for (var i = 0; i < numOfObjects; i++) {
			var objType = Math.round(Math.random()*3);
			console.log(objType);
			var object;
			if (objType === 0) {
				object = new MedicalKit(curX,y);
				console.log("Adding Medical Kit");
			}
			else if (objType === 1) {
				object = new Building(curX,y);
				console.log("adding Building");
			}
			else  {
				object = new Tree(curX,y);
				console.log("adding tree");
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
	else if (rowType < 3) {
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
			console.log("CURRENT X");
			console.log(curX);
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
	for (var i = 0; i < GRID_HEIGHT; i++) {
		this.rows.push(new tileRow(i));
	}
}

//shifts the grid down by one
Grid.prototype.shiftDown = function() {
	this.rows.pop();
	for (var i = 0; i < this.rows.length; i++) {
		var curRow = this.rows[i];
		curRow.shiftDown();
		console.log(curRow);
		for (var j = 0; j < this.rows[i].tiles.length; j++) {
			curRow.tiles[j].y++;
			console.log(curRow.tiles[j]);
		}
	}
	this.rows.unshift(new tileRow(0));
};
// creates the grid
var grid = new Grid();
console.log(grid);

function tileAvailable (x,y) {
	var tile = grid.rows[y].tiles[x];
	console.log(tile);
	if (tile.canMoveOnto == false && tile.occupyingObject == false) {
		console.log("the tile can't be moved onto and there is nothing occupying it");
		return false;
	}
	else if (tile.occupyingObject == false && tile.canMoveOnto == true) {
		console.log("the tile can be moved onto and there isn't something occupying it");
		return true;
	}
	else if (tile.occupyingObject) {
		if (tile.occupyingObject.canMoveOnto == true) {
			console.log("the tile has an object occupying it that can be moved onto");
			return true;
		}	
		else {
			console.log("the tile has an object occupying it that can't be moved onto");
			return false;
		}
	}
	else {
		console.log("default false");
		return false;
	}
}

function draw() {


}




grid.shiftDown();
console.log(grid);


function init() {
    
}

	
	


var character = new Character(5,10,"");


function printKey(e){
	console.log(e.keyCode);



	if(e.keyCode === 37){
	  console.log("left");
	  character.x-=1;

	}

	if(e.keyCode === 38){
	  console.log("up");
	  character.y-=1;
	}

	if(e.keyCode === 39){
	  console.log("right");
	  character.x+=1;
	}

	// if(e.keyCode === 40){
	//   console.log("down");
	//   character.y+=1;
	// }

}	



