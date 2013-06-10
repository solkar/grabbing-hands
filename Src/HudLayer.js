var g_sharedHudLayer;

var HudLayer = cc.Layer.extend({
    lbScore:null,
    lbMessage:null,
    lbManaCost:null,
    numSpellAvailable:2,
    selectedSpell:0,
    _spellSelector:null,
    _spellLockSpriteArray:[],
    init:function () {
        var bRet = false;
        if (this._super()) {

            // score
            this.lbScore = cc.LabelBMFont.create("Mana: 0$", s_arial14_fnt);
            this.lbScore.setAnchorPoint( cc.p(0,0) );
            this.lbScore.setScale(1.25);
            this.lbScore.setAlignment( cc.TEXT_ALIGNMENT_LEFT );
            this.addChild(this.lbScore, 1000);
            //this.lbScore.setPosition(winSize.width*0.025 , winSize.height*0.80);
            this.lbScore.setPosition(60 , winSize.height*0.90);

            this.lbMessage = cc.LabelBMFont.create("+5$", s_arial14_fnt);
            this.lbMessage.setScale(1.25);
            this.lbMessage.setAnchorPoint(cc.p(0,0));
            this.lbMessage.setAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this.lbMessage.setVisible(false);
            this.lbMessage.setPosition(60, winSize.height*0.90 - 20);
            this.addChild(this.lbMessage, 1000);
            
            //label to show cost of the selected spell
            this.lbManaCost = cc.LabelBMFont.create("Mana cost -$", s_arial14_fnt);
            this.lbManaCost.setAnchorPoint(cc.p(1,0));
            this.lbManaCost.setAlignment(cc.TEXT_ALIGNMENT_RIGHT);
            this.lbManaCost.setPosition(winSize.width*0.75+34*5, 
                    winSize.height*0.90 - 40);
            this.addChild(this.lbManaCost, 1000);

            //banker life
            var life = cc.Sprite.createWithSpriteFrameName("banker-tile.png");
            life.setPosition(30, winSize.height*0.90);
            this.addChild(life, 1, 5);

            //spells
            for (var i = 0; i < CommodityType.length; i++) {
                this.addSpell(CommodityType[i].textureName,i);
            };


            //selected spell mark
            this._spellSelector = cc.Sprite.createWithSpriteFrameName("selected-tile.png");
            this._spellSelector.setPosition(this._spellLockSpriteArray[0].getPosition());
            this._spellSelector.setVisible(false);
            this.addChild(this._spellSelector, 1, 5);

            this.selectedSpell = 0;
            this.numSpellAvailable = 1;

            this.scheduleUpdate();

            bRet = true;
            
            g_sharedHudLayer = this;
        }
  
        return bRet;
    },
    _timeTick:0,
    update:function(dt){

        this._timeTick += dt;
        //Spell selection
        if( sys.platform == 'browser' ) {
            if (GH.KEYS[cc.KEY.shift] && this._timeTick > 0.5
                    && this._spellSelector.isVisible()) {

                this.selectedSpell++;

                while(CommodityType[this.selectedSpell].locked == true){
                    //increase index until an unlocked spell is found
                    if(this.selectedSpell == CommodityType.length - 1){
                        this.selectedSpell = 0;
                    }else{
                        this.selectedSpell++;
                    }
                }

                //set selected spell in the banker
                g_sharedGameLayer._player.commoditySpell = CommodityType[this.selectedSpell];

                //Update marker to show selected spell
                this._spellSelector.setPosition(cc.p(winSize.width*0.75 + 32*this.selectedSpell,
                            winSize.height*0.9));
                //Update mana cost
                this.manaCostUpdate(CommodityType[this.selectedSpell].manaCost);

                this._timeTick = 0;
                
            }
        }
    },
    addSpell:function(frameName, index){

            var spell = cc.Sprite.createWithSpriteFrameName(frameName);
            spell.setPosition(winSize.width*0.75 + 34*index, winSize.height*0.9);
            this.addChild(spell,1,5);

            var spellLocked = cc.Sprite.createWithSpriteFrameName("lock.png");
            spellLocked.setPosition(spell.getPosition());
            spellLocked.setVisible(CommodityType[index].locked);
            this.addChild(spellLocked,1);

            this._spellLockSpriteArray[index] = spellLocked;
     },
    updateSpellLockIcons:function(){
            
            for (var i = 0; i < CommodityType.length; i++) {
                var isLocked = CommodityType[i].locked;
                this._spellLockSpriteArray[i].setVisible(isLocked); //show lock icon
                
                if(!isLocked)
                    this._spellSelector.setVisible(true);
            }
    },
    manaUpdate:function(cash,sign){

                   //choose sign and color for the label
                   var signStr;
                   if (sign) {
                       this.lbMessage.setColor(cc.c3b(0,255,20));
                               signStr = "+";
                   }else{
                       this.lbMessage.setColor(cc.c3b(255,0,20));
                           signStr = "-";
                  }

                   //update banner and run action to highlight
                   this.lbMessage.setString(signStr + cash + "$");
                   this.lbMessage.runAction(cc.Sequence.create(
                               cc.ToggleVisibility.create(),
                               cc.Blink.create(1.0,5),
                               cc.ToggleVisibility.create()));
    },
    manaEmpty:function(){

                  this.lbMessage.setColor(cc.c3b(255,0,20));

                   //update banner and run action to highlight
                   this.lbMessage.setString("Not enough mana for that spell!");
                   this.lbMessage.runAction(cc.Sequence.create(
                               cc.ToggleVisibility.create(),
                               cc.Blink.create(2.0,3),
                               cc.ToggleVisibility.create()));
     },
    manaCostUpdate:function(manaCost){
                       this.lbManaCost.setString("Mana cost "+manaCost+"$");
                   }
});

HudLayer.create = function () {
    var sg = new HudLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

