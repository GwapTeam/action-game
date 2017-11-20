enchant();
window.onload = function() {
    var game = new Game(320,320);
    game.preload("img/chara1.png","img/map2.gif","img/start.png","img/clear.png","img/end.png");
    game.onload = function() {

        function createTitleScene() {
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
        }

        function createGameScene() {
            var blocks = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
            var blockSet = [3,3,3,3,3,3,3,3,3,8,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3];
            var map = new Map(16,16);
            var bear = new Sprite(32,32);
            bear.vy = 0;
            bear.pose = 0;
            map.loadData(generateData(blocks, blockSet));
            map.image = game.assets["img/map2.gif"];
            bear.image = game.assets["img/chara1.png"];

            //前回の熊のX座標
            var bx = 0;
            bear.addEventListener(
                Event.ENTER_FRAME,
                function() {
                    if (game.input.right || game.input.left) {
                        if(game.input.right) {
                            bear.x += 5;
                            bear.scaleX = 1;
                        } else if(game.input.left) {
                            bear.x -= 5;
                            bear.scaleX = -1;
                        }
                        if(game.frame %3 == 0){
                            bear.pose++;
                            bear.pose %= 2;
                        }
                        bear.frame = bear.pose + 1;
                    } else {
                        bear.frame = 0;
                    }

                    if(game.input.up && !bear.jumping) {
                        bear.vy = -9;
                        bear.jumping = true;
                    }

                    bear.vy += 0.5;

                    var dy = bear.y + bear.vy;
                    if(map.hitTest(bear.x + 6, dy + bear.height) || map.hitTest(bear.x + bear.width - 10, dy + bear.height)) {
                        dy = Math.floor(dy/16) * 16;
                        bear.vy = 0;
                        bear.jumping = false;
                    }
                    //右判定
                    if(map.hitTest(bear.x + bear.width - 10,dy + (bear.height/2))) {
                        bear.x = bx;
                    }
                    //左判定
                    if (map.hitTest(bear.x + 9,dy + (bear.height/2))) {
                        bear.x = bx;
                    }
                    bear.x = (0 < bear.x) ? bear.x : 0;
                    bear.y = dy;
                    bx = bear.x;
                    if(bear.x > 730) {
                        alert('ゴール');
                        location.reload();
                    } else if(bear.y >= 300) {
                        game.replaceScene(createGameoverScene());
                    }
                }
            );

            var stage = new Group();
            stage.addChild(map);
            stage.addChild(bear);
            stage.addEventListener(
                Event.ENTER_FRAME,
                function() {
                    if(stage.x > 64 - bear.x) {
                        stage.x = 64 -bear.x;
                    }
                }
            );
            game.rootScene.addChild(stage);

            var scene = new Scene();
            scene.addChild(stage);
            scene.addEventListener(
                Event.TOUCH_START,
                function () {
                    game.replaceScene(createGameoverScene());
                }
            );
            return scene;
        }

        function createGameoverScene() {
            var scene = new Scene();
            var startImage = new Sprite(190, 97);
            startImage.image = game.assets["img/end.png"];
            startImage.x = 80;
            startImage.y = 120;
            scene.addChild(startImage);
            scene.backgroundColor = '#000000';
            scene.addEventListener(Event.TOUCH_START, function (e) {
                game.replaceScene(createTitleScene());
            });
            return scene;
        }

        game.replaceScene(createTitleScene());

    }
    game.start();
}
