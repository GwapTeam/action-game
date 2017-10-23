enchant();
window.onload = function() {
    var game = new Game(320,320);
    game.preload("img/chara1.png","img/map2.gif");
    game.onload = function() {
        var blocks = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
        var blockSet = [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3];
        mapSet(blocks, blockSet);
        var map = new Map(16,16);
        var bear = new Sprite(32,32);
        bear.vx = 0;
        bear.vy = 0;
        bear.pose = 0;
        bear.addEventListener(
            Event.ENTER_FRAME,
            function(e) {
                var ax = 0;

                if (game.input.right) {
                    ax += 0.5;
                    bear.scaleX = 1;
                    if(game.frame %3 == 0){
                        bear.pose++;
                        bear.pose %= 2;
                    }
                    bear.frame = bear.pose + 1;
                } else if(game.input.left) {
                    ax -= 0.5;
                    bear.scaleX = -1;
                    if(game.frame %3 == 0){
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
                } else if (bear.vx < -0.3) {
                    ax += 0.3;
                } else if(bear.vx < 0) {
                    ax -= bear.vx;
                }

                bear.vx += ax;
                bear.vx = Math.min(Math.max(bear.vx,-10),10);
                if(game.input.up && !bear.jumping) {
                    bear.vy = -9;
                    bear.jumping = true;
                }
                bear.vy += 0.5;

                var dx = bear.x + bear.vx + 5;
                var dy = bear.y + bear.vy;
                if (map.hitTest(dx,dy + bear.height) || map.hitTest(dx + bear.width - 10,dy + bear.height)) {
                    dy = Math.floor(dy/16) * 16;
                    bear.vy = 0;
                    bear.jumping = false;
                }
                //右判定
                if (map.hitTest(dx + bear.width - 10, dy + (bear.height/2))) {
                    bear.vx = -2;
                }
                //左判定
                if (map.hitTest(dx-1,dy + (bear.height/2))) {
                    bear.vx = 2;
                }
                //上判定
                if (map.hitTest(dx + (bear.width/2),dy - 1)) {
                    bear.vy = 1;
                }

                bear.x = (0 < dx - 5) ? dx - 5 : 0;
                bear.y = dy;
            }
        );
        map.image = game.assets["img/map2.gif"];
        map.loadData(blocks);
        bear.image = game.assets["img/chara1.png"];
        game.rootScene.addChild(bear);
        game.rootScene.addChild(map);
    }
    game.start();
}
