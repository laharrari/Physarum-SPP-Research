var SIMULATION;
var ASSET_MANAGER = new AssetManager();
var NODE_MAP;
var myCanvas;
params = {alpha: 1, numsites: 6, reach: 0.5};

ASSET_MANAGER.queueDownload("./img/physarum.jpg");
ASSET_MANAGER.downloadAll(function () {
    myCanvas = document.getElementById('gameWorld');
    var ctx = myCanvas.getContext('2d');
    document.body.style.backgroundColor = "black";
    GAME_ENGINE.init(ctx);
    GAME_ENGINE.start();
    addHTMLListeners();
    setParams();
    myCanvas.focus();
});
