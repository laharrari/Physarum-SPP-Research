// creating sitemap of nodes
var SiteMap = function (params, sitelist) {
    this.params = params;
    this.sitelist = [];
    this.adjacencymatrix = [];
    for (var i = 0; i < this.params.numsites; i++) {
        this.adjacencymatrix.push([]);
        var row = this.adjacencymatrix[i];
        for (var j = 0; j < this.params.numsites; j++) {
            row.push(0);
            vrow.push(0);
        }
    }

    // replace with adding nodes to sitelist
    for (var i = 0; i < this.params.numsites; i++) {
        // var type = Math.floor(Math.random() * 2) == 0 ? "FISH" : "NUTS";
        // var reward = sitelist ? sitelist[i].reward : this.params.rewardmin + Math.floor(Math.random() * (this.params.rewardmax - this.params.rewardmin + 1));
        // var x = sitelist ? sitelist[i].x : Math.random();
        // var y = sitelist ? sitelist[i].y : Math.random();
        // this.sitelist.push(new GatheringSite(this.params.permsize, reward, this.params.yield, type, i, x, y));

        // code to make nodes and edges and store them in necessary data structures.
        // gen nodes first
        // then gen edges
    }

    // populating adjacency matrix
    for (var i = 0; i < this.params.numsites; i++) {
        for (var j = i + 1; j < this.params.numsites; j++) {
            this.adjacencymatrix[i][j] = distance(this.sitelist[i], this.sitelist[j]) > this.params.reach ? 0 : 5 * distance(this.sitelist[i], this.sitelist[j]);
            this.adjacencymatrix[j][i] = distance(this.sitelist[i], this.sitelist[j]) > this.params.reach ? 0 : 5 * distance(this.sitelist[i], this.sitelist[j]);
        }
    }
}

// drawing
SiteMap.prototype.drawSiteMap = function() {
    ctx.beginPath();
    ctx.strokeStyle = "Black";
    //ctx.rect(x, y, w, h);
    //ctx.stroke();
    ctx.lineWidth = 0.5;
    for (var i = 0; i < this.map.sitelist.length; i++) {
        for (var j = 0; j < this.map.sitelist.length; j++) {
            if (this.map.adjacencymatrix[i][j] !== 0) {
                var site1 = this.map.sitelist[i];
                var site2 = this.map.sitelist[j];
                ctx.beginPath();
                ctx.moveTo(w * site1.x + x, h * site1.y + y);
                ctx.lineTo(w * site2.x + x, h * site2.y + y);
                ctx.stroke();
            }
        }
    }
    ctx.lineWidth = 1.0;

    var sites = [];
    for (var i = 0; i < this.map.sitelist.length; i++) sites.push(0);

    for (var i = 0; i < this.p.agents.length; i++) {
        sites[this.p.agents[i].site]++;
    }

    for (var i = 0; i < this.map.sitelist.length; i++) {
        var site = this.map.sitelist[i];
        ctx.beginPath();
        var rad = Math.max(2, Math.min(2 * (1 + sites[i]), 50));
        ctx.arc(w * site.x + x, h * site.y + y, rad, 0, 2 * Math.PI, false);
        var dist = Math.sqrt(site.x * site.x + site.y * site.y) / Math.sqrt(2);
        var red = Math.floor((dist - 0.5) * 2 * 255);
        var green = Math.floor((dist - 0.5) * 2 * 255);
        var blue = Math.floor(255);
        if (red < 0) {
            red = 0;
            gree = 0;
            blue = Math.floor(dist * 2 * 255);
        }
        ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
        ctx.fill();
        ctx.strokeStyle = "Black";
        ctx.stroke();
    }

    ctx.font = "18px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Population " + this.p.agents.length, x, y + 1.1*h + 24);
    ctx.fillText("Length (Max/Ave/Min) " + Math.floor(this.p.lengths.max) + "/" + Math.floor(this.p.lengths.average) + "/" + Math.floor(this.p.lengths.min), x, y + 1.1 * h + 44);
    ctx.fillText("Ratio (Max/Ave/Min) " + Math.floor(this.p.ratio.max * 100) / 100 + "/" + Math.floor(this.p.ratio.average * 100) / 100 + "/" + Math.floor(this.p.ratio.min * 100) / 100, x, y + 1.1 * h + 63);

    var offset = 1.1 * w;
}