var cocos2dApp = cc.Application.extend({
    config:document['ccConfig'],
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup(this.config['tag']);
        //cc.Loader.getInstance().onloading = function () {
            //cc.LoaderScene.getInstance().draw();
        //};
        //cc.Loader.getInstance().onload = function () {
            //cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        //};
        //cc.Loader.getInstance().preload(g_ressources);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },
    applicationDidFinishLaunching:function () {
                                      if (cc.RenderDoesnotSupport()) {
                                          //show Information to user
                                          alert("Browser doesn't support Canvas or WebGL")
                                              return false;
                                      }
                                      // init director
        var director = cc.Director.getInstance();
        //director.enableRetinaDisplay(true);

        director.setDisplayStats(this.config['showFPS']);
        director.setAnimationInterval(1.0 / this.config['frameRate']);

        //load resoruces
        cc.LoaderScene.preload(g_ressources, function(){
            director.replaceScene(new this.startScene());
        }, this);
        
        //director.runWithScene(new this.startScene());
        
        director = cc.Director.getInstance();
        winSize = director.getWinSize();
        centerPos = cc.p( winSize.width/2, winSize.height/2 );
        return true;
    }
});
 
var director;
var winSize;
var centerPos;
var myApp = new cocos2dApp(MainLayer.scene);
