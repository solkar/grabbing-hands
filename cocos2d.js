var GH = GH || {}; //sort of singleton

(function () {
    var d = document;
    var c = {
        menuType:'canvas',
    	COCOS2D_DEBUG:0,
    box2d:false,
    chipmunk:false,
    showFPS:false,
    frameRate:60,
    loadExtension:true,
    tag:'gameCanvas',

    engineDir:'./Platform/HTML5/cocos2d/',
    appFiles:[
    './Src/resource.js',
    './Src/config/GameConfig.js',
    './Src/MainLayer.js',
    './Src/main.js',
    './Src/banker.js',
    './Src/Hobo.js',
    './Src/Commodity.js',
    './Src/HitEffect.js',
    './Src/EnemyType.js',
    './Src/HudLayer.js',
    './Src/GameOver.js',
    './Src/CommodityType.js',
    './Src/BusinessSchool.js',
    ]
    };

    window.addEventListener('DOMContentLoaded', function(){
        var s = d.createElement('script');

        if(c.SingleEngineFile && !c.engineDir){
            s.src = c.SingleEngineFile;
        }
        else if(c.engineDir && !c.SingleEngineFile){
            s.src = c.engineDir + 'platform/jsloader.js';
        }
        else{
            alert('You must specify either single engine file OR the engine directory in "cocos2d.js"');
        }

    document.ccConfig = c;
    s.id = 'cocos2d-html5';
    d.body.appendChild(s);
    });

})();

