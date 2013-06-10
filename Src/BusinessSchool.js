
var BusinessSchool = cc.LayerColor.extend({
    _ship:null,
    _lbScore:0,
    lbPurchaseMessage:null,
    init:function () {
        var bRet = false;
        if (this._super()) {

            this.setColor(cc.c3b(120,180,250));

            var bck = cc.LayerGradient.create();
            bck.setStartColor(cc.c3b(20,151,251));
            bck.setEndColor(cc.c3b(20,40,80));
            bck.setVector(cc.p(0,1));
            bck.setColor(cc.c3b(123,132,118));

            /* Banners and cash info */
            var lbWelcome = cc.LabelTTF.create("Welcome to the wizard school.\nLearn new spells to trade with the\ncitizens of the lands of Bankia","Arial Bold",28);
            lbWelcome.setPosition(centerPos.x,winSize.height*0.9);
            lbWelcome.setColor(cc.c3b(30,37,75));
            this.addChild(lbWelcome,10);

            this.lbScore = cc.LabelBMFont.create("Mana available: " + g_sharedGameLayer._player.HP + "$", s_arial14_fnt);
            this.lbScore.setColor(cc.c3b(25,100,220));
            this.lbScore.setAnchorPoint( cc.p(0,0) );
            this.lbScore.setAlignment( cc.TEXT_ALIGNMENT_LEFT );
            this.addChild(this.lbScore, 1200);
            this.lbScore.setPosition(winSize.width*0.8 , winSize.height*0.50);
            
            this.lbPurchaseMessage = cc.LabelTTF.create("You don't have enough energy for that spell", 24);
            this.lbPurchaseMessage.setPosition(centerPos.x, winSize.height*0.10);
            this.lbPurchaseMessage.setColor(cc.c3b(30,37,75));
            this.addChild(this.lbPurchaseMessage);

            //Menu to purchase spells
            //item 1: can of beans
            var canNormal = cc.Sprite.createWithSpriteFrameName("can.png");
            var canSelected = cc.Sprite.createWithSpriteFrameName("can.png");
            var canDisabled = cc.Sprite.createWithSpriteFrameName("can.png");

            var CanButton = cc.MenuItemSprite.create(canNormal, canSelected, canDisabled, function(){
                this.onCanButton();
            }.bind(this) );
            CanButton.setPosition(winSize.width*0.25, 260);
            var canPriceTag = cc.LabelBMFont.create("Beans\n5$", s_arial14_fnt);
            canPriceTag.setPosition( winSize.width * 0.25, 220);
            this.addChild(canPriceTag);

            //item 2: clothes
            var clothesNormal = cc.Sprite.createWithSpriteFrameName("clothes.png");
            var clothesSelected = cc.Sprite.createWithSpriteFrameName("clothes.png");
            var clothesDisabled = cc.Sprite.createWithSpriteFrameName("clothes.png");

            var ClothesButton = cc.MenuItemSprite.create(clothesNormal, clothesSelected, clothesDisabled, function(){
                this.onClothesButton();
            }.bind(this) );
            ClothesButton.setPosition(winSize.width* 0.45, 260);
            var clothesPriceTag = cc.LabelBMFont.create("Clothes\n25$", s_arial14_fnt);
            clothesPriceTag.setPosition( winSize.width * 0.45, 220);
            this.addChild(clothesPriceTag);

            //item 3: phone
            var phoneNormal = cc.Sprite.createWithSpriteFrameName("phone.png");
            var phoneSelected = cc.Sprite.createWithSpriteFrameName("phone.png");
            var phoneDisabled = cc.Sprite.createWithSpriteFrameName("phone.png");

            var PhoneButton = cc.MenuItemSprite.create(phoneNormal, phoneSelected, phoneDisabled, function(){
                this.onPhoneButton();
            }.bind(this) );
            PhoneButton.setPosition(winSize.width* 0.65, 260);
            var phonePriceTag = cc.LabelBMFont.create("phone\n500$", s_arial14_fnt);
            phonePriceTag.setPosition( winSize.width * 0.65, 220);
            this.addChild(phonePriceTag);


            //item 4: tele
            var teleNormal = cc.Sprite.createWithSpriteFrameName("tele.png");
            var teleSelected = cc.Sprite.createWithSpriteFrameName("tele.png");
            var teleDisabled = cc.Sprite.createWithSpriteFrameName("tele.png");

            var teleButton = cc.MenuItemSprite.create(teleNormal, teleSelected, teleDisabled, function(){
                this.onTeleButton();
            }.bind(this) );
            teleButton.setPosition(winSize.width* 0.25, 160);
            var telePriceTag = cc.LabelBMFont.create("Telley\n5.000$", s_arial14_fnt);
            telePriceTag.setPosition( winSize.width * 0.25, 120);
            this.addChild(telePriceTag);


            //item 5:car
            var carNormal = cc.Sprite.createWithSpriteFrameName("car.png");
            var carSelected = cc.Sprite.createWithSpriteFrameName("car.png");
            var carDisabled = cc.Sprite.createWithSpriteFrameName("car.png");

            var CarButton = cc.MenuItemSprite.create(carNormal, carSelected, carDisabled, function(){
                this.onCarButton();
            }.bind(this) );
            CarButton.setPosition(winSize.width* 0.45, 160);
            var carPriceTag = cc.LabelBMFont.create("Car\n50.000$", s_arial14_fnt);
            carPriceTag.setPosition( winSize.width * 0.45, 120);
            this.addChild(carPriceTag);
            
            
            //item 6: diamond
            var diamondNormal = cc.Sprite.createWithSpriteFrameName("diamond.png");
            var diamondSelected = cc.Sprite.createWithSpriteFrameName("diamond.png");
            var diamondDisabled = cc.Sprite.createWithSpriteFrameName("diamond.png");

            var DiamondButton = cc.MenuItemSprite.create(diamondNormal, diamondSelected, diamondDisabled, function(){
                this.onDiamondButton();
            }.bind(this) );
            DiamondButton.setPosition(winSize.width* 0.65, 160);
            var diamondPriceTag = cc.LabelBMFont.create("Diamond\n500.000$", s_arial14_fnt);
            diamondPriceTag.setPosition( winSize.width * 0.65, 120);
            this.addChild(diamondPriceTag);
            
            //Return button
            var returnSprite = cc.Sprite.createWithSpriteFrameName("return.png");
            var returnSelected = cc.Sprite.createWithSpriteFrameName("return.png");
            var returnDisabled = cc.Sprite.createWithSpriteFrameName("return.png");
            var returnButton = cc.MenuItemSprite.create(returnSprite, returnSelected, returnDisabled, function(){
                this.onReturnButton();
            }.bind(this));
            returnButton.setPosition(winSize.width * 0.9, winSize.height * 0.1);
            
            
            //Create menu with all the items
            var menu = cc.Menu.create(CanButton, ClothesButton, PhoneButton,
                    teleButton, CarButton, DiamondButton,
                    returnButton
                    );
            this.addChild(menu, 1, 2);
            //menu.setPosition(winSize.width / 2, 240);
            menu.setPosition(0, 0);
            //menu.alignItemsHorizontallyWithPadding(20);

            bRet = true;
        }
        return bRet;
    },
    onCanButton:function (pSender) {
        console.log("Buy a can of beans");
        if(CommodityType[0].locked === true){
          if(g_sharedGameLayer._player.HP >= 5){
              g_sharedGameLayer._player.HP -= 5;
              this.lbPurchaseMessage.setString("You've learnt to cast Can");
              CommodityType[0].locked = false;
          }else{
              this.noCash();
          }
         }else{
             this.alreadyHave();
         }
        this.updateCash();
    },
    onClothesButton:function(pSender){
        if(CommodityType[1].locked === true){
          if(g_sharedGameLayer._player.HP >= 25){
              g_sharedGameLayer._player.HP -= 25;
              this.lbPurchaseMessage.setString("You've learnt to cast Clothes");
              CommodityType[1].locked = false;
          }else{
              this.noCash();
          }
        }else{
            this.alreadyHave();
        }
        this.updateCash();
    },
    onPhoneButton:function(pSender){
        if(CommodityType[2].locked === true){
          if(g_sharedGameLayer._player.HP >= 500){
              g_sharedGameLayer._player.HP -= 500;
              this.lbPurchaseMessage.setString("You've learnt to cast Phone");
              CommodityType[2].locked = false;
          }else{
              this.noCash();
          }
        }else{
            this.alreadyHave();
        }
        this.updateCash();
    },
    onTeleButton:function(pSender){
        if(CommodityType[3].locked === true){
          if(g_sharedGameLayer._player.HP >= 5000){
              g_sharedGameLayer._player.HP -= 5000;
              this.lbPurchaseMessage.setString("You've learnt to cast Telly");
              CommodityType[3].locked = false;
          }else{
              this.noCash();
          }
        }else{
            this.alreadyHave();
        }
        this.updateCash();
      },
    onCarButton:function(pSender){
        if(CommodityType[4].locked === true){
          if(g_sharedGameLayer._player.HP >= 50000){
              g_sharedGameLayer._player.HP -= 50000;
              this.lbPurchaseMessage.setString("You've learnt to cast Car");
              CommodityType[4].locked = false;
          }else{
              this.noCash();
          }
        }else{
            this.alreadyHave();
        }
        this.updateCash();
     },
    onDiamondButton:function(pSender){
        if(CommodityType[5].locked === true){
                     console.log("Buy a diamond");
          if(g_sharedGameLayer._player.HP >= 500000){
              g_sharedGameLayer._player.HP -= 500000;
              this.lbPurchaseMessage.setString("You've learnt to cast Diamonds");
              CommodityType[5].locked = false;
          }else{
              this.noCash();
          }
        }else{
            this.alreadyHave();
        }
        this.updateCash();
                 },
    onReturnButton:function(){
        cc.Director.getInstance().popScene();
        g_sharedGameLayer._state = STATE_PLAYING;
        g_sharedHudLayer.updateSpellLockIcons();
    },
    noCash:function(){
               this.lbPurchaseMessage.setString("Not enough mana");
           },
    alreadyHave:function(){
               this.lbPurchaseMessage.setString("You already know that spell");
                },
    updateCash:function(){
            this.lbScore.setString("Mana available: " + 
                    g_sharedGameLayer._player.HP + "$");
            //this.lbScore.runAction(GH.getSwellAction());
    },

});

BusinessSchool.create = function () {
    var sg = new BusinessSchool();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

BusinessSchool.scene = function () {
    var scene = cc.Scene.create();
    var layer = BusinessSchool.create();
    scene.addChild(layer);
    return scene;
};
