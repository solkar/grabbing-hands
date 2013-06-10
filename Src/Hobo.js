var Hobo = cc.Sprite.extend({
    _currentRotation:0,
    appearPosition:cc.p(25,50),
    speed:150,
    zOrder:2000,
    isJumping:false,
    jumpLengthX:20,
    spriteDirection:1,
    active:true,
    HP:5,
    scoreValue:1,
    attackMode:null,
    enemyType:null,
    _hurtColorLife:0,
    ctor:function (arg) {
        this._super();

        this.HP = arg.HP;
        this.moveType = arg.moveType;
        this.scoreValue = arg.scoreValue;
        this.attackMode = arg.attackMode;
        this.enemyType = arg.type;

        this.initWithSpriteFrameName(arg.textureName);

        //Start moving around
        var range = (cc.RANDOM_MINUS1_1()*0.75 + 2.5) * this.getContentSize().width;
        var actionMove = cc.MoveBy.create( 4.0, cc.p(range, 0)); 
        var sequence = cc.Sequence.create(actionMove,
                actionMove.reverse());
        var movementLoop = cc.RepeatForever.create(sequence);
        this.runAction(movementLoop);
    },
    collideRect:function(p){
        var a = this.getContentSize();
        return cc.rect(p.x - a.width/2, p.y - a.height/2, a.width, a.height/2);
    },
    _timeTick:0,
    update:function (dt) {
               var p = this.getPosition();
               //if ((p.x < 0 || p.x > 320) && (p.y < 0 || p.y > 480))
               //{
                   //this.active = false;
               //}
               this._timeTick += dt;
               if (this._timeTick > 0.3) {
                   this._timeTick = 0;
                   if (this._hurtColorLife > 0) {
                       this._hurtColorLife--;
                   }
                   if (this._hurtColorLife == 1) {
                       this.setColor( cc.c3b(255,255,255) );
                   }
               }

               var p = this.getPosition();
               if (this.HP <= 0)
               {
                   this.active = false;
                   this.destroy();
               }

    },
    //Hobo took money away form the banker
    heal:function(){
          console.log("Hobo: this dollars are yummy");      
    },
    //Hobo picks up a commodity and has to produce dollars
    hurt:function(){
            if(this.enemyType == 0)
                return; //Hobos can't be killed

        this._hurtColorLife = 2;
        this.HP--;
        this.setColor( cc.c3b(255,0,0) );

        if(this.HP>0)
            this.shoot();
    },
    destroy:function () {
        this.shootKey();

        var pos = this.getPosition();

        //GH.SCORE += this.scoreValue;
		HitEffect.getOrCreateHitEffect(pos, Math.random()*360, 0.75);
        if(GH.SOUND){
            cc.AudioEngine.getInstance().playEffect(s_explodeEffect_mp3);
        }
		this.setPosition(g_hideSpritePos);
		this.stopAllActions();
		//this.unschedule(this.shoot);

        if (this.enemyType == 1) {
            var newHobo = Hobo.getOrCreateHobo(EnemyType[0]);
            newHobo.setPosition(pos);
        
        }
    },
    
    shoot:function () {
        var p = this.getPosition();
		var b = Commodity.getOrCreateCommodity(5, EnemyType[this.enemyType].bulletType, 
                EnemyType[this.enemyType].bulletValue,3000,GH.UNIT_TAG.ENMEY_BULLET);
        b.setPosition(p.x, p.y - this.getContentSize().height * 0.2);
    },
    shootKey:function(){
        var p = this.getPosition();
		var b = Commodity.getOrCreateCommodity(5, "key-regular.png", 100,
                3000,GH.UNIT_TAG.ENMEY_BULLET);
        b.setPosition(p.x, p.y - this.getContentSize().height * 0.2);
     },
    isHomeless:function(){
         if(this.enemyType == 0){
             return true;
         }else{
             return false;
         }
     },
});//end class

Hobo.getOrCreateHobo = function(arg) {
	for (var j = 0; j < GH.CONTAINER.ENEMIES.length; j++) {
		selChild = GH.CONTAINER.ENEMIES[j];
		
		if (selChild.active == false && selChild.hoboType == arg.type)
		{
			selChild.HP = arg.HP;
			selChild.active = true;
			selChild.moveType = arg.moveType;
			selChild.scoreValue = arg.scoreValue;
			selChild.attackMode = arg.attackMode;
			selChild._hurtColorLife = 0;
			selChild.setColor( cc.c3b(255,255,255) );
			
			return selChild;
		}
	}

	var addHobo = new Hobo(arg);
	g_sharedGameLayer.addHobo(addHobo, addHobo.zOrder, GH.UNIT_TAG.HOBO);
	GH.CONTAINER.ENEMIES.push(addHobo);
	return addHobo;
};
