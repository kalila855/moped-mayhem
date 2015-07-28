
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
			curX += Math.round(Math.random()*3) + 1;
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
			curX += Math.round(Math.random()*3) + 2;
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

// creates the grid
var grid = new Grid();
console.log(grid);

function init() {
    // code here.
   		var stage = new createjs.Stage("demoCanvas");
        var circle = new createjs.Shape();
        circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
        circle.x = 200;
        circle.y = 100;
        stage.addChild(circle);
        stage.update();
  }
