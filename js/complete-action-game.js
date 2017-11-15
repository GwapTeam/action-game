enchant();
window.onload = function() {
    var game = new Game(320,320);
    game.preload("img/chara1.png","img/map2.gif");
    game.onload = function() {
        var blocks = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
        var blockSet = [3,3,3,3,3,3,3,3,3,8,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3];
        mapSet(blocks, blockSet);
        var map = new Map(16,16);
        var bear = new Sprite(32,32);
        //前回の熊のX座標
        bx = 0;
        bear.vy = 0;
        bear.pose = 0;
        bear.addEventListener(
            Event.ENTER_FRAME,
            function(e) {
                if(game.input.right){
                    bear.x += 5;
                    bear.scaleX = 1;
                    if(game.frame %3 == 0){
                        bear.pose++;
                        bear.pose %= 2;
                    }
                    bear.frame = bear.pose + 1;
                }else if(game.input.left){
                    bear.x -= 5;
                    bear.scaleX = -1;
                    if(game.frame %3 == 0){
                        bear.pose++;
                        bear.pose %= 2;
                    }
                    bear.frame = bear.pose + 1;
                }else{
                    bear.frame = 0;
                }

                if(game.input.up && !bear.jumping){
                    bear.vy = -9;
                    bear.jumping = true;
                }
                bear.vy += 0.5;

                var dy = bear.y + bear.vy;
                if(map.hitTest(bear.x + 6, dy + bear.height) || map.hitTest(bear.x + bear.width - 10, dy + bear.height) ){
                    dy = Math.floor(dy/16) * 16;
                    bear.vy = 0;
                    bear.jumping = false;
                }
                //右判定
                if(map.hitTest(bear.x + bear.width - 10,dy + (bear.height/2))){
                    bear.x = bx;
                }
                //左判定
                if (map.hitTest(bear.x + 9,dy + (bear.height/2))) {
                    bear.x = bx;
                }
                bear.x = (0 < bear.x) ? bear.x : 0;
                bear.y = dy;
                bx = bear.x;
                if(bear.x > 320){
                    alert('ゴール');
                }
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
