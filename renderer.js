// Code provided by Dr. Chris Marriott



function Renderer(p, map) {
    this.map = map;
    this.p = p;

    this.clusters = [];

    this.agents = [];
    this.related = [];
    this.related.push([]);
    this.related[0].push(0);
    var newagent = this.p.agents[0];
    this.agents.push(newagent);
    Entity.call(this, null, 0, 0);
}

Renderer.prototype = new Entity();
Renderer.prototype.constructor = Renderer;

Renderer.prototype.update = function () {
    var numAgents = 36;

    if (!this.p.params.pause) {
        if (this.p.newPop) {
            this.p = this.p.newPop;
            this.p.params.map.reset();
        }
        this.p.update();
        this.agents = this.p.agents.slice(0, numAgents);
    }
}

Renderer.prototype.drawSiteMap = function (ctx, map, x, y, w, h) {

    // population map
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