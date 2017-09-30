        enchant();
        window.onload = function () {
            disp();
            var game = new Game(640, 320);
            game.fps = 24;
            game.preload("img/chara1.png", "img/map2.gif", "img/end.png", "img/start.png","img/chara2.png","img/space0.png","img/clear.png");
            game.onload = function () {

                //スタート画面
                var createTitleScene = function () {
                    var scene = new Scene();
                    var startImage = new Sprite(236, 48);
                    startImage.image = game.assets["img/start.png"];
                    startImage.x = 42;
                    startImage.y = 136;
                    scene.addChild(startImage);
                    scene.backgroundColor = 'rgba(255,230,0,1)';

                    scene.addEventListener(Event.TOUCH_START, function (e) {
                        game.replaceScene(createGameScene());
                    });
                    return scene;
                };

                //ゲーム画面
                var createGameScene = function () {
                    var scene = new Scene();
                    var blocks = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

                    var blockSet = [3,3,3,3,3,3,3,3,0,0,0,0,10,3,3,10,3,3,4,5,6,7,8,9,10,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3];



                    function mapSet(blocks,blockset){
                        var count = 0;
                        for(var i = 0;i<20;i++){
                            for(var j = 0;j<blockset.length;j++){
                                count = blockset[j];
                                if(i>=15-count && i<15){
                                    if(i == (15-count)){
                                        blocks[i][j] = 4;
                                    }else{
                                        blocks[i][j] = 3;
                                    }
                                }else{
                                    blocks[i][j] = -1;
                                }
                            }
                        }
                    }

                    mapSet(blocks,blockSet);



                    var map = new Map(16, 16);
                    map.image = game.assets["img/map2.gif"];
                    map.loadData(blocks); //チップの並びを配列で指定
                    //scene.addChild(map); //画面に画像をロード


                    //ゴール
                    var goal = new Sprite(32,64);
                    goal.image = game.assets["img/space0.png"];
                    goal.x = 700;
                    goal.y = 150;




                    var bear = new Sprite(32, 32);
                    bear.image = game.assets["img/chara1.png"];
                    //scene.addChild(bear);


                    var enemygroup = new Group();
                    for(var i = 0; i<2;i++){
                        var enemy = new Sprite(32,32);
                        enemygroup.addChild(enemy);
                    }


                    //敵の設定を関数化
                    function enemyconf(enemy,x){
                        enemy.image = game.assets["img/chara2.png"];
                        enemy.x = x;
                        enemy.y = 0;
                        enemy.vx = 0;
                        enemy.pose = 0;
                        enemy.vy = 0;
                        enemy.left = true;
                        enemy.addEventListener(Event.ENTER_FRAME,function(){
                            var ax = 0;
                            if((map.hitTest(enemy.x + enemy.vx + 5,enemy.y + enemy.vy + enemy.height) == false) || (map.hitTest(enemy.x+enemy.vx + 5,enemy.y + enemy.vy+(enemy.height/2)))){
                                enemy.left = false;
                            }
                            if((map.hitTest(enemy.x + enemy.vx + 5 + enemy.width - 10,enemy.y + enemy.vy +enemy.height) == false)  ||(map.hitTest(enemy.x + enemy.vx + 5 + enemy.width - 10,enemy.y + enemy.vy+(enemy.height/2)))){
                                enemy.left = true;
                            }
                            if(enemy.left){
                                ax += 0.3;
                            }
                            if(enemy.left == false){
                                ax -= 0.3;
                            }
                            if(ax > 0){
                                enemy.scaleX = 1;
                            }
                            if(ax < 0){
                                enemy.scaleX = -1;
                            }
                            if(ax != 0){
                                if(game.frame % 3 == 0){
                                    enemy.pose++;
                                    enemy.pose %= 2;
                                }
                                enemy.frame = enemy.pose + 1;
                            }else{
                                enemy.frame = 0;
                            }
                            if(enemy.vx > 0.3){
                                ax -= 0.3;
                            }else if(enemy.vx > 0){
                                ax -= enemy.vx;
                            }
                            if(enemy.vx < -0.3){
                                ax += 0.3;
                            }else if(enemy.vx < 0){
                                ax -= enemy.vx;
                            }
                            enemy.vx += ax;

                            enemy.vx = Math.min(Math.max(enemy.vx,-10),10);
                            enemy.vy += 0.5;

                            var ex = enemy.x - enemy.vx + 5;
                            var ey = enemy.y + enemy.vy;
                            if(map.hitTest(ex,ey + enemy.height) || map.hitTest(ex + enemy.width - 10,ey +enemy.height)){
                                ey = Math.floor(ey / 16) * 16;
                                enemy.vy = 0;
                            }
                            enemy.x = ex -5;
                            enemy.y = ey;
                        });
                    }
                    enemyconf(enemygroup.childNodes[0],500);
                    enemyconf(enemygroup.childNodes[1],270);


                    var enemyhitgroup = new Group();
                    for(var i = 0; i<2;i++){
                        var enemyhit = new Sprite(10,26);
                        enemyhitgroup.addChild(enemyhit);
                    }


                    //衝突判定用オブジェクトの設定
                    function enemyhitconf(enemyhit,enemy){
                        enemyhit.opacity = 0.3;
                        enemy.image = game.assets["img/chara2.png"];
                        enemy.addEventListener(Event.ENTER_FRAME,function(){
                            enemyhit.x = enemy.x;
                            enemyhit.y = enemy.y;
                        });
                    }
                    enemyhitconf(enemyhitgroup.childNodes[0],enemygroup.childNodes[0]);
                    enemyhitconf(enemyhitgroup.childNodes[1],enemygroup.childNodes[1]);




                    bear.vx = 0;
                    bear.vy = 0;
                    bear.jumping = false;
                    bear.pose = 0;
                    bear.addEventListener(Event.ENTER_FRAME, function (e) {
                        var ax = 0; //クマの加速度
                        if (game.input.right) {
                            ax += 0.5;
                        }
                        if (game.input.left) {
                            ax -= 0.5;
                        }
                        if (ax > 0) {
                            bear.scaleX = 1;
                        }
                        if (ax < 0) {
                            bear.scaleX = -1;
                        }
                        if (ax != 0) {
                            if (game.frame % 3 == 0) {
                                bear.pose++;
                                bear.pose %= 2;
                            }
                            bear.frame = bear.pose + 1;
                        } else {
                            bear.frame = 0;
                        }
                        if (bear.vx > 0.3) {
                            ax -= 0.3;
                        } else if (bear.vx > 0) {
                            ax -= bear.vx;
                        }
                        if (bear.vx < -0.3) {
                            ax += 0.3;
                        } else if (bear.vx < 0) {
                            ax -= bear.vx;
                        }
                        bear.vx += ax;
                        bear.vx = Math.min(Math.max(bear.vx, -10), 10);


                        if (game.input.up && !bear.jumping) {
                            bear.vy = -9;
                            bear.jumping = true;
                        }
                        bear.vy += 0.5;


                        if(bear.y >= 300){
                            game.replaceScene(createGameoverScene());
                        }


                        //当たり判定
                        var dx = bear.x + bear.vx + 5;
                        var dy = bear.y + bear.vy;
                        if (map.hitTest(dx, dy + bear.height) || map.hitTest(dx + bear.width - 10, dy + bear.height) || map.hitTest(dx + 6,dy + bear.height)){
                            dy = Math.floor(dy / 16) * 16;
                            bear.vy = 0;
                            bear.jumping = false;
                        }

                        //右判定
                        if (map.hitTest(dx + bear.width - 10, dy + (bear.height/2))) {
                            bear.vx = -2;
                        }
                        //左判定
                        if(map.hitTest(dx-1,dy + (bear.height/2))){
                            bear.vx = 2;
                        }
                        //上判定
                        if(map.hitTest(dx + (bear.width/2),dy - 1)){
                            bear.vy = 1;
                        }
                        //敵との当たり判定
                        for(var i =0;i<2;i++){
                           if(bear.intersect(enemyhitgroup.childNodes[i])){
                            game.replaceScene(createGameoverScene());
                           }
                        }
                        //ゴールとの当たり判定
                        if(bear.intersect(goal)){
                            game.replaceScene(createGameclearScene());
                        }

                        bear.x = dx - 5;
                        bear.y = dy;
                        if(bear.x < 0){
                            bear.x = 0;
                        }
                        document.getElementById('test').value = bear.x;

                    });

                    var stage = new Group();
                    var stageblock = 0;
                    stage.addChild(map);
                    stage.addChild(bear);
                    stage.addChild(enemygroup);
                    stage.addChild(enemyhitgroup);
                    stage.addChild(goal);
                    stage.addEventListener(Event.ENTER_FRAME, function (e) {
                        //面白い
                        if (stage.x > 64 - bear.x) {
                            stage.x = 64 - bear.x;
                            stageblock = bear.x;
                        }
                        //キャラクターが画面外に行くのを制御
                        if(bear.x > 64){
                            if(bear.x < stageblock - 64){
                                bear.x = stageblock - 64;
                            }
                        }
                    });

                    scene.addChild(stage);


                    scene.addEventListener(Event.TOUCH_START, function (e) {
                        game.replaceScene(createGameoverScene());
                    });

                    return scene;
                };


                //ゲームオーバ画面
                var createGameoverScene = function () {
                    var scene = new Scene();
                    var startImage = new Sprite(190, 97);
                    startImage.image = game.assets["img/end.png"];
                    startImage.x = 80;
                    startImage.y = 120;
                    scene.addChild(startImage);
                    scene.backgroundColor = '#000000';
                    start = new Date();
                    scene.addEventListener(Event.TOUCH_START, function (e) {
                        game.replaceScene(createTitleScene());
                    });
                    return scene;
                };


                //ゲームクリア画面
                var createGameclearScene = function () {
                    var scene = new Scene();
                    var startImage = new Sprite(236, 48);
                    startImage.image = game.assets["img/clear.png"];
                    startImage.x = 80;
                    startImage.y = 120;
                    scene.addChild(startImage);
                    scene.backgroundColor = '#ff0000';
                    start = new Date();
                    scene.addEventListener(Event.TOUCH_START, function (e) {
                        game.replaceScene(createTitleScene());
                    });
                    return scene;
                };

                game.replaceScene(createTitleScene());
            };
            start = new Date();
            console.log("tagname:");
            console.log(game.id);
            game.start();
        };

        var start = new Date();

        //初期化
        var hour = 0;
        var min = 0;
        var sec = 0;
        var now = 0;
        var datet = 0;

        function disp() {
            now = new Date();
            datet = parseInt((now.getTime() - start.getTime()) / 1000);

            hour = parseInt(datet / 3600);
            min = parseInt((datet / 60) % 60);
            sec = datet % 60;

            //数値が１桁の場合、頭に０をつけて２桁で表示する指定
            if (hour < 10) {
                hour = "0" + hour;
            }
            if (min < 10) {
                min = "0" + min;
            }
            if (sec < 10) {
                sec = "0" + sec;
            }

            //フォーマットを指定（不要な行を削除する）
            var timer1 = hour + ':' + min + ':' + sec;

            //テキストフィールドにデータを渡す処理
            document.form1.field1.value = timer1;

            setTimeout("disp()", 1000);
        }
