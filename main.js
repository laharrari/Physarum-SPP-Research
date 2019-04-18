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

        // Creating all node objects
        var n1 = new Node(0, 0, 1, true);
        var n2 = new Node(0, 0, 2, true);
        var n3 = new Node(0, 0, 3, false);
        var n4 = new Node(0, 0, 4, false);
    
        NODES[0] = n1;
        NODES[1] = n2;
        NODES[2] = n3;
        NODES[3] = n4;
    
        // Creating all edge objects
        addEdge(1, 1, n1, n3);
        addEdge(1, 2, n1, n4);
        addEdge(1, 1, n3, n2);
        addEdge(1, 2, n4, n2);
        NODE_MAP = new NodeMap();
});
