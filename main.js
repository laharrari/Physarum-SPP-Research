var SIMULATION = new Simulation();
var ASSET_MANAGER = new AssetManager();
var NODE_MAP;

ASSET_MANAGER.queueDownload("./img/physarum.jpg");
ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    document.body.style.backgroundColor = "lightblue";
    GAME_ENGINE.init(ctx);
    GAME_ENGINE.start();
    GAME_ENGINE.addEntity(SIMULATION);
    var speedSlider = document.getElementById("speedSlider");
    speedSlider.addEventListener("change", function () {
        tickDelay = maxTickDelay - speedSlider.value;
        SIMULATION.maxCounter = tickDelay;
        canvas.focus();
    }, false);
    NODE_MAP = new NodeMap();
    canvas.focus();
});
