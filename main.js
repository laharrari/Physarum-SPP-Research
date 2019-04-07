var Fraction = algebra.Fraction;
var Expression = algebra.Expression;
var Equation = algebra.Equation;
var GAME_ENGINE = new GameEngine();

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
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


// Edge to handle the flow between nodes.
// Represented as a cylindrical tube.
function Edge(conductivity, length, startNode, endNode) {
    this.conductivity = conductivity; // D variable in the paper, the thickness of the tube.
    this.length = length; // L variable in the paper, the length of the tube.
    this.flux = 0; // Q variable in the paper, the flux of the tube between two nodes.
    this.startNode = startNode; // A starting node.
    this.endNode = endNode; // An ending node.
}

// Method to calculate flux between two nodes, the Q variable in the paper.
Edge.prototype.calculateFlux = function () {
    this.flux = (this.conductivity * (this.startNode.pressure - this.endNode.pressure)) / this.length;
}

Edge.prototype.calculateConductivity = function () {
    // Calculate the rate of change in conductivity.
    var rateOfChange = Math.abs(this.conductivity) - this.conductivity;
    // Update conductivity.
    this.conductivity -= rateOfChange;
}

/**
 * Calculate pressure for all nodes.
 * 
 * @param {*} theNodes list of all the nodes in the system
 */
function calculateAllPressure(theNodes) {
    //pressure for sink node = 0
    theNodes[theNodes.length - 1] = 0;
    for (let i = 0; i < theNodes.length - 1; i++) {

    }
}

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/physarum.jpg");

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
 
    GAME_ENGINE.init(ctx);
    GAME_ENGINE.start();
});
