var canvas, ctx;
var touched;
var oldMouseY;
var oldHeroY;
var iSprPos;
var Hero;
var hoveredCircle;

// -------------------------------------------------------------
function Hero(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
}
// -------------------------------------------------------------

// функции отрисовки :

function clear() { // функция очищает canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawHero(ctx, x, y, radius) {
    var imgObj = new Image();
    imgObj.src = 'imgs/hero.png';
    imgObj.onload = function() {
        ctx.drawImage(imgObj, 128 * iSprPos, 0, 128, 128, x, y - this.height/2, 128, 128);
    };
}

function drawScene() { // главная функция отрисовки
    clear(); // очистить canvas

    iSprPos++;
    if (iSprPos >= 4) {
        iSprPos = 0;
    }

    drawHero(ctx, Hero.x, Hero.y, Hero.size);
}

// -------------------------------------------------------------

// инициализация
$(function(){
    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    iSprPos = 0;
    Hero = new Hero(160, 300, 15);

    $('#scene').mousedown(function(e) {
        var canvasOffset = $(canvas).offset();
        var mouseX = Math.floor(e.pageX - canvasOffset.left);
        oldMouseY = Math.floor(e.pageY - canvasOffset.top);
        if( mouseX < 180 ){
            touched = true;
        }
    });

    $('#scene').mousemove(function(e) {
        if ( touched ) {
            var canvasOffset = $(canvas).offset();
            var mouseY = Math.floor(e.pageY - canvasOffset.top);
            if( mouseY > 20 && mouseY < 460 ){
                oldHeroY = Hero.y;
                if( oldHeroY + ( mouseY - oldMouseY ) > 50 && oldHeroY + ( mouseY - oldMouseY ) < 410 ){
                    Hero.y = oldHeroY + ( mouseY - oldMouseY );
                    oldMouseY = mouseY;
                }
            }
            else
            {
                touched = false;
            }
        }
    });

    $('#scene').mouseup(function(e)
    {
        oldMouseY = 0;
        touched = false;
    });

    setInterval(drawScene, 30); // скорость отрисовки
});
