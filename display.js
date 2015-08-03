


var img;
     
$(function() {
    img = new Image();
    img.src = "testImages/dirt-road.jpg";
         
    $(img).load(function(){
    drawBitmap();
    });
});

function drawBitmap()
    {
        var stage = new createjs.Stage("demoCanvas");
         
        var bitmap = new createjs.Bitmap(img);
        stage.addChild(bitmap);
 
        bitmap.x = 190;
        bitmap.y = 110;
         
        stage.update();

    }

  //THIS CODE GENERATES EVERYTHING
    if (rowType === 0) {
        for (var i = 0; i < GRID_WIDTH; i++) {
            this.tiles[i] = new Ground(i,y);
        }
        var numOfObjects =  Math.round(Math.random()*2) + 3;
        var curX = Math.round(Math.random()*3);
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
            curX += Math.round(Math.random()*3) + 2;
            if (curX >= GRID_WIDTH) {
                break;
            }
        }
        //makes ground
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
        var curX = Math.round(Math.random()*3);
        for (var i = 0; i < numOfMopeds; i++) {
            var moped = new Moped(curX,y,dir);
            this.objects.push(moped);
            this.tiles[curX].occupyingObject = moped;
            curX += Math.round(Math.random()*3) + 2;
            if (curX >= GRID_WIDTH - 1) {
                break;
            }
        }   
        //creates road^^
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
        var curX = Math.round(Math.random()*3);
        for (var i = 0; i < numOfBoats; i++) {
            var boat = new Boat(curX,y,dir);
            this.objects.push(boat);
            this.tiles[curX].occupyingObject = boat;
            curX += Math.round(Math.random()*3) + 2;
            if (curX >= GRID_WIDTH - 1) {
                break;
            }
        }   
        //create river
    }

$(document).ready(function() {
    $(document).scroll(function(){
        if($(this).scrollTop() > 700)
        {   
            $('#info').css({"position":"relative"});
        }
        else {
            $('#info').css({"position":"absolute"});
        }
    });
}    

