var Fraction = algebra.Fraction;
var Expression = algebra.Expression;
var Equation = algebra.Equation;
var GAME_ENGINE = new GameEngine();
var SIMULATION = new Simulation();
var EDGES = [];
var NODES = [];
var NODE_RELATIONS = new Map();
var EDGE_RELATIONS = new Map();
var NODE_MAP = new NodeMap();

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
function Node(x, y, theNodeLabel, theIsFoodSource) {
    this.pressure = (theNodeLabel === 2) ? 0 : 1;
    this.x = x;
    this.y = y;
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
    //holds augmented matrix for pressure 
    var gauss = [];
    for (let i = 0; i < NODES.length; i++) {
        var currentNode = NODES[i];
        //get all edges with the current node
        var connectingEdgeArray = EDGE_RELATIONS.get(currentNode.nodeLabel);
        //holds equation created from each node
        var tempGauss = [];

        for (let x = 0; x < NODES.length; x++) {
            tempGauss[x] = 0;
        }

        for (let j = 0; j < connectingEdgeArray.length; j++) {
            var edge = connectingEdgeArray[j];
            var nodeI, nodeJ;
            //current node is always j set to j when doing creating equation
            if (currentNode.nodeLabel === edge.startNode.nodeLabel) {
                nodeI = edge.endNode;
                nodeJ = edge.startNode;
            } else {
                nodeI = edge.startNode;
                nodeJ = edge.endNode;
            }
            console.log("node i: " + nodeI.nodeLabel + ", node pressure I: " + nodeI.pressure);
            console.log("node j: " + nodeJ.nodeLabel + ", node pressure J: " + nodeJ.pressure);
            //creates left hand side of equation
            tempGauss[nodeI.nodeLabel - 1] += (edge.conductivity / edge.length * (nodeI.pressure));
            tempGauss[nodeJ.nodeLabel - 1] += (edge.conductivity / edge.length * -(nodeJ.pressure));
        }
        console.log("");
        //adds the right side of augmented matrix
        if (currentNode.nodeLabel === 2) {
            tempGauss.push(1);
        } else if (currentNode.nodeLabel === 1) {
            tempGauss.push(-1);
        } else {
            tempGauss.push(0);
        }
        gauss.push(tempGauss);
    }
    console.log(gauss);
    var answer = GaussianElimination(gauss);
    console.log(answer);
    for (let i = 0; i < NODES.length; i++) {
        console.log("p" + NODES[i].nodeLabel + ": " + NODES[i].pressure);
    }
}

/**
 * Adds an edge to the system and updates the edge relations array.
 * 
 * @param {*} theConductivity conductivity of edge
 * @param {*} theLength length of edge
 * @param {*} theStartNode start node of the adge
 * @param {*} theEndNode end node of the edge
 */
function addEdge(theConductivity, theLength, theStartNode, theEndNode) {
    var newEdge = new Edge(theConductivity, theLength, theStartNode, theEndNode);
    EDGES.push(newEdge);

    // Variable to remember previous values of a key in the map NODE_RELATIONS.
    var startMapVals = [];
    var endMapVals = [];
    // If key already exists grab previous values of the key.
    if (EDGE_RELATIONS.has(theStartNode.nodeLabel)) {
        startMapVals = EDGE_RELATIONS.get(theStartNode.nodeLabel);
    }
    if (EDGE_RELATIONS.has(theEndNode.nodeLabel)) {
        endMapVals = EDGE_RELATIONS.get(theEndNode.nodeLabel);
    }
    // Push the new label into startMapVals.
    startMapVals.push(newEdge);
    // Update NODE_RELATIONS key for start node.
    EDGE_RELATIONS.set(theStartNode.nodeLabel, startMapVals);

    // Push the new label into endMapVals.
    endMapVals.push(newEdge);
    // Update EDGE_RELATIONS key for the end node.
    EDGE_RELATIONS.set(theEndNode.nodeLabel, endMapVals);
}

//Temporarily in main
/** Solve a linear system of equations given by a n&times;n matrix
    with a result vector n&times;1. */
function GaussianElimination(A) {
    var n = A.length;
    console.log(A);
    for (var i = 0; i < n; i++) {
        if (A[i][i] != 0) {
            // Search for maximum in this column
            var maxEl = Math.abs(A[i][i]);
            var maxRow = i;
            for (var k = i + 1; k < n; k++) {
                if (Math.abs(A[k][i]) > maxEl) {
                    maxEl = Math.abs(A[k][i]);
                    maxRow = k;
                }
            }

            // Swap maximum row with current row (column by column)
            for (var k = i; k < n + 1; k++) {
                var tmp = A[maxRow][k];
                A[maxRow][k] = A[i][k];
                A[i][k] = tmp;
            }

            // Make all rows below this one 0 in current column
            for (k = i + 1; k < n; k++) {
                var c = -A[k][i] / A[i][i];
                for (var j = i; j < n + 1; j++) {
                    if (i == j) {
                        A[k][j] = 0;
                    } else {
                        A[k][j] += c * A[i][j];
                    }
                }
            }
        }
    }

    // Solve equation Ax=b for an upper triangular matrix A
    var x = new Array(n);
    for (var i = n - 1; i > -1; i--) {
        if (A[i][i] != 0) {
            x[i] = A[i][n] / A[i][i];
            for (var k = i - 1; k > -1; k--) {
                A[k][n] -= A[k][i] * x[i];
            }
        }
    }
    return x;
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

    NODE_MAP.drawNodeMap();
});
