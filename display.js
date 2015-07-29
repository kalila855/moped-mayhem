


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