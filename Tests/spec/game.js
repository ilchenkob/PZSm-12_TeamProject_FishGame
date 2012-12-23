describe("Game", function() {
	//var player;
  beforeEach(function() {
    
    prevAnchScore = 0;
    blink_count = 0;
    game_over = false;
    paused = false;
    arrRecords = [];
    
	scores = 0;
    iSprPos = 0;
    ptrHero = new Hero(100,         //X
                       300,         //Y
                       1,           //size
                       1,           //speed
                       c_hero_accel,//acceleration
                       3,           //lifes
                       0);          //points

    ptrRod = new FishRod( getRandomInt(c_rod_random_min,c_rod_random_max), -250, false, true);
    ptrRod.img.src = 'imgs/rod.png';

    ArrEnemie = [];
    var enemieSize = 0;
    enemieSize = getRandomInt(1, ptrHero.size + 2);
    if (enemieSize > 5) enemieSize = 5;
		ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,340), enemieSize, getRandomInt(c_min_speed,c_max_speed), true));
    enemieSize = getRandomInt(1, ptrHero.size + 2);
    if (enemieSize > 5) enemieSize = 5;
		ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,340), enemieSize, getRandomInt(c_min_speed,c_max_speed), true));
    enemieSize = getRandomInt(1, ptrHero.size + 2);
    if (enemieSize > 5) enemieSize = 5;
		ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,340), enemieSize, getRandomInt(c_min_speed,c_max_speed), true));
    enemieSize = getRandomInt(1, ptrHero.size + 2);
    if (enemieSize > 5) enemieSize = 5;
		ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,340), enemieSize, getRandomInt(c_min_speed,c_max_speed), true));
    enemieSize = getRandomInt(1, ptrHero.size + 2);
    if (enemieSize > 5) enemieSize = 5;
		ArrEnemie.push(new Enemie(800 + getRandomInt(0,1200), getRandomInt(0,340), enemieSize, getRandomInt(c_min_speed,c_max_speed), true));

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
	
	
	life = document.createElement("lifes");
	
	var newCanvas = document.createElement('canvas');	
	score_txt = document.createElement('scores');
	
	ctx = newCanvas.getContext('2d');
	ctxHero = newCanvas.getContext('2d');
	
	ctx.canvas.width = 800;
	ctx.canvas.height = 480;
	
	ctxHero.canvas.width = 800;
	ctxHero.canvas.height = 480;
  });

  it("Hero must down", function() {
	
	ptrHero.y = 100;
	touched = false;	
	
	drawScene();
	drawScene();	
	
	expect(ptrHero.y).toBeGreaterThan(100);
  });
  
  it("Hero must up", function() {
	
	ptrHero.y = 200;
	touched = true;	
	
	drawScene();
	drawScene();	
	
	expect(ptrHero.y).toBeLessThan(200);
  });
  
  it("Points should grow", function() {
	
	scores = 100;

	drawScene();
	drawScene();	
	drawScene();	
	
	expect(scores).toBeGreaterThan(100);
  });
  
  it("Hero should grow", function() {
	
	ptrHero.size = 1;
	ptrHero.points = c_give_level_2;

	drawScene();
	drawScene();	
	
	expect(ptrHero.size).toBeGreaterThan(1);
  });
  
  it("Background should move", function() {
	
	var old_position = back_1.x;

	drawScene();
	drawScene();	
	
	expect(back_1.x).toBeLessThan(old_position);
  });

    it("Anchor should appear", function() {

        anch.start = false;
        anch.active = true;
        anch.x = -200;

        drawScene();
        drawScene();

        expect(anch.x).toBeLessThan(1000);
    });

    it("Bonus should appear", function() {

        ptrHero.life_count = 3;
        bonus.isActive = true;

        drawScene();
        drawScene();

        expect(ptrHero.life_count).toBeGreaterThan(0);
    });
     it("bad fish should die our fish ", function() {

        ptrHero.life_count = 3;
        angry.isActive = true;

        drawScene();
        drawScene();

        expect(ptrHero.life_count).
        expect(game_over).toEqual(2);
    });

    it("Fish should have 3 lifes in the start", function() {

        ptrHero.points = 0;
        drawScene();
        expect(ptrHero.life_count).toEqual(3);
    });

    it("Fish should be small in the early", function() {
        ptrHero.points = 0;
        drawScene();
        drawScene();
        expect(ptrHero.size).toBe(1);


    });

    it("Rod to take the life", function() {
        ptrHero.life_count=3;

        ptrRod.x = 680;
        ptrRod.y = 40;
        ptrHero.x = 650;
        ptrHero.y = 20;

        drawScene();

        expect(ptrHero.life_count).toBeLessThan(3);


    });
    it ("Angry should move", function() {
        ptrHero.size = 2;
        angry.isActive = true;

        drawScene();
        drawScene();
        expect(angry.x).toBeGreaterThan(-230);

    });

    it ("To finish the game in case of death", function (){
        game_over = false;
        ptrHero.life_count = 0;
        drawScene();
        expect(game_over).toBeTruthy();

    });

    it ("To blink", function (){
        blink_count = 3;
        drawScene();
        expect(anch.start).toBeLessThan(3);

    });


    it ("To change sprite", function (){
        iSprPos = 2;
        drawScene();
        expect(iSprPos).toBeGreaterThan(2);

    });

    it ("To go to the first sprite", function (){
        iSprPos = 4;
        drawScene();
        expect(iSprPos).toBe(0);

    });
   it("Fish should be 4-th size in the end", function() {
        ptrHero.points = 4;
        drawScene();
        drawScene();
        expect(ptrHero.size).toBe(4);


    });
});
