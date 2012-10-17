var canvas, ctx;
var score_txt;
var touched;
var oldMouseY;
var oldHeroY;
var iSprPos;
var Hero;
var ArrEnemie;

var scores;
var game_over;

var size_arr = [0, 128, 154, 179, 205, 230];

var img1, img2, img3, img4, img5;

//======================== constants ===========================
var c_min_speed = 2;
var c_max_speed = 7;
var c_min_size = 1;
var c_max_size = 5;
//==============================================================

// -------------------------------------------------------------
function Hero(x, y, size, speed, lifes){
    this.x = x;
    this.y = y;
    this.size = size;
	this.speed = speed;
    this.life_count = lifes;
}
function Enemie(x, y, size, speed, active){
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.isActive = active;
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
            ctx.drawImage(imgObj, size_arr[Hero.size] * iSprPos, 0, size_arr[Hero.size], size_arr[Hero.size], x, y, size_arr[Hero.size], size_arr[Hero.size]);
        else
            ctx.drawImage(imgObj, 0, 0, size_arr[Hero.size], size_arr[Hero.size], x, y, size_arr[Hero.size], size_arr[Hero.size]);
    };

    //var point = new Image();
    //point.src="imgs/results.png"
    //ctx.drawImage(point, x, y);
}

function DrawEnemieFish( imageObj, num )
{
    ctx.drawImage(imageObj,
                  size_arr[ArrEnemie[num].size] * iSprPos,
                  0,
                  size_arr[ArrEnemie[num].size],
                  size_arr[ArrEnemie[num].size],
                  ArrEnemie[num].x,
                  ArrEnemie[num].y,
                  size_arr[ArrEnemie[num].size],
                  size_arr[ArrEnemie[num].size]
    );
}

function drawEnemies(ctx) {
    for( var i = 0; i < 5; i++)
    {
            switch (ArrEnemie[i].size)
            {
                case 1: DrawEnemieFish( img1, i );
                    break;
                case 2: DrawEnemieFish( img2, i );
                    break;
                case 3: DrawEnemieFish( img3, i );
                    break;
                case 4: DrawEnemieFish( img4, i );
                    break;
                case 5: DrawEnemieFish( img5, i );
                    break;
            }
    }
}

function FindCollisions()
{
    for(var i = 0; i < 5; i++)
    {
        if( ArrEnemie[i].x < 450 && ArrEnemie[i].isActive == true )
        {
            if( Hero.x + size_arr[Hero.size] >= ArrEnemie[i].x
                && Hero.x < ArrEnemie[i].x + size_arr[ArrEnemie[i].size] )
            {
                if( (Hero.y >= ArrEnemie[i].y && Hero.y <= ArrEnemie[i].y + size_arr[ArrEnemie[i].size])
                    ||
                    (Hero.y + size_arr[Hero.size] >= ArrEnemie[i].y && Hero.y + size_arr[Hero.size] <= ArrEnemie[i].y + size_arr[ArrEnemie[i].size])
                    )
                {
                    return i;
                }
            }
        }
    }
    return -1;
}

function drawScene() { // главная функция отрисовки

    if( !game_over )
    {
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
            if( Hero.y > 320 ) Hero.y = 320;
        }

        for( var i = 0; i < 5; i++)
        {
            ArrEnemie[i].x -= (ArrEnemie[i].speed + Hero.speed);
            if( ArrEnemie[i].x < -230 )
            {
                ArrEnemie[i].size = getRandomInt(c_min_size, c_max_size);
                ArrEnemie[i].x = 800 + getRandomInt(0,400);
                ArrEnemie[i].y = getRandomInt(0, 416);
                ArrEnemie[i].isActive = true;
                if (ArrEnemie[i].y > (480 - (128 * (1+((ArrEnemie[i].size * 0.2) - 0.2)))))
                {
                    ArrEnemie[i].y -= 128 * (1+((ArrEnemie[i].size * 0.2) - 0.2));
                }
            }
        }

        var ind = FindCollisions();
        if( ind >= 0 )
        {
            ArrEnemie[ind].isActive = false;

            if( ArrEnemie[ind].size > Hero.size +2 )
            {
                Hero.life_count--;
                if( Hero.life_count == 0 )
                {
                    //Game Over
                    game_over = true;
                    document.getElementById('game_over').style.visibility='visible';
                }
            }
            else
            {
                scores += 50*ind;
                ArrEnemie[ind].x = -400;
            }
        }

        drawEnemies(ctx);
        drawHero(ctx, Hero.x, Hero.y, Hero.size);

        scores += Hero.speed/2;

        score_txt.innerText= "Score: " + Math.floor(scores);
        document.getElementById("lifes").innerText = Hero.life_count;
    } //if( !game_over )
}

// -------------------------------------------------------------

// инициализация
$(function(){
    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');
	
	score_txt = document.getElementById('scores');

    var width = canvas.width;
    var height = canvas.height;


    game_over = false;
    document.getElementById('game_over').style.visibility='hidden';
	scores = 0;
    iSprPos = 0;
    Hero = new Hero(160, //X
                    300, //Y
                    1,  //size
                    1,   //speed
                    3);  //lifes

    ArrEnemie = [];
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_size, c_max_size), getRandomInt(c_min_speed,c_max_speed), true));
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_size, c_max_size), getRandomInt(c_min_speed,c_max_speed), true));
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_size, c_max_size), getRandomInt(c_min_speed,c_max_speed), true));
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_size, c_max_size), getRandomInt(c_min_speed,c_max_speed), true));
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_size, c_max_size), getRandomInt(c_min_speed,c_max_speed), true));

    img1 = new Image();
    img2 = new Image();
    img3 = new Image();
    img4 = new Image();
    img5 = new Image();

    img1.src = 'imgs/enemie.png';
    img2.src = 'imgs/enemie2.png';
    img3.src = 'imgs/enemie3.png';
    img4.src = 'imgs/enemie4.png';
    img5.src = 'imgs/enemie5.png';

    $('#scene').mousedown(function(e) {
        var canvasOffset = $(canvas).offset();
        var mouseX = Math.floor(e.pageX - canvasOffset.left);
        oldMouseY = Math.floor(e.pageY - canvasOffset.top);

        touched = true;

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
