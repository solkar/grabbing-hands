var g_sharedGameLayer;

STATE_PLAYING = 0;
STATE_GAMEOVER = 1;
STATE_PAUSE = 2;
MAX_CONTAINT_WIDTH = 40;
MAX_CONTAINT_HEIGHT = 40;

var MainLayer = cc.LayerColor.extend({

    tileMap:null,
    _player:null,
    _texTransparentBatch:null,
    _state:null,
    lbScore:null,
    businessDoor:null,
    init:function(){
        var bRet = false

        if (this._super()) {

            //Set background color
            //this.setColor(cc.c3b(240, 128, 0));

            // reset global values
            GH.CONTAINER.ENEMIES = [];
            GH.CONTAINER.ENEMY_BULLETS = [];
            GH.CONTAINER.PLAYER_BULLETS = [];
			GH.CONTAINER.EXPLOSIONS = [];
			GH.CONTAINER.SPARKS = [];
			GH.CONTAINER.HITS = [];

            GH.SCORE = 0;
            GH.LIFE = 1;
            this._state = STATE_PLAYING;
              
            g_sharedGameLayer = this;

            cc.SpriteFrameCache.getInstance().addSpriteFrames(s_textureTransparentPack_plist);

            // TransparentBatch
            var texTransparent = cc.TextureCache.getInstance().addImage(s_textureTransparentPack);
            this._texTransparentBatch = cc.SpriteBatchNode.createWithTexture(texTransparent);
            this.addChild(this._texTransparentBatch, 100);
                 
                //load tile map
                var map = cc.TMXTiledMap.create(s_tileLevel01Tmx);
                //map.setPosition(0, winSize.height*0.1 - map.getContentSize().heigth); //not working as expected
                //map.setAnchorPoint(0.5,0.5); //not working
                this.tileMap = map;
                this.addChild(map, 1, 1);

                
                //TODO: load player from the tile map
                var aSpawnPosition = this.getSpawnPoint(); 
                console.log("Spawn position:" + aSpawnPosition);

                //create banker in the spawning position
                this._player = new Banker();
                this._player.setPosition(this.getSpawnPoint());
                this.addChild(this._player, this._player.zOrder, GH.UNIT_TAG.PLAYER);


                //Load enemies and money form the h
                this.initHobos();
                this.initMoney();

                this.initBackground();

            // accept touch now!
            if( 'keyboard' in sys.capabilities )
                this.setKeyboardEnabled(true);


            // schedule
            this.scheduleUpdate();

            bRet = true;


        }

        return bRet;

    },
    initBackground:function(){

            //background
            var groundBck = cc.LayerGradient.create();
            //var groundBck = cc.LayerGradient.create(cc.c3b(51,51,51),cc.c3b(220,180,0), cc.p(0,1));//not working
            groundBck.setStartColor(cc.c3b(51,51,51));
            groundBck.setEndColor(cc.c3b(170,180,170));
            groundBck.setVector(cc.p(0,1));
            //var groundBck = cc.LayerColor.create();
            groundBck.setColor(cc.c3b(123,132,118));
            groundBck.changeWidthAndHeight(32*this.tileMap.getMapSize().width, 32*2);
            groundBck.setAnchorPoint(cc.p(0,0));
            this.addChild(groundBck, 0, 0);
            
            var skyBck = cc.LayerGradient.create();
            skyBck.setStartColor(cc.c3b(20,151,251));
            skyBck.setEndColor(cc.c3b(20,40,80));
            skyBck.setVector(cc.p(0,1));
            //skyBck.setColor(cc.c3b(123,132,118));
            skyBck.changeWidthAndHeight(32*this.tileMap.getMapSize().width, 32*13);
            skyBck.setAnchorPoint(cc.p(0,0));
            skyBck.setPosition(cc.p(0,32*2));
            this.addChild(skyBck, 0, 0);
    },
    /* Map keys */
    onKeyDown:function (e) {
        GH.KEYS[e] = true;
    },

    onKeyUp:function (e) {
        GH.KEYS[e] = false;
    },
    update:function (dt) {
        if( this._state == STATE_PLAYING ) {
            this.updatePosition(dt);
            this.checkIsCollide();
            this.removeInactiveUnit(dt);
            this.checkIsReborn();
            this.updateUI();
        }
    },
    updateUI:function () {
        //g_sharedHudLayer._lbLife.setString(GH.LIFE + '');
        if(this._player)
            g_sharedHudLayer.lbScore.setString("Cash: " + this._player.HP + "$");
        g_sharedHudLayer.updateSpellLockIcons();
    },
    
    // control the position of enemies, run steering behaviors
    updatePosition:function( dt ) {
        for (i = 0; i < GH.CONTAINER.ENEMIES.length; i++) {
            var movementComponent = GH.CONTAINER.ENEMIES[i];

            movementComponent.updatePosition( dt, this._player.getPosition() );
        }
    },

    /* Collision system */
    checkIsCollide:function () {
        var selChild, bulletChild;
        // check collide
        var i =0;

        //Hobos collision handling
        for (i = 0; i < GH.CONTAINER.ENEMIES.length; i++) {
            selChild = GH.CONTAINER.ENEMIES[i];
			if(!selChild.active)
				continue;

            // collide with a commodity casted by the banker
            for (var j = 0; j < GH.CONTAINER.PLAYER_BULLETS.length; j++) {
                bulletChild = GH.CONTAINER.PLAYER_BULLETS[j];
                if (bulletChild.active && this.collide(selChild, bulletChild)) {
                    bulletChild.hurt(); //This is the way commodities are consumed
                    selChild.hurt();
                }
            }

            //Collide with the banker
            if ( this.collide(selChild, this._player) && selChild.isHomeless()) {
                if (this._player.active) {
                    this._player.hurt(); //player looses money
                }
            }
		}

        //Game items collision handling
        for (i = 0; i < GH.CONTAINER.ENEMY_BULLETS.length; i++) {
            selChild = GH.CONTAINER.ENEMY_BULLETS[i];
            if (selChild.active && this.collide(selChild, this._player)) {
                if (this._player.active) {
                    this._player.heal(selChild.commodityValue);
                    selChild.destroy();
                }
            }
        }
        
        //check if player enters business school
        if(this._player.active && this.collide(this.businessDoor, this._player)){
            //this.unscheduleUpdate();
            this._state = STATE_PAUSE;
            this.onBusinessSchool()
        }
    },
    collide:function (a, b) {
		var pos1 = a.getPosition();
		var pos2 = b.getPosition();
		if(Math.abs(pos1.x - pos2.x) > MAX_CONTAINT_WIDTH || Math.abs(pos1.y - pos2.y) > MAX_CONTAINT_HEIGHT)
			return false;

		var aRect = a.collideRect(pos1);
		var bRect = b.collideRect(pos2);
		return cc.rectIntersectsRect(aRect, bRect);
    },
    removeInactiveUnit:function (dt) {

        var selChild,children = this._texTransparentBatch.getChildren();
        for(var i in children){
            selChild = children[i];
            if (selChild && selChild.active){
                selChild.update(dt);
            }
        }
     },
    checkIsReborn:function () {
        if (GH.LIFE > 0 && !this._player.active) {
			this._player.born();
        }
        else if (GH.LIFE <= 0 && !this._player.active) {
            this._state = STATE_GAMEOVER;
            // XXX: needed for JS bindings.
            this._player = null;
            this.runAction(cc.Sequence.create(
                cc.DelayTime.create(0.2),
                cc.CallFunc.create(this.onGameOver, this)));
        }
    },
    getSpawnPoint:function(){
                      var _point;
                      if(this.tileMap){
                          //get spawn position
                          var group = this.tileMap.getObjectGroup("doors");
                          var objectDoors = group.getObjects();
                          var that = this;
                          objectDoors.forEach(function(objectDoor){
                              if(objectDoor.type === "spawn"){
                              _point = new cc.p(objectDoor.x + objectDoor.width/2, 
                                  objectDoor.y + objectDoor.height/2);
                              }else if(objectDoor.type === "exit"){
                                that.businessDoor = cc.Node.create();
                                that.businessDoor.setPosition(cc.p(objectDoor.x,
                                        objectDoor.y));
                                that.businessDoor.collideRect = function(){
                                    return cc.rect(objectDoor.x - objectDoor.width/2, objectDoor.y - objectDoor.height/2, objectDoor.width, objectDoor.height/2);};
                              }
                              });

                          return _point;
                      }
     },
   setViewPointCenter:function(position){

                         var tileMapSize = this.tileMap.getMapSize();

                         var x = Math.max(position.x, winSize.width/2);
                         var y = Math.max(position.y, winSize.height/2);

                         x = Math.min(x, (tileMapSize.width * tileMapSize.width) - winSize.width/2);
                         y = Math.min(y, (tileMapSize.height * tileMapSize.height) - winSize.height/4);
                         var actualPosition = cc.p(x,y);
                         
                         var centerOfView = cc.p(winSize.width/2, winSize.height*0.25);
                         var viewPoint = cc.pSub(centerOfView, actualPosition);
                         this.setPosition(viewPoint);

                      },
   initHobos:function(){
       if (this.tileMap) {
            var objectGroupHobos = this.tileMap.getObjectGroup("hobos");
            var objectHobos = objectGroupHobos.getObjects();
            this.numberOfHobos = objectHobos.length;
            objectHobos.forEach(function(objectHobo){
               var hobo;
               if(objectHobo.name === "hobo"){
                   hobo = Hobo.getOrCreateHobo(EnemyType[0]);
               }else if(objectHobo.name === "citizien"){
                   hobo = Hobo.getOrCreateHobo(EnemyType[1]);
               }

               hobo.setPosition(cc.p(objectHobo.x + objectHobo.width/2, 
                       objectHobo.y + objectHobo.height/2));
            });
       }
   },
   initMoney:function(){
       if (this.tileMap) {
            var objectGroupHobos = this.tileMap.getObjectGroup("money");
            var objectHobos = objectGroupHobos.getObjects();
            this.numberOfHobos = objectHobos.length;
            objectHobos.forEach(function(objectHobo){
               var hobo;
               if(objectHobo.name === "money"){
                   hobo = Commodity.getOrCreateCommodity(999,"bag-money.png",25,0,
                       GH.UNIT_TAG.ENEMY_BULLETS);
               }

               hobo.setPosition(cc.p(objectHobo.x + objectHobo.width/2, 
                       objectHobo.y + objectHobo.height/2));
            });
       }
   },
    onGameOver:function () {
        var scene = cc.Scene.create();
        scene.addChild(GameOver.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    onBusinessSchool:function(){
        var scene = cc.Scene.create();
        scene.addChild(BusinessSchool.create());
        //cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
        cc.Director.getInstance().pushScene(cc.TransitionFade.create(1.2, scene));

        //set player in spawn position
        this._player.setPosition(this.getSpawnPoint());
     }

});

MainLayer.create = function(){
    var sg = new MainLayer();
    if (sg && sg.init()){
        return sg;
    }
    return null;

};

MainLayer.scene = function(){
    var scene = cc.Scene.create();
    var layer = MainLayer.create();
    var hud = HudLayer.create();

    scene.addChild(layer);
    scene.addChild(hud);
    return scene;
};

MainLayer.prototype.addCommodity = function (bullet, zOrder ,tag) {
    this._texTransparentBatch.addChild(bullet,zOrder,tag);
    
};

MainLayer.prototype.addCommodityHits = function (hit, zOrder) {
	this._texTransparentBatch.addChild(hit, zOrder);
};

MainLayer.prototype.addHobo = function (hobo,z,tag){
    this._texTransparentBatch.addChild(hobo,z,tag);
};

