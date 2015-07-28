
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

//Constructor for Tile Class
function Tile (w,h,m,xPos,yPos,img) {
	Entity.call(this,w,h,m,xPos,yPos,img);
} 

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
	Tile.call(this,1,1,true,x,y,"");
}

//Ground Tile constructor
function Ground (x,y) {
	Tile.call(this,1,1,true,x,y,"");
}

//Moped constructor
function Moped (x,y,dir) {
	Movable.call(this,1,1,false,x,y,"",dir);
}

function Boat (x,y,dir) {
	Movable.call(this,1,1,false,x,y,"",dir);	
}

// constructor for tileRow
function tileRow (y) {
	this.tiles = [];
	this.objects = [];
	var rowType = Math.round(Math.random()*5);
	console.log(rowType);
	if (rowType === 0) {
		for (var i = 0; i < GRID_WIDTH; i++) {
			this.tiles[i] = new Ground(i,y);
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
			this.objects.push(new Moped(curX,y,dir));
			curX += Math.round(Math.random(3)) + 2;
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
			this.objects.push(new Boat(curX,y,dir));
			curX += Math.round(Math.random()*3) + 2;
		}	
		console.log("creating river");
	}
}

//constructor for the grid
function Grid () {
	this.rows = [];
	for (var i = 0; i < GRID_HEIGHT; i++) {
		this.rows.push(new tileRow(i));
	}
}

var grid = new Grid();
console.log(grid);