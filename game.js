var canvas, ctx;
var score_txt;
var touched;
var oldMouseY;
var iSprPos;
var ArrEnemie;
var ptrHero;
var anch;

var scores;
var game_over;
var paused;
var size_arr = [0, 64, 77, 90, 104, 115];

var img1, img2, img3, img4, img5, imgPlankton;
var imgHero1, imgHero2, imgHero3, imgHero4, imgHero5;
var imgAnchor;

//=======================background imgs========================
var back_1, back_2;
var backImg_1;
function FarBack(x)
{
    this.x = x;
}

var back_3, back_4;
var backImg_2;
function NearBack(x)
{
    this.x = x;
}
//==============================================================

//======================== constants ===========================
var c_min_speed  = 4;
var c_max_speed  = 8;
var c_min_size   = 1;
var c_max_size   = 5;
var c_hero_accel = 0.03;

var c_far_back_speed = 1.8;
var c_near_back_speed = 3;

//количество игровых очков для роста героя
var c_give_level_2 = 90;
var c_give_level_3 = 150;
var c_give_level_4 = 250;
var c_give_level_5 = 400;
//==============================================================

// -------------------------------------------------------------
function Hero(x, y, size, speed, acc, lifes){
    this.x = x;
    this.y = y;
    this.size = size;
	this.speed = speed;
    this.life_count = lifes;
    this.accel = acc;
}
function Enemie(x, y, size, speed, active){
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.isActive = active;
}
function Plankton(x, y, speed, active){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.isActive = active;
}
function Anchor(x, y, speed, start, active){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.start = start;
    this.active = active;
}
// -------------------------------------------------------------

// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// функции отрисовки
function clear() { // функция очищает canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function DrawHeroFish( imgObj, x, y ) //рисует текстуру героя на нужном месте
{
    if( touched )
        ctx.drawImage(imgObj, size_arr[ptrHero.size] * iSprPos, 0, size_arr[ptrHero.size], size_arr[ptrHero.size], x, y, size_arr[ptrHero.size], size_arr[ptrHero.size]);
    else
        ctx.drawImage(imgObj, 0, 0, size_arr[ptrHero.size], size_arr[ptrHero.size], x, y, size_arr[ptrHero.size], size_arr[ptrHero.size]);
}

function drawHero( x, y )   //определяет нужную текстуру для героя и вызывает ее рисование
{
    switch (ptrHero.size)
    {
        case 1:
            DrawHeroFish( imgHero1, x ,y );
            return;
            brake;
        case 2:
            DrawHeroFish( imgHero2, x ,y );
            return;
            brake;
        case 3:
            DrawHeroFish( imgHero3, x ,y );
            return;
            brake;
        case 4:
            DrawHeroFish( imgHero4, x ,y );
            return;
            brake;
        case 5:
            DrawHeroFish( imgHero5, x ,y );
            return;
            brake;
    }
}

function DrawEnemieFish( imageObj, num )  //рисует текстуру врага на канвасе
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

function DrawPlanktonFish( imageObj, num )  //рисует текстуру самого мелкого врага на канвасе
{
    //ctx.drawImage(imageObj, 50 * iSprPos, 0, 50, 50, ArrPlankton[num].x, ArrPlankton[num].y, 50, 50);
    ctx.drawImage(imageObj, 0, 0, 76, 100, Anchor.x, Anchor.y, 76, 100);
}

function DrawAnchor( imageObj )  //рисует текстуру якоря
{
    ctx.drawImage(imageObj,anch.x, anch.y);
}

function drawEnemies(ctx) {     //разбирает где какого врага необходимо будет отобразить на канвасе
    for( var i = 0; i < 5; i++)
    {
            switch (ArrEnemie[i].size) //взависимости от размера используем разные текстуры при рисовании
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

    for( var i = 0; i < 6; i++)
    {
        DrawPlanktonFish( imgPlankton, i);
    }

        DrawAnchor(imgAnchor);

}

function FindCollisions()  //поиск пересечений между текстурами Героя и остальных рыб
{
    for(var i = 0; i < 5; i++)
    {
        if( ArrEnemie[i].x < 450 && ArrEnemie[i].isActive == true )
        {
            if( ptrHero.x + size_arr[ptrHero.size]*0.9 >= ArrEnemie[i].x + 0.2*size_arr[ArrEnemie[i].size] && ptrHero.x < ArrEnemie[i].x + size_arr[ArrEnemie[i].size] )
            {
                if( (ptrHero.y + 0.125*size_arr[ptrHero.size] >= ArrEnemie[i].y + 0.125*size_arr[ArrEnemie[i].size] && ptrHero.y + 0.125*size_arr[ptrHero.size] <= ArrEnemie[i].y + 0.875*size_arr[ArrEnemie[i].size])
                    ||
                    (ptrHero.y + 0.875*size_arr[ptrHero.size] >= ArrEnemie[i].y + 0.125*size_arr[ArrEnemie[i].size] && ptrHero.y + 0.875*size_arr[ptrHero.size] <= ArrEnemie[i].y + 0.875*size_arr[ArrEnemie[i].size])
                    ||
                    (ptrHero.y + 0.125*size_arr[ptrHero.size] <= ArrEnemie[i].y + 0.125*size_arr[ArrEnemie[i].size] && ptrHero.y + 0.875*size_arr[ptrHero.size] >= ArrEnemie[i].y + 0.875*size_arr[ArrEnemie[i].size])
                    )
                {
                    return i;
                }
            }
        }

    }

    for (var i = 0; i < 6; i++)
    {
        if( ArrPlankton[i].x < 450 && ArrPlankton[i].isActive == true )
        {
            if( ptrHero.x + size_arr[ptrHero.size] >= ArrPlankton[i].x
                && ptrHero.x < ArrPlankton[i].x + 50 )
            {
                if( (ptrHero.y >= ArrPlankton[i].y && ptrHero.y <= ArrEnemie[i].y + 50)
                    ||
                    (ptrHero.y + size_arr[ptrHero.size] >= ArrPlankton[i].y && ptrHero.y + size_arr[ptrHero.size] <= ArrPlankton[i].y + 50)
                    ||
                    (ptrHero.y + 0.125*size_arr[ptrHero.size] <= ArrEnemie[i].y + 0.125*50 && ptrHero.y + 0.875*size_arr[ptrHero.size] >= ArrPlankton[i].y + 0.875*50)
                    )
                {
                    return i+5;
                }
            }
        }
    }
    if (anch.x < 450)
    {
        if (anch.active)
        {
            if (ptrHero.x + size_arr[ptrHero.size] >= anch.x
                && ptrHero.x < anch.x + 76 )
            {
                  if (ptrHero.y + 0.875*size_arr[ptrHero.size] >= anch.y)
                {
                    return 100;
                    anch.active = false;
                }
            }
        }

    }
    return -1;
}

function animateSprite()  //листание анимаций-текстур
{
	iSprPos++;
    if (iSprPos >= 4)
	{
		iSprPos = 0;
	}
}

function moveEnemies()  //передвигаем врагов на встречу
{
	for( var i = 0; i < 5; i++)
	{
		ArrEnemie[i].x -= (ArrEnemie[i].speed + ptrHero.speed);
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
}

function moveAnchor()
{
    anch.x -= anch.speed;
    if (anch.x < -200)
    {
        anch.x = 1000;
        anch.active = true;
    }

}

function movePlankton()  //передвигаем планктон на встречу
{
    for( var i = 0; i < 6; i++)
    {
        ArrPlankton[i].x -= (ArrPlankton[i].speed + ptrHero.speed);
        if( ArrPlankton[i].x < -230 )
        {
            ArrPlankton[i].x = 800 + getRandomInt(0,400);
            ArrPlankton[i].y = getRandomInt(0, 430);
            ArrPlankton[i].isActive = true;
            if (ArrPlankton[i].y > (480 - 50))
            {
                ArrPlankton[i].y -= 50;
            }
        }
    }
}

function drawBack()
{
    //Far background
    ctx.drawImage(backImg_1,back_1.x,0);
    ctx.drawImage(backImg_1,back_2.x,0);

    back_1.x -= (c_far_back_speed + ptrHero.accel/10);
    back_2.x -= (c_far_back_speed + ptrHero.accel/10);

    if( back_1.x <= -800 )
        back_1.x = back_2.x + 800;
    if( back_2.x <= -800 )
        back_2.x = back_1.x + 800;

    //Near background
    ctx.drawImage(backImg_2,back_3.x,0);
    ctx.drawImage(backImg_2,back_4.x,0);

    back_3.x -= (c_near_back_speed + ptrHero.accel/10);
    back_4.x -= (c_near_back_speed + ptrHero.accel/10);

    if( back_3.x <= -1600 )
        back_3.x = back_4.x + 1600;
    if( back_4.x <= -1600 )
        back_4.x = back_3.x + 1600;
}


function drawScene() { // главная функция отрисовки

    if( paused )
        return;

    if( !game_over )
    {
        clear(); // очистить canvas

        animateSprite();
        drawBack();

        if( touched )   //герой либо тонет либо всплывает
        {
            ptrHero.y -= (10 + ptrHero.accel);
            if( ptrHero.y < 0 ) ptrHero.y = 0;
        }
        else
        {
            ptrHero.y += (6 + ptrHero.accel);
            if( ptrHero.y > 450 - size_arr[ptrHero.size] ) ptrHero.y = 450 - size_arr[ptrHero.size];
        }

        //ptrHero.accel += 0.1; //герой движется с ускорением

        moveEnemies();
        if (anch.start)
        {
            moveAnchor();
        }

        //movePlankton();

        var ind = FindCollisions();
        if( ind >= 0 )  //если есть пересечения героя с др. объектами
        {
            ptrHero.accel = c_hero_accel;
            if (ind >4)
                if (ind == 100)
                {
                    ptrHero.life_count--;


                }
                else
                {
                    ArrPlankton[ind-5].isActive = false;
                    scores += 25;
                    ArrPlankton[ind-5].x = -400;
                }
            else {
                ArrEnemie[ind].isActive = false;

                if( ArrEnemie[ind].size >= ptrHero.size )
                {
                    ptrHero.life_count--;


                }
                else
                {
                    scores += 50*ArrEnemie[ind].size;
                    ArrEnemie[ind].x = -400;
                }
            }
            if( ptrHero.life_count == 0 )
            {
                //Game Over
                game_over = true;
                document.getElementById('game_over').style.visibility='visible';
                document.getElementById('txt_2').style.visibility='visible';
                document.getElementById('txt_3').style.visibility='visible';
                document.getElementById('btn_2').style.visibility='visible';
                document.getElementById('btn_3').style.visibility='visible';
            }

        };

        //отображаем все на канвасе
        drawEnemies(ctx);
        drawHero(ptrHero.x, ptrHero.y );

        //drawAnchor(ctx);

        //начисляем игровые очки и отображаем кол-во жизней
        scores += ptrHero.speed/2;
        score_txt.innerText= "Score: " + Math.floor(scores);
        document.getElementById("lifes").innerText = "Lifes: " + ptrHero.life_count;

        //проверка на необходимость роста героя
        if( scores >= c_give_level_2 && ptrHero.size < 2 )
            ptrHero.size = 2;
        else
            if( scores >= c_give_level_3 && ptrHero.size < 3 )
            {
                ptrHero.size = 3;
                anch.start = true;
                //anch.active = true;
            }
            else
                if( scores >= c_give_level_4 && ptrHero.size < 4 )
                    ptrHero.size = 4;
                else
                    if( scores >= c_give_level_5 && ptrHero.size < 5 )
                        ptrHero.size = 5;

    } //if( !game_over )
}

// -------------------------------------------------------------
// инициализация
function Init()
{
	canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');

	score_txt = document.getElementById('scores');

    game_over = false;
    paused = false;
    HideButtons();

	scores = 0;
    iSprPos = 0;
    ptrHero = new Hero(100,         //X
                       300,         //Y
                       1,           //size
                       1,           //speed
                       c_hero_accel,//acceleration
                       3);          //lifes

    ArrEnemie = [];
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_size, c_max_size), getRandomInt(c_min_speed,c_max_speed), true));
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_size, c_max_size), getRandomInt(c_min_speed,c_max_speed), true));
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_size, c_max_size), getRandomInt(c_min_speed,c_max_speed), true));
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_size, c_max_size), getRandomInt(c_min_speed,c_max_speed), true));
    ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_size, c_max_size), getRandomInt(c_min_speed,c_max_speed), true));

    ArrPlankton = [];
    ArrPlankton.push(new Plankton(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_speed,c_max_speed), true));
    ArrPlankton.push(new Plankton(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_speed,c_max_speed), true));
    ArrPlankton.push(new Plankton(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_speed,c_max_speed), true));
    ArrPlankton.push(new Plankton(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_speed,c_max_speed), true));
    ArrPlankton.push(new Plankton(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_speed,c_max_speed), true));
    ArrPlankton.push(new Plankton(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_speed,c_max_speed), true));

    anch = new Anchor(800 + 200, 350, 3, false, false);

    imgHero1 = new Image();
    imgHero2 = new Image();
    imgHero3 = new Image();
    imgHero4 = new Image();
    imgHero5 = new Image();

    imgHero1.src = 'imgs/hero.png';
    imgHero2.src = 'imgs/hero2.png';
    imgHero3.src = 'imgs/hero3.png';
    imgHero4.src = 'imgs/hero4.png';
    imgHero5.src = 'imgs/hero5.png';

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

    imgAnchor = new Image();

    imgAnchor.src = 'imgs/anchor.png';

    imgPlankton = new Image();

    imgPlankton.src = 'imgs/plankton.png';

    backImg_1 = new Image();
    backImg_1.src = 'imgs/back_1.png';

    back_1 = new FarBack(0);
    back_2 = new FarBack(800);

    backImg_2 = new Image();
    backImg_2.src = 'imgs/back_2.png';

    back_3 = new FarBack(0);
    back_4 = new FarBack(1600);

}

function HideButtons()
{
    document.getElementById('game_over').style.visibility='hidden';
    document.getElementById('txt_1').style.visibility='hidden';
    document.getElementById('txt_2').style.visibility='hidden';
    document.getElementById('txt_3').style.visibility='hidden';
    document.getElementById('btn_1').style.visibility='hidden';
    document.getElementById('btn_2').style.visibility='hidden';
    document.getElementById('btn_3').style.visibility='hidden';
}

function ShowButtons()
{
    document.getElementById('txt_1').style.visibility='visible';
    document.getElementById('txt_2').style.visibility='visible';
    document.getElementById('txt_3').style.visibility='visible';
    document.getElementById('btn_1').style.visibility='visible';
    document.getElementById('btn_2').style.visibility='visible';
    document.getElementById('btn_3').style.visibility='visible';
}

function onPauseClick()
{
    if( !paused )
    {
        paused = true;
        ShowButtons();
    }
    else
    {
        HideButtons();
        paused = false;
    }
}

function onResumeClick()
{
    HideButtons();
    paused = false;
}

function onToMenuClick()
{
    document.location.href = "index.html";
}

function onReplayClick()
{
    //document.location.reload();
    Init();
}

$(function(){
    
	Init();

    $('#scene').mousedown(function(e) {
        var canvasOffset = $(canvas).offset();
        var mouseX = Math.floor(e.pageX - canvasOffset.left);
        oldMouseY = Math.floor(e.pageY - canvasOffset.top);
        touched = true;

    });

    $('#scene').mouseup(function(e)
    {
        oldMouseY = 0;
        ptrHero.accel = c_hero_accel;
        touched = false;
    });

    setInterval(drawScene, 41);
});
