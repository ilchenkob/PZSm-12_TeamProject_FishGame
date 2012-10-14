var canvas, ctx;
var touched;
var oldMouseY;
var oldHeroY;
var iSprPos;
var Hero;
var ArrEnemie;
var hoveredCircle;

//======================== constants ===========================
var c_min_speed = 2;
var c_max_speed = 7;
//==============================================================

// -------------------------------------------------------------
function Hero(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
}
function Enemie(x, y, size, speed){
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
}
// -------------------------------------------------------------

// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// функции отрисовки :

function clear() { // функция очищает canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawHero(ctx, x, y, radius) {
    var imgObj = new Image();
    imgObj.src = 'imgs/hero.png';
    imgObj.onload = function() {
        if( touched )
            ctx.drawImage(imgObj, 128 * iSprPos, 0, 128, 128, x, y - this.height/2, 128, 128);
        else
            ctx.drawImage(imgObj, 0, 0, 128, 128, x, y - this.height/2, 128, 128);
    };
}

function drawEnemies(ctx) {
    var img = new Image();
    img.src = 'imgs/enemie.png';
    img.onload = function() {
        for( var i = 0; i < 5; i++)
            ctx.drawImage(img, 128 * iSprPos, 0, 128, 128, ArrEnemie[i].x, ArrEnemie[i].y - this.height/2, 128, 128);
    };
}

function drawScene() { // главная функция отрисовки
    clear(); // очистить canvas

    iSprPos++;
    if (iSprPos >= 4) {
        iSprPos = 0;
    }

    if( touched )
    {
        Hero.y -= 6;
        if( Hero.y < 50 ) Hero.y = 50;
    }
    else
    {
        Hero.y += 4;
        if( Hero.y > 420 ) Hero.y = 420;
    }

    for( var i = 0; i < 5; i++)
    {
        ArrEnemie[i].x -= ArrEnemie[i].speed;
        if( ArrEnemie[i].x < -120 )
        {
            ArrEnemie[i].x = 800 + getRandomInt(0,400);
            ArrEnemie[i].y = getRandomInt(60,420);
            ArrEnemie[i].speed = getRandomInt(c_min_speed,c_max_speed);
        }
    }

    drawEnemies(ctx);
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

    ArrEnemie = [];
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(60,420), 15, getRandomInt(c_min_speed,c_max_speed)));
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(60,420), 15, getRandomInt(c_min_speed,c_max_speed)));
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(60,420), 15, getRandomInt(c_min_speed,c_max_speed)));
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(60,420), 15, getRandomInt(c_min_speed,c_max_speed)));
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(60,420), 15, getRandomInt(c_min_speed,c_max_speed)));

    $('#scene').mousedown(function(e) {
        var canvasOffset = $(canvas).offset();
        var mouseX = Math.floor(e.pageX - canvasOffset.left);
        oldMouseY = Math.floor(e.pageY - canvasOffset.top);
        if( mouseX < 250 ){
            touched = true;
        }
    });
/*
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
*/
    $('#scene').mouseup(function(e)
    {
        oldMouseY = 0;
        touched = false;
    });

    setInterval(drawScene, 41); // скорость отрисовки
});
