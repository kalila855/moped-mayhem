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
	Entity.call(this,w,h,m,xPos,yPos,img)
	this.direction = dir;
} 

//Constructor for Movable Class
function Movable (w,h,m,xPos,yPos,img,xDir) {
	Entity.call(this,w,h,m,xPos,yPos,img)
	this.xMove = xDir;
} 

var myEntity = new Tile(1,1,false,10,10,"image.png",-1);
console.log(myEntity.height);