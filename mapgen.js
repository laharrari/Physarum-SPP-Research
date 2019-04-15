// Code provided by Dr. Chris Marriott.



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

    // populating adjacency matrix, for edges?
    for (var i = 0; i < this.numsites; i++) {
        for (var j = i + 1; j < this.numsites; j++) {
            this.adjacencymatrix[i][j] = distance(this.nodelist[i], this.nodelist[j]) > this.reach ? 0 : 5 * distance(this.nodelist[i], this.nodelist[j]);
            this.adjacencymatrix[j][i] = distance(this.nodelist[i], this.nodelist[j]) > this.reach ? 0 : 5 * distance(this.nodelist[i], this.nodelist[j]);
        }
    }
}

// drawing
NodeMap.prototype.drawNodeMap = function() {
    var x = 10;
    var y = 20;
    var w = 500;
    var h = 500;
    
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