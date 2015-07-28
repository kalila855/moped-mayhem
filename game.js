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
function Tile (w,h,m,xPos,yPos,img,dir) {
	Entity.call(this,w,h,m,xPos,yPos,img);
	this.direction = dir;
} 

//Constructor for Movable Class
function Movable (w,h,m,xPos,yPos,img,xDir) {
	Entity.call(this,w,h,m,xPos,yPos,img);
	this.xMove = xDir;
} 

//Road Tile constructor
function Road (x,y,dir) {
	Tile.call(this,1,1,true,x,y,"",dir);
	var mopeds = [];
}

//Ground Tile constructor
function Ground (x,y) {
	Tile.call(this,1,1,true,x,y,"",0);
}

//Moped constructor
function Moped (x,y,dir) {
	Movable.call(this,1,1,false,x,y,"",dir);
}

var myEntity = new Moped(1,1,-3)
console.log(myEntity.height);