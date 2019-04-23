function Simulation() {
    this.iterationCount = 0;
    this.stopSimulation = false;
    this.counter = 0;
    this.maxCounter = 0.3;
}

Simulation.prototype.draw = function () {
    GAME_ENGINE.ctx.font = "20px Arial";
    GAME_ENGINE.ctx.fillStyle = "black";
    GAME_ENGINE.ctx.fillText("Iteration: " + this.iterationCount, 0, 20);
    NODE_MAP.drawNodeMap();
}

Simulation.prototype.update = function () {
    if (!this.stopSimulation) {
        if (!GAME_ENGINE.pause && this.counter > this.maxCounter) {
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
        if (edge.conductivity < 0.0001 || edge.flux < 0.0001 || this.iterationCount > 100) {
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