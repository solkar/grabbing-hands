INIT_HP = 15;
//INIT_HP = 9999; //infinite ammo

var Banker = cc.Sprite.extend({
    _currentRotation:0,
    appearPosition:cc.p(25,50),
    speed:150,
    zOrder:3000,
    isJumping:false,
    jumpLengthX:20,
    spriteDirection:1,
    active:true,
    HP:15,
    canShoot:true,
    shootFrequency:0.5,
    _hurtColorLife:0,
    commoditySpell:null,
    //Initialize loading the spawn point from the tilemap
    ctor:function () {
        this._super();

        //init life
        this.initWithSpriteFrameName("banker-avatar.png");
        
        this.setTag(this.zOrder);
        this.setPosition(this.appearPosition);

        this.commoditySpell = CommodityType[0]; //Can is the default spell
        
        this.scheduleUpdate();

        this.born();
    },
    _timeTick:0,
    update:function(dt){

        // Keys are only enabled on the browser
        if( sys.platform == 'browser' ) {
            var pos = this.getPosition();
            if ((GH.KEYS[cc.KEY.w] || GH.KEYS[cc.KEY.up]) && pos.y <= winSize.height) {
                //pos.y += dt * this.speed;
                
            }
            if ((GH.KEYS[cc.KEY.s] || GH.KEYS[cc.KEY.down]) && pos.y >= 0) {
                //pos.y -= dt * this.speed;
            }
            if ((GH.KEYS[cc.KEY.a] || GH.KEYS[cc.KEY.left]) && pos.x >= 0) {
                pos.x -= dt * this.speed;
                this.spriteDirection = -1;
                this.setFlipX(true);
            }
            //if ((GH.KEYS[cc.KEY.d] || GH.KEYS[cc.KEY.right]) && pos.x <= winSize.width) {
            if ((GH.KEYS[cc.KEY.d] || GH.KEYS[cc.KEY.right]) && true) {
                pos.x += dt * this.speed;
                this.setFlipX(false);
                this.spriteDirection = 1;
            }
            //(duration, position, height, jumps)
            if ((GH.KEYS[cc.KEY.space] ) && this.isJumping == false) {
                this.isJumping = true;
                
                var jumpSequence = cc.Sequence.create(
                        cc.JumpBy.create(0.5, cc.p(this.jumpLengthX * this.spriteDirection,0) , 50, 1),
                        cc.CallFunc.create(function(){
                            this.isJumping = false;
                        }, this));
                this.runAction(jumpSequence);
                            
            }
            if (GH.KEYS[cc.KEY.enter]){
                    this.shoot();
            }
            this.setPosition( pos );
            g_sharedGameLayer.setViewPointCenter(pos);
        }
        
        //Player dies
        if (this.HP <= 0) {
            this.active = false;
            this.destroy();
        }

        //Return banker to the original color after a while
        this._timeTick += dt;
        if (this._timeTick > 0.25) {
            this._timeTick = 0;
            if (this._hurtColorLife > 0) {
                this._hurtColorLife--;
            }
            if (this._hurtColorLife == 1) {
                this.setColor(cc.c3b(255,255,255));
            }
        }        

     },
    collideRect:function(p){
        var a = this.getContentSize();
        return cc.rect(p.x - a.width/2, p.y - a.height/2, a.width, a.height/2);
    },
    born:function(){
          this.HP = INIT_HP;
          this.canShoot = true;

		//revive effect
		this.canBeAttack = false;
		//var ghostSprite = cc.Sprite.createWithSpriteFrameName("ship03.png");
		//ghostSprite.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
		//ghostSprite.setScale(8);
		//ghostSprite.setPosition(this.getContentSize().width / 2, 12);
		//this.addChild(ghostSprite, 3000, 99999);
		//ghostSprite.runAction(cc.ScaleTo.create(0.5, 1, 1));
		var blinks = cc.Blink.create(3, 9);
		var makeBeAttack = cc.CallFunc.create(function (t) {
											  t.canBeAttack = true;
											  //t.setVisible(true);
											  //t.removeChild(ghostSprite,true);
											  }.bind(this));
		this.runAction(cc.Sequence.create(cc.DelayTime.create(0.5), blinks, makeBeAttack));

		this._hurtColorLife = 0;
		this.setColor(cc.c3b(255,255,255));
		this.active = true;
          
    },
    destroy:function(){
        GH.LIFE--;

		HitEffect.getOrCreateHitEffect(this.getPosition(), Math.random()*360, 0.75);

        if (GH.SOUND) {
            cc.AudioEngine.getInstance().playEffect(s_shipDestroyEffect_mp3);
        }
                
    },
    //Banker looses money
    hurt:function(){
        if (this.canBeAttack) {
            this.canBeAttack = false;

            this._hurtColorLife = 2;
            this.HP -= 5;
            this.setColor(cc.c3b(255,0,0));

            //Show mana transactions
            g_sharedHudLayer.manaUpdate(5,false);

            //inmmunity for a while
            var blinks = cc.Blink.create(3, 9);
            var makeBeAttack = cc.CallFunc.create(function (t) {
                t.canBeAttack = true;
                t.setVisible(true);
                //t.removeChild(ghostSprite,true);
            }.bind(this));
            this.runAction(cc.Sequence.create(cc.DelayTime.create(0.5), blinks, makeBeAttack));
            
        }
    },
    //Banker picked up money
    heal:function(moneyVal){
             
         this.HP += moneyVal;
         g_sharedHudLayer.manaUpdate(moneyVal,true);
    },
    shoot:function () {
              if(this.commoditySpell.locked)
                  return;
              
              var spellCost = this.commoditySpell.manaCost;

              if(this.HP >= spellCost && this.canShoot){

                  //Disable shooting and schedule to enable it in the future
                  this.canShoot = false;
                  this.scheduleOnce(function(){
                      this.canShoot = true;},this.shootFrequency);


                  //substract mana from player HP
                  this.HP -= spellCost;

                  //show transaction
                  g_sharedHudLayer.manaUpdate(spellCost,false);

                  //creae a commodity and throw it away
                  //this.shootEffect();
                  var offset = 13 * this.spriteDirection;
                  var p = this.getPosition();
                  var cs = this.getContentSize();
                  var a = Commodity.getOrCreateCommodity(5, this.commoditySpell.textureName, 
                          0, 3000,GH.UNIT_TAG.PLAYER_BULLET);
                  a.setPosition(p.x + offset, p.y + 0 + cs.height * 0.0);

                  //jump action to simulate banker throwing the stuff
                  a.runAction(cc.JumpBy.create(0.5, cc.p(40 * this.spriteDirection, 0), 30,1));
              }else if(this.canShoot){
                  console.log("Not enough cash");
                  g_sharedHudLayer.manaEmpty();
              }
    },
    
});

