GH.KEYS = [];

GH.CONTAINER = {
    ENEMIES:[],
    ENEMY_BULLETS:[], //dollars that banker picks up
    PLAYER_BULLETS:[],//commodities that the hobos will seek
    EXPLOSIONS:[],
    SPARKS:[],
    HITS:[]
};

//life
GH.LIFE = 1;

//enemy move type
GH.ENEMY_MOVE_TYPE = {
    ATTACK:0,
    VERTICAL:1,
    HORIZONTAL:2,
    OVERLAP:3
};

//bullet type
GH.BULLET_TYPE = {
    PLAYER:1,
    ENEMY:2
};

//weapon type
GH.WEAPON_TYPE = {
    ONE:1
};

//unit tag
GH.UNIT_TAG = {
    ENMEY_BULLET:900,
    PLAYER_BULLET:901,
    ENEMY:1000,
    PLAYER:1000
};

//attack mode
GH.ENEMY_ATTACK_MODE = {
    NORMAL:1,
    TSUIHIKIDAN:2
};

GH.SPELL_LOCK = {
    CAN:true,
    CLOTHES:true,
    PHONE:true,
    TELE:true,
    CAR:true,
    DIAMOND:true,
}

var g_hideSpritePos = cc.p( -50, -50);

GH.getSwellAction = function(){
    var duration = 1.0;

    var scaleHorDown = cc.ScaleTo.create(duration * 5/30, 0.75, 1);
    var scaleHorBouncing = cc.EaseBounceIn.create(scaleHorDown);
    var scaleVerDown = cc.ScaleTo.create(duration * 5/30, 1.0, 0.65);
    var scaleVerBouncing = cc.EaseBounceInOut.create(scaleVerDown);

    var shrink = cc.Sequence.create(scaleHorBouncing,scaleVerBouncing);

    var swell = cc.ScaleTo.create(duration * 15/30, 1.10);
    var swellEase = cc.EaseElasticOut.create(swell);

    var resetScale = cc.ScaleTo.create(duration * 5/30,1.0);
    var resetScaleBouncing = cc.EaseInOut.create(resetScale);

    var sequence = cc.Sequence.create( shrink, swellEase, resetScaleBouncing);

    return sequence;

};
