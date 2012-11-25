var canvas, ctx;
var ctxHero;
var score_txt;
var touched;
var oldMouseY;
var iSprPos;
var ArrEnemie;
var bonus;
var angry;
var ptrHero;
var ptrRod;
var anch;
var prevAnchScore;
var scores;
var game_over;
var paused;
var size_arr = [0, 64, 77, 90, 104, 115];
var blink_count;

var img1, img2, img3, img4, img5, imgPlankton, imgBonus, imgAngry;
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

//==============================================================

//======================== constants ===========================
var c_min_speed  = 4;
var c_max_speed  = 8;
var c_min_size   = 1;
var c_max_size   = 5;
var c_hero_accel = 0.04;

var c_blink_count = 8;

var c_far_back_speed = 1.8;
var c_near_back_speed = 3;

var c_rod_x_speed = 3;
var c_rod_y_speed = 15;
var c_rod_random_min = 700;
var c_rod_random_max = 900;

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
    this.opacity = 1;
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
function Bonus(x, y, speed, active){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.isActive = active;
}

function Angry(x, y, speed, active){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.isActive = active;
}

function FishRod(_x, _y, _up, _active)
{
    this.x = _x;
    this.y = _y;
    this.up = _up;
    this.active = _active;
    this.img = new Image();
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
    ctxHero.clearRect(0, 0, ctxHero.canvas.width, ctxHero.canvas.height);
}

function DrawHeroFish( imgObj, x, y ) //рисует текстуру героя на нужном месте
{
    if( touched )
        ctxHero.drawImage(imgObj, size_arr[ptrHero.size] * iSprPos, 0, size_arr[ptrHero.size], size_arr[ptrHero.size], x, y, size_arr[ptrHero.size], size_arr[ptrHero.size]);
    else
        ctxHero.drawImage(imgObj, 0, 0, size_arr[ptrHero.size], size_arr[ptrHero.size], x, y, size_arr[ptrHero.size], size_arr[ptrHero.size]);
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

function DrawAnchor( imageObj )  //рисует текстуру якоря
{
    ctx.drawImage(imageObj,anch.x, anch.y);
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
    return;
    //ctx.drawImage(imageObj, 50 * iSprPos, 0, 50, 50, ArrPlankton[num].x, ArrPlankton[num].y, 50, 50);
    ctx.drawImage(imageObj, 0, 0, 50, 50, ArrPlankton[num].x, ArrPlankton[num].y, 50, 50);
}

function DrawBonusFish( imageObj, x,y )  //рисует текстуру рыбки-бонус на канвасе
{
    ctx.drawImage(imageObj,
        50 * iSprPos,
        0,
        50,
        50,
        bonus.x,
        bonus.y,
        50,
        50);
    //return;

}

function DrawAngryFish( imageObj, x,y )  //рисует текстуру злой рыбки на канвасе
{
    ctx.drawImage(imageObj,
        50 * iSprPos,
        0,
        50,
        50,
        angry.x,
        angry.y,
        50,
        50);
    //return;

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

function drawBonus(x,y){

        DrawBonusFish( imgBonus, x,y);

}

function drawAngry(x,y){

    DrawAngryFish( imgAngry, x,y);

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
                    (ptrHero.y + + 0.875*size_arr[ptrHero.size] >= ArrEnemie[i].y + 0.125*size_arr[ArrEnemie[i].size] && ptrHero.y + 0.875*size_arr[ptrHero.size] <= ArrEnemie[i].y + 0.875*size_arr[ArrEnemie[i].size])
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
                && ptrHero.x < ArrPlankton[i].x + 64 )
            {
                if( (ptrHero.y >= ArrPlankton[i].y && ptrHero.y <= ArrEnemie[i].y + 64)
                        ||
                    (ptrHero.y + size_arr[ptrHero.size] >= ArrPlankton[i].y && ptrHero.y + size_arr[ptrHero.size] <= ArrPlankton[i].y + 64)
                    )
                {
                    return i+5;
                }
            }
        }
    }
    if (anch.x < 450)
    {
        if (anch.active == true)
        {
            if (ptrHero.x + size_arr[ptrHero.size] >= anch.x
                && ptrHero.x < anch.x + 76 )
            {
                if (ptrHero.y + 0.875*size_arr[ptrHero.size] >= anch.y)
                {
                    anch.active = false;
                    return 100;
                }
            }
        }
    }

    return -1;
}

function bonusCollisions()
{
    if( bonus.x < 450 && bonus.isActive == false )
       return;

    if( ptrHero.x + size_arr[ptrHero.size] >= bonus.x
        && ptrHero.x < bonus.x + imgBonus.height )
    {
        if( (ptrHero.y >= bonus.y && ptrHero.y <= bonus.y + 64)
            ||
            (ptrHero.y + size_arr[ptrHero.size] >= bonus.y && ptrHero.y + size_arr[ptrHero.size] <= bonus.y + 64)
            )
        {
            ptrHero.life_count += 1;
            bonus.isActive = false;
            bonus.x = -300;
        }
    }
}

function angryCollisions()
{
    if( angry.x < 450 && angry.isActive == false )
        return;

    if( ptrHero.x + size_arr[ptrHero.size] >= angry.x
        && ptrHero.x < angry.x + imgAngry.height )
    {
        if( (ptrHero.y >= angry.y && ptrHero.y <= angry.y + 64)
            ||
            (ptrHero.y + size_arr[ptrHero.size] >= angry.y && ptrHero.y + size_arr[ptrHero.size] <= angry.y + 64)
            )
        {
            if(ptrHero.size == 1)
            {
                ptrHero.life_count--;
                blink_count = c_blink_count;
            }
            else
            {
                ptrHero.size--;
                blink_count = c_blink_count;
            }
            //ptrHero.life_count -= 1;
            //angry.isActive = false;
            //angry.x = -300;
			angry.isActive = false;
            angry.x = -300;
        }
    }
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
		ArrEnemie[i].x -= (ArrEnemie[i].speed + ptrHero.speed + ptrHero.size/4);
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
    anch.x -= c_near_back_speed + ptrHero.accel/10 + ptrHero.size/4;

    if (anch.x < -200)
    {
        anch.start = false;
        anch.active = true;
        anch.x = 1000;
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
            ArrPlankton[i].y = getRandomInt(0, 416);
            ArrPlankton[i].isActive = true;
            if (ArrPlankton[i].y > (480 -64))
            {
                ArrPlankton[i].y -= 64;
            }
        }
    }
}

function moveBonus()  //передвигаем рыбку-бонус на встречу
{
    if (ptrHero.life_count < 3)
    {
        bonus.x -= (bonus.speed + ptrHero.speed);
        if( bonus.x < -230 )
        {
            bonus.x = 800 + getRandomInt(3000,5000);
            bonus.y = getRandomInt(10, 350);
            bonus.isActive = true;
        }
    }
}

function moveAngry()  //передвигаем злую рыбку на встречу
{
    if (scores >= 150)
    {
        angry.x -= (angry.speed + ptrHero.speed);
        if( angry.x < -230 )
        {
            angry.x = 800 + getRandomInt(3000,5000);
            angry.y = getRandomInt(10, 350);
            angry.isActive = true;
        }
    }
}

function drawBack()
{
    //Far background
    ctx.drawImage(backImg_1,back_1.x,0);
    ctx.drawImage(backImg_1,back_2.x,0);

    back_1.x -= (c_far_back_speed + ptrHero.accel/10 + ptrHero.size/4);
    back_2.x -= (c_far_back_speed + ptrHero.accel/10 + ptrHero.size/4);

    if( back_1.x <= -800 )
        back_1.x = back_2.x + 800;
    if( back_2.x <= -800 )
        back_2.x = back_1.x + 800;

    //Near background
    ctx.drawImage(backImg_2,back_3.x,0);
    ctx.drawImage(backImg_2,back_4.x,0);

    back_3.x -= (c_near_back_speed + ptrHero.accel/10 + ptrHero.size/4);
    back_4.x -= (c_near_back_speed + ptrHero.accel/10 + ptrHero.size/4);

    if( back_3.x <= -1600 )
        back_3.x = back_4.x + 1600;
    if( back_4.x <= -1600 )
        back_4.x = back_3.x + 1600;
}

function moveFishRod()
{
    ptrRod.x -= c_rod_x_speed;

    if( ptrRod.x < c_rod_x_speed )
    {
        ptrRod.x = getRandomInt(c_rod_random_min, c_rod_random_max);
        ptrRod.y = -250;
        ptrRod.up = false;
        ptrRod.active = true;
        return;
    }
    if( ptrRod.x < 230 )
    {
        if( ptrRod.up == false && ptrRod.y < 0 )
        {
            ptrRod.y += c_rod_y_speed;
        }
        else
        {
            ptrRod.up = true;
        }
        if( ptrRod.up )
            ptrRod.y -= c_rod_y_speed * 2;
    }

    ctx.drawImage(ptrRod.img, ptrRod.x, ptrRod.y, ptrRod.img.width, ptrRod.img.height);
}

function findRodCollisions()
{
    if( !ptrRod.active )
        return;

    if( ptrRod.x <= ptrHero.x + size_arr[ptrHero.size]*0.9 )
    {
        //if( ptrHero.y + size_arr[ptrHero.size]*0.9 <= ptrRod.y + ptrRod.img.height )
        if( ( ptrRod.y + ptrRod.img.height - ptrHero.y < 130 )
            && ( ptrHero.y + size_arr[ptrHero.size]*0.2 <= ptrRod.y + ptrRod.img.height )
            )
        {
            ptrHero.life_count--;
            blink_count = c_blink_count;
            ptrRod.active = false;
        }
    }
}

function blink()
{
   if( blink_count > 0 )
   {
       if( blink_count%2 == 0 )
       {
           ctxHero.globalAlpha -= 0.15;
           if( ctxHero.globalAlpha <= 0.15 )
               blink_count--;
       }
       else
       {
           ctxHero.globalAlpha += 0.15;
           if( ctxHero.globalAlpha >= 1 )
               blink_count--;
       }
   }
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
            ptrHero.y -= (14 + ptrHero.accel);
            if( ptrHero.y < 0 ) ptrHero.y = 0;
        }
        else
        {
            ptrHero.y += (8 + ptrHero.accel);
            if( ptrHero.y > 450 - size_arr[ptrHero.size] ) ptrHero.y = 450 - size_arr[ptrHero.size];
        }

        //ptrHero.accel += 0.1; //герой движется с ускорением

        moveEnemies();
        if (scores > prevAnchScore + getRandomInt(300, 500)*(6 - ptrHero.size) && scores < prevAnchScore + getRandomInt(300, 500)*(6 - ptrHero.size) + 250)
        {
            anch.start = true;
        }
        if (anch.start)
        {
            moveAnchor();
        }

        //movePlankton();
        moveBonus();
        moveAngry();
        moveFishRod();

        if( blink_count > 0 )
        {
            blink();
        }
        else
        {
            findRodCollisions();
            bonusCollisions();
            angryCollisions();

            var ind = FindCollisions();
            if( ind >= 0 )  //если есть пересечения героя с др. объектами
            {
                ptrHero.accel = c_hero_accel;
                if (ind >4)

                    if (ind == 100)
                        {
                            ptrHero.life_count--;
                            blink_count = c_blink_count;
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
                        blink_count = c_blink_count;
                    }
                    else
                    {
                        scores += 50*ArrEnemie[ind].size;
                        ArrEnemie[ind].x = -400;
                    }
                }

            };
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

        //отображаем все на канвасе
        drawEnemies(ctx);
        drawBonus(bonus.x, bonus.y);
        drawAngry(angry.x, angry.y);

        drawHero( ptrHero.x, ptrHero.y );

        //начисляем игровые очки и отображаем кол-во жизней
        scores += ptrHero.speed/2;
        score_txt.innerText= "Score: " + Math.floor(scores);
        document.getElementById("lifes").innerText = "Lifes: " + ptrHero.life_count;

        //проверка на необходимость роста героя
        if( scores >= c_give_level_2 && ptrHero.size < 2 )
            ptrHero.size = 2;
        else
            if( scores >= c_give_level_3 && ptrHero.size < 3 )
                ptrHero.size = 3;
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

    ctxHero = document.getElementById('heroCanvas').getContext('2d');

	score_txt = document.getElementById('scores');
    prevAnchScore = 0;
    blink_count = 0;
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

    ptrRod = new FishRod( getRandomInt(c_rod_random_min,c_rod_random_max), -250, false, true);
    ptrRod.img.src = 'imgs/rod.png';

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

    bonus = new Bonus(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_speed,c_max_speed), true);
    angry = new Angry(800 + getRandomInt(0,1200), getRandomInt(0,300), getRandomInt(c_min_speed,c_max_speed), true);
    anch = new Anchor(800 + 200, 350, c_near_back_speed + ptrHero.accel/10 + ptrHero.size/4, false, true);

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

    imgBonus = new Image();
    imgBonus.src = 'imgs/bonus.png';

    imgAngry = new Image();
    imgAngry.src = 'imgs/angry.png';

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
    if( !game_over )
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

    $('#heroCanvas').mousedown(function(e) {
        var canvasOffset = $(canvas).offset();
        var mouseX = Math.floor(e.pageX - canvasOffset.left);
        oldMouseY = Math.floor(e.pageY - canvasOffset.top);
        touched = true;

    });

    $('#heroCanvas').mouseup(function(e)
    {
        oldMouseY = 0;
        ptrHero.accel = c_hero_accel;
        touched = false;
    });

    setInterval(drawScene, 41);
});
