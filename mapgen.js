// Code provided by Dr. Chris Marriott.

var GAME_ENGINE = new GameEngine();
var EDGES = [];
var NODES = [];
//enum for the node types
const NODE_TYPES = {
    SOURCE: 'source',
    SINK: 'sink',
    OTHER: 'other'
}

// creating NodeMap of nodes
function NodeMap() {
    this.numsites = 4;
    this.reach = 0.5;
    
    //this.hardcodedSystem();
    this.randomSystem();

    console.log("Iteration: " + SIMULATION.iterationCount);
    for (let i = 0; i < EDGES.length; i++) {
        var edge = EDGES[i];
        console.log("D" + edge.startNode.nodeLabel + edge.endNode.nodeLabel + ": " + edge.conductivity);
        console.log("L" + edge.startNode.nodeLabel + edge.endNode.nodeLabel + ": " + edge.length);
    }
}

NodeMap.prototype.randomSystem = function () {
    // creating random nodes
    for (var i = 0; i < this.numsites; i++) {
        // calculating a random x and y to position the node
        var x = Math.random() * 1;
        var y = Math.random() * 1;
        var type;
        if (i === 0) {
            console.log("src")
            type = NODE_TYPES.SOURCE;
        } else if (i === 1) {
            type = NODE_TYPES.SINK;
        } else type = NODE_TYPES.OTHER;

        NODES.push(new Node(x, y, i + 1, type));
    }

    this.findSourceAndSink();

    // populating adjacency matrix for edges
    for (var i = 0; i < this.numsites; i++) {
        for (var j = i + 1; j < this.numsites; j++) {
            var nodeDist = distance(NODES[i], NODES[j]);
            if (nodeDist >= this.reach) {
                var conductivity = (Math.random() * 1) + 0.1;
                console.log("Random Conductivity: " + conductivity);
                if (NODES[i].nodeLabel === 2) {
                    addEdge(1, nodeDist, NODES[j], NODES[i]);
                } else {
                    addEdge(1, nodeDist, NODES[i], NODES[j]);
                } 
            }
        }
    }
}

NodeMap.prototype.hardcodedSystem = function () {
    // Creating all node objects
    var n1 = new Node(0.2, 0.5, 1, NODE_TYPES.SOURCE);
    var n2 = new Node(0.8, 0.5, 2, NODE_TYPES.SINK);
    var n3 = new Node(0.5, 0.2, 3, NODE_TYPES.OTHER);
    var n4 = new Node(0.5, 0.8, 4, NODE_TYPES.OTHER);

    NODES[0] = n1;
    NODES[1] = n2;
    NODES[2] = n3;
    NODES[3] = n4;

    // Creating all edge objects
    addEdge(2, 3, n1, n3);
    addEdge(1, 5, n1, n4);
    addEdge(2, 3, n3, n2);
    addEdge(1, 5, n4, n2);
}

NodeMap.prototype.findSourceAndSink = function () {
    //Ensures n1 is far most left node, and n2 is far most right node
    for (let i = 0; i < this.numsites; i++) {
        //makes far most left node the source
        if (NODES[i].x < NODES[0].x) {
            var tempNode = NODES[i];
            var tempLabel = NODES[i].nodeLabel;
            NODES[i] = NODES[0];
            NODES[0] = tempNode;
            NODES[0].nodeType = NODE_TYPES.SOURCE;
            NODES[i].nodeType = NODE_TYPES.OTHER;
            NODES[0].nodeLabel = NODES[i].nodeLabel;
            NODES[i].nodeLabel = tempLabel;
        }

        //makes far most right node the source
        if (NODES[i].x > NODES[1].x) {
            var tempNode = NODES[i];
            var tempLabel = NODES[i].nodeLabel;
            NODES[i] = NODES[1];
            NODES[1] = tempNode;
            NODES[1].nodeType = NODE_TYPES.SINK;
            NODES[i].nodeType = NODE_TYPES.OTHER;
            NODES[1].nodeLabel = NODES[i].nodeLabel;
            NODES[i].nodeLabel = tempLabel;
        }
    }
}

// drawing
NodeMap.prototype.drawNodeMap = function () {
    var x = 10;
    var y = 20;
    var w = 350;
    var h = 350;

    GAME_ENGINE.ctx.lineWidth = 1.0;
    //draws and colors all the edges
    GAME_ENGINE.ctx.beginPath();
    for (var i = 0; i < EDGES.length; i++) {
        var startNode = EDGES[i].startNode;
        var endNode = EDGES[i].endNode;
        GAME_ENGINE.ctx.beginPath();
        GAME_ENGINE.ctx.moveTo(w * startNode.x + x, h * startNode.y + y);
        GAME_ENGINE.ctx.lineTo(w * endNode.x + x, h * endNode.y + y);
        GAME_ENGINE.ctx.lineWidth = EDGES[i].conductivity * 7.5;

        var red = Math.floor((EDGES[i].flux) * 2 * 255);
        var green = Math.floor((EDGES[i].flux) * 2 * 255);
        var blue = Math.floor(255);
        if (red < 0) {
            red = 0;
            green = 0;
            blue = Math.floor(dist * 2 * 255);
        }
        GAME_ENGINE.ctx.strokeStyle = "rgb(" + red + "," + green + "," + blue + ")";
        
        GAME_ENGINE.ctx.stroke();
    }

    var sites = [];
    for (var i = 0; i < NODES.length; i++) sites.push(0);

    //Draws and colors all the nodes
    for (var i = 0; i < NODES.length; i++) {
        var node = NODES[i];
        GAME_ENGINE.ctx.beginPath();
        var rad = Math.max(node.pressure * 7.5, Math.min(2 * (1 + sites[i]), 50));
        GAME_ENGINE.ctx.arc(w * node.x + x, h * node.y + y, rad, 0, 2 * Math.PI, false);
        var dist = Math.sqrt(node.x * node.x + node.y * node.y) / Math.sqrt(2);
        var red = Math.floor((dist - 0.5) * 2 * 255);
        var green = Math.floor((dist - 0.5) * 2 * 255);
        var blue = Math.floor(255);
        if (red < 0) {
            red = 0;
            green = 0;
            blue = Math.floor(dist * 2 * 255);
        }
        
        GAME_ENGINE.ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
        GAME_ENGINE.ctx.fill();
        GAME_ENGINE.ctx.strokeStyle = "Black";
        GAME_ENGINE.ctx.stroke();

        GAME_ENGINE.ctx.font = "20px Arial";
        GAME_ENGINE.ctx.fillStyle = "Black";
        GAME_ENGINE.ctx.fillText(i + 1, node.x * 450 - 50, node.y * 450 - 25); // DONT FORGET TO FIX THIS *************************************
    }

    GAME_ENGINE.ctx.font = "18px Arial";
    GAME_ENGINE.ctx.fillStyle = "black";
}

/**
 * Food source nodes and other nodes in the system.
 * 
 * @param {*} theNodeLabel the label number for the node
 */
function Node(x, y, theNodeLabel, theNodeType) {
    this.pressure = 0;
    this.x = x;
    this.y = y;
    this.nodeLabel = theNodeLabel;
    this.edgeRelations = [];
    this.nodeType = theNodeType;
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
        var connectingEdgeArray = currentNode.edgeRelations;
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
    console.log(gauss);
    var answer = GaussianElimination(gauss);
    console.log(answer);
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
    console.log(newEdge);
    EDGES.push(newEdge);
    theStartNode.edgeRelations.push(newEdge);
    theEndNode.edgeRelations.push(newEdge);
}