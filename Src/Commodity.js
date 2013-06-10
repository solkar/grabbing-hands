
DIAMOND_COST = 20;

var Commodity = cc.Sprite.extend({
    active:true,
    xVelocity:0,
    yVelocity:200,
    power:1,
    HP:1,
    moveType:null,
    zOrder:3000,
    commodityValue:GH.ENEMY_MOVE_TYPE.NORMAL,
    parentType:GH.BULLET_TYPE.PLAYER,
    weaponType:null,
    selfDestruction:5,
    ctor:function (timeToDestruction, weaponType, commodityValue) {
        this._super();

        this.selfDestruction = timeToDestruction;
        this.commodityValue = commodityValue;
        this.initWithSpriteFrameName(weaponType);
        this.weaponType = weaponType;
        this.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
							  
            //this.lbValue = cc.LabelBMFont.create(commodityValue + "$", s_arial14_fnt);
            //this.lbValue.setAnchorPoint( cc.p(0.5,0) );
            //this.lbValue.setAlignment( cc.TEXT_ALIGNMENT_CENTER );
            //g_sharedGameLayer.addChild(this.lbValue, 1000);
            //this.lbValue.setPosition(this.getPosition().x , 
                    //this.getContentSize().height*1.10);
        /*var tmpAction;
         switch (this.commodityValue) {
         case GH.ENEMY_MOVE_TYPE.NORMAL:
         tmpAction = cc.MoveBy.create(2, cc.p(this.getPosition().x, 400));
         break;
         case GH.ENEMY_ATTACK_MODE.TSUIHIKIDAN:
         tmpAction = cc.MoveTo.create(2, GameLayer.create()._ship.getPosition());
         break;
         }
         this.runAction(tmpAction);*/
    },
    _timeTick:0,
    update:function (dt) {
        var p = this.getPosition();
        p.x -= this.xVelocity * dt;
        this.setPosition( p );
		if (this.HP <= 0)
		{					  
			this.active = false;
			this.destroy();
		}

        //self destruction
        this._timeTick += dt;
        if (this._timeTick > 0.7*this.selfDestruction && 
                this.numberOfRunningActions() == 0) {
            this.runAction(cc.Blink.create(0.3*this.selfDestruction, 5));
        }else if(this._timeTick >= this.selfDestruction){
            this._timeTick = 0;
            this.active = false;
            this.destroy();
        }
    },
    destroy:function () {
                console.log("commodity destroy");
		var explode = HitEffect.getOrCreateHitEffect(this.getPosition(), Math.random()*360, 0.75);
		this.setPosition(g_hideSpritePos);
    },
    hurt:function () {
        this.HP--;
    },
    collideRect:function(p){
        var a = this.getContentSize();
        return cc.rect(p.x - a.width/2, p.y - a.height/2, a.width, a.height/2);
    }
});

Commodity.getOrCreateCommodity = function(timeToDestruction, weaponType, commodityValue, zOrder ,mode) {
	
	if(mode == GH.UNIT_TAG.PLAYER_BULLET)
	{
		for (var j = 0; j < GH.CONTAINER.PLAYER_BULLETS.length; j++) {
			selChild = GH.CONTAINER.PLAYER_BULLETS[j];
			if (selChild.active == false && selChild.weaponType === weaponType)
			{
				selChild.HP = 1;
                selChild._timeTick = 0;
				selChild.active = true;
				return selChild;
			}
		}
		
		var b = new Commodity(timeToDestruction, weaponType, commodityValue);
		g_sharedGameLayer.addCommodity(b, zOrder, mode);
		GH.CONTAINER.PLAYER_BULLETS.push(b);
		return b;
	}
	else
	{
		for (var j = 0; j < GH.CONTAINER.ENEMY_BULLETS.length; j++) {
			selChild = GH.CONTAINER.ENEMY_BULLETS[j];
			if (selChild.active == false && selChild.weaponType === weaponType)
			{
				selChild.HP = 1;
                selChild._timeTick = 0;
				selChild.active = true;
				return selChild;
			}
		}
		
		var b = new Commodity(timeToDestruction, weaponType, commodityValue);
		g_sharedGameLayer.addCommodity(b, zOrder, mode);
		GH.CONTAINER.ENEMY_BULLETS.push(b);
		return b;
	}
};
