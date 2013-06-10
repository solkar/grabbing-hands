var GameOver = cc.Layer.extend({
    _ship:null,
    _lbScore:0,

    init:function () {
        var bRet = false;
        if (this._super()) {
            //var bck = cc.bckrite.create(s_loading);
            //bck.setAnchorPoint( cc.p(0,0) );
            //this.addChild(bck, 0, 1);

            //var logo = cc.Sprite.create(s_gameOver);
            //logo.setAnchorPoint(cc.p(0,0));
            //logo.setPosition(0,300);
            //this.addChild(logo,10,1);

            var playAgainNormal = cc.Sprite.create(s_menu, cc.rect(378, 0, 126, 33));
            var playAgainSelected = cc.Sprite.create(s_menu, cc.rect(378, 33, 126, 33));
            var playAgainDisabled = cc.Sprite.create(s_menu, cc.rect(378, 33 * 2, 126, 33));

            var playAgain = cc.MenuItemSprite.create(playAgainNormal, playAgainSelected, playAgainDisabled, function(){
                //flareEffect(this,this,this.onPlayAgain);
                this.onPlayAgain();
            }.bind(this) );

            var menu = cc.Menu.create(playAgain);
            this.addChild(menu, 1, 2);
            menu.setPosition(winSize.width / 2, 220);

            var lbScore = cc.LabelTTF.create("You went broke","Arial Bold",32);
            lbScore.setPosition(centerPos.x,280);
            lbScore.setColor(cc.c3b(250,179,0));
            this.addChild(lbScore,10);


            if(GH.SOUND){
                cc.AudioEngine.getInstance().playMusic(s_mainMainMusic_mp3);
            }

            bRet = true;
        }
        return bRet;
    },
    onPlayAgain:function (pSender) {
        //var scene = cc.Scene.create();
        var scene = MainLayer.scene();
        //scene.addChild(MainLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2,scene));
    }
});

GameOver.create = function () {
    var sg = new GameOver();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

GameOver.scene = function () {
    var scene = cc.Scene.create();
    var layer = GameOver.create();
    scene.addChild(layer);
    return scene;
};
