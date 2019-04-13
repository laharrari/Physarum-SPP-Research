var Fraction = algebra.Fraction;
var Expression = algebra.Expression;
var Equation = algebra.Equation;
var GAME_ENGINE = new GameEngine();
var SIMULATION = new Simulation();
var EDGES = [];
var NODES = [];
var NODE_RELATIONS = new Map();

function Simulation() {
    this.iterationCount = 1;
    this.stopSimulation = false;
}

Simulation.prototype.draw = function () {
    GAME_ENGINE.ctx.font = "20px Arial";
    GAME_ENGINE.ctx.fillStyle = "black";
    GAME_ENGINE.ctx.fillText("Iteration: " + this.iterationCount, 0, 20);
}

Simulation.prototype.update = function () {
    if (!this.stopSimulation) {
        this.nextIteration();
    }
}

/**
 * Next iteration in finding the shortest path.
 */
Simulation.prototype.nextIteration = function () {
    console.log("Iteration: " + this.iterationCount);
    calculateAllPressure();
    for (let i = 0; i < EDGES.length; i++) {
        var edge = EDGES[i];
        edge.calculateFlux();
        edge.calculateConductivity();
        console.log("Q" + edge.startNode.nodeLabel + edge.endNode.nodeLabel + ": " + edge.flux);
        console.log("D" + edge.startNode.nodeLabel + edge.endNode.nodeLabel + ": " + edge.conductivity);
        //condition to stop simulation: flux of one of the path converges to 0
        if (edge.conductivity < 0.0001 || edge.flux < 0.0001) {
            this.stopSimulation = true;
        }
    }
    // do not update last iteration count when condition to stop is met
    if (this.stopSimulation) {
        return;
    }
    this.iterationCount++;
    console.log("");
}

/**
 * Food source nodes and other nodes in the system.
 * 
 * @param {*} theNodeLabel the label number for the node
 * @param {*} theIsFoodSource boolean for whether the node is a food source or not
 */
function Node(theNodeLabel, theIsFoodSource) {
    this.pressure = 0;
    this.nodeLabel = theNodeLabel;
    this.isFoodSource = theIsFoodSource;
}

/**
 * Edge to handle the flow between nodes. Represented as a cyldrinical tube.
 * 
 * @param {*} conductivity the conductivity of the edge
 * @param {*} length the length of the edge
 * @param {*} startNode the starting node
 * @param {*} endNode the ending node
 */
function Edge(conductivity, length, startNode, endNode) {
    this.conductivity = conductivity; // D variable in the paper, the thickness of the tube.
    this.length = length; // L variable in the paper, the length of the tube.
    this.flux = 0; // Q variable in the paper, the flux of the tube between two nodes.
    this.startNode = startNode; // A starting node.
    this.endNode = endNode; // An ending node.

    // Explicitly declaring the two nodes as sharing an edge, having a relation.
    this.updateNodeRelations(this.startNode, this.endNode);
    this.updateNodeRelations(this.endNode, this.startNode);
}

/**
 * Method to calculate flux between two nodes, the Q variable in the paper.
 */
Edge.prototype.calculateFlux = function () {
    this.flux = (this.conductivity * (this.startNode.pressure - this.endNode.pressure)) / this.length;
}

/**
 * Method to calculate conductivity of an edge.
 */
Edge.prototype.calculateConductivity = function () {
    // Calculate the rate of change in conductivity.
    var rateOfChange = Math.abs(this.flux) - this.conductivity;
    // Update conductivity.
    this.conductivity += rateOfChange;
}

/**
 * Method to relate nodes via edges.
 */
Edge.prototype.updateNodeRelations = function (i, j) {
    // Variable to remember previous values of a key in the map NODE_RELATIONS.
    var mapVals = [];
    // If key already exists grab previous values of the key.
    if (NODE_RELATIONS.has(i.nodeLabel)) {
        mapVals = [NODE_RELATIONS.get(i.nodeLabel)];
    }
    // Push the new label into mapVals.
    mapVals.push(j.nodeLabel);
    // Update NODE_RELATIONS key.
    NODE_RELATIONS.set(i.nodeLabel, mapVals);
}

/**
 * Calculate pressure for all nodes.
 * HARDCODING FOR 4 NODES FOR NOW
 * CURRENTLY ONLY WORKS IF D AND L FOR THE TOP ARE THE SAME AND D AND L FOR THE BOTTOM ARE THE SAME
 * 
 * @param {*} theNodes list of all the nodes in the system
 */
function calculateAllPressure() {
    //pressure for sink node = 0
    NODES[1].pressure = 0;

    var edge1 = EDGES[2]; //M32
    var x1 = algebra.parse(edge1.conductivity + "/" + edge1.length + " * p3");// D32/L32(p3 - p2)

    var edge2 = EDGES[3]; // M42
    var x2 = algebra.parse(edge2.conductivity + "/" + edge2.length + " * p3");// D42/L42(p4 - p2)

    var summation = algebra.parse(x1 + "+" + x2);// D32/L32(p3 - p2) + D42/L42(p4 - p2)

    var eq = new Equation(summation, algebra.parse("1"));// D32/L32(p3 - p2) + D42/L42(p4 - p2) = 1
    var answer = eq.solveFor("p3"); //solve for p3, p3 = p4
    NODES[2].pressure = answer;
    NODES[3].pressure = answer;
    NODES[0].pressure = answer * 2; //p1 = 2p3

    for (let i = 0; i < NODES.length; i++) {
        console.log("p" + NODES[i].nodeLabel + ": " + NODES[i].pressure);
    }
}

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/physarum.jpg");

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    document.body.style.backgroundColor = "lightblue";
    GAME_ENGINE.init(ctx);
    GAME_ENGINE.start();
    GAME_ENGINE.addEntity(SIMULATION);

    // Creating all node objects
    var n1 = new Node(1, true);
    var n2 = new Node(2, true);
    var n3 = new Node(3, false);
    var n4 = new Node(4, false);

    NODES[0] = n1;
    NODES[1] = n2;
    NODES[2] = n3;
    NODES[3] = n4;

    // Creating all edge objects
    EDGES[0] = new Edge(1, 1, n1, n3);
    EDGES[1] = new Edge(1, 2, n1, n4);
    EDGES[2] = new Edge(1, 1, n3, n2);
    EDGES[3] = new Edge(1, 2, n4, n2);
});
