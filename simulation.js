/*Delay for simulation update. */
const maxTickDelay = 1.2;
var tickDelay = 0.3;

function Simulation() {
    this.iterationCount = 0;
    this.stopSimulation = false;
    this.counter = 0;
    this.maxCounter = tickDelay;
}

Simulation.prototype.draw = function () {
    if (NODE_MAP !== undefined) {
        NODE_MAP.drawNodeMap();
    }
}

Simulation.prototype.update = function () {
    if (!this.stopSimulation && !GAME_ENGINE.pause) {
        if (this.counter > this.maxCounter) {
            this.nextIteration();
            this.counter = 0;
        } else {
            this.counter += GAME_ENGINE.clockTick;
        }
    }
   
}

/**
 * Next iteration in finding the shortest path.
 */
Simulation.prototype.nextIteration = function () {
    this.iterationCount++;
    document.getElementById("iteration").innerHTML = this.iterationCount;
    console.log("Nodes:");
    console.table(NODES);
    console.log("Edges:");
    console.table(EDGES);
    console.log("Iteration: " + this.iterationCount);
    calculateAllPressure();
    for (let i = 0; i < EDGES.length; i++) {
        var edge = EDGES[i];
        edge.calculateFlux();
        edge.calculateConductivity();
        console.log("Q" + edge.startNode.nodeLabel + edge.endNode.nodeLabel + ": " + edge.flux);
        console.log("D" + edge.startNode.nodeLabel + edge.endNode.nodeLabel + ": " + edge.conductivity);
        //condition to stop simulation: flux of one of the path converges to 0
        if (edge.conductivity < 0.0001 || this.iterationCount > 100) {
            this.stopSimulation = true;
        }
    }
    // do not update last iteration count when condition to stop is met
    if (this.stopSimulation) {
        var state = document.getElementById("state");
        state.innerHTML = "Stopped";
        state.style.color = "red";
        return;
    }
    console.log("");
}