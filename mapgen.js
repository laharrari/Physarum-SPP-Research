// Code provided by Dr. Chris Marriott.

var GAME_ENGINE = new GameEngine();
var EDGES = [];
var NODES = [];
var NODE_RELATIONS = new Map();
var EDGE_RELATIONS = new Map();

// creating NodeMap of nodes
function NodeMap() {
    this.numsites = 4;
    this.reach = 0.5;
    this.nodelist = [];
    this.adjacencymatrix = [];
    this.visited = [];
    for (var i = 0; i < this.numsites; i++) {
        this.adjacencymatrix.push([]);
        this.visited.push([]);
        var row = this.adjacencymatrix[i];
        var vrow = this.visited[i];
        for (var j = 0; j < this.numsites; j++) {
            row.push(0);
            vrow.push(0);
        }
    }

    // replace with adding nodes to nodelist
    for (var i = 0; i < this.numsites; i++) {
        // calculating a random x and y to position the node
        var x = Math.random() * 1;
        var y = Math.random() * 1;
        console.log("x: " + x);
        console.log("y: " + y);
        // determining if the node is a food source or not
        var foodSource = false;
        if (i === 0 || i === this.numsites - 1) {
            foodSource = true;
        }

        this.nodelist.push(new Node(x, y, i, foodSource));
    }

    // populating adjacency matrix for edges
    for (var i = 0; i < this.numsites; i++) {
        for (var j = i + 1; j < this.numsites; j++) {
            this.adjacencymatrix[i][j] = distance(this.nodelist[i], this.nodelist[j]) > this.reach ? 0 : 5 * distance(this.nodelist[i], this.nodelist[j]);
            this.adjacencymatrix[j][i] = distance(this.nodelist[i], this.nodelist[j]) > this.reach ? 0 : 5 * distance(this.nodelist[i], this.nodelist[j]);
        }
    }

    console.table(this.adjacencymatrix);
}

// drawing
NodeMap.prototype.drawNodeMap = function() {
    var x = 10;
    var y = 20;
    var w = 350;
    var h = 350;

    GAME_ENGINE.ctx.beginPath();
    GAME_ENGINE.ctx.strokeStyle = "Black";
    //GAME_ENGINE.ctx.rect(x, y, w, h);
    //GAME_ENGINE.ctx.stroke();
    GAME_ENGINE.ctx.lineWidth = 0.5;
    for (var i = 0; i < this.nodelist.length; i++) {
        for (var j = 0; j < this.nodelist.length; j++) {
            if (this.adjacencymatrix[i][j] !== 0) {
                var site1 = this.nodelist[i];
                var site2 = this.nodelist[j];
                GAME_ENGINE.ctx.beginPath();
                GAME_ENGINE.ctx.moveTo(w * site1.x + x, h * site1.y + y);
                GAME_ENGINE.ctx.lineTo(w * site2.x + x, h * site2.y + y);
                GAME_ENGINE.ctx.stroke();
            }
        }
    }
    GAME_ENGINE.ctx.lineWidth = 1.0;

    var sites = [];
    for (var i = 0; i < this.nodelist.length; i++) sites.push(0);

    for (var i = 0; i < this.nodelist.length; i++) {
        var site = this.nodelist[i];
        GAME_ENGINE.ctx.beginPath();
        var rad = Math.max(2, Math.min(2 * (1 + sites[i]), 50));
        GAME_ENGINE.ctx.arc(w * site.x + x, h * site.y + y, rad, 0, 2 * Math.PI, false);
        var dist = Math.sqrt(site.x * site.x + site.y * site.y) / Math.sqrt(2);
        var red = Math.floor((dist - 0.5) * 2 * 255);
        var green = Math.floor((dist - 0.5) * 2 * 255);
        var blue = Math.floor(255);
        if (red < 0) {
            red = 0;
            gree = 0;
            blue = Math.floor(dist * 2 * 255);
        }
        GAME_ENGINE.ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
        GAME_ENGINE.ctx.fill();
        GAME_ENGINE.ctx.strokeStyle = "Black";
        GAME_ENGINE.ctx.stroke();
    }

    GAME_ENGINE.ctx.font = "18px Arial";
    GAME_ENGINE.ctx.fillStyle = "black";

    var offset = 1.1 * w;
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
            //current node is always set to j when creating equation
            if (currentNode.nodeLabel === edge.startNode.nodeLabel) {
                nodeI = edge.endNode;
                nodeJ = edge.startNode;
            } else {
                nodeI = edge.startNode;
                nodeJ = edge.endNode;
            }
            // pressure variables, p2 always = 0, every other node = 1
            var pi = pj = 1;
            if (nodeI.nodeLabel === 2) {
                pi = 0;
            } 
            if (nodeJ.nodeLabel === 2) {
                pj = 0;
            }
            //creates left hand side of equation
            tempGauss[nodeI.nodeLabel - 1] += (edge.conductivity / edge.length * (pi));
            tempGauss[nodeJ.nodeLabel - 1] += (edge.conductivity / edge.length * -(pj));
        }
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
    var answer = GaussianElimination(gauss);
    //updates pressure for all nodes
    for (let y = 0; y < NODES.length; y++) {
        NODES[y].pressure = answer[y];
    }
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