
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
	var mopeds = [];
}

//Ground Tile constructor
function Ground (x,y) {
	Tile.call(this,1,1,true,x,y,"");
}

//Moped constructor
function Moped (x,y,dir) {
	Movable.call(this,1,1,false,x,y,"",dir);
}

function tileRow (y) {
	var tiles = [];
	var objects = [];
	var rowType = Math.round(Math.random * 3);
	if (rowType === 0) {
		for (var i = 0; i < GRID_WIDTH; i++) {
			tiles[i] = new Ground(i,y);
		}
	}
	else {
		var dir = Math.round(Math.random(2));
			if (dir === 0) {
				dir -= 1;
		}
		for (var i = 0; i < GRID_WIDTH; i++) {
			tiles[i] = new Road(i,y);
		}
		var numOfMopeds = Math.round(Math.random(2)) + 3;
		var curX = 0;
		for (int i = 0; i < numOfMopeds; i++) {
			objects.push(new Moped(curX,y,dir));
			curX += Math.round(Math.random(2)) + 1;
		}	
	}
}
var myEntity = new Moped(1,1,-3)
console.log(myEntity.height);