var SiteMap = function (params, sitelist) {
    this.params = params;
    this.thresholds = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.sitelist = [];
    this.totalsex = [];
    this.totalvisited = [];
    this.adjacencymatrix = [];
    this.visited = [];
    for (var i = 0; i < this.params.numsites; i++) {
        this.adjacencymatrix.push([]);
        this.visited.push([]);
        var row = this.adjacencymatrix[i];
        var vrow = this.visited[i];
        for (var j = 0; j < this.params.numsites; j++) {
            row.push(0);
            vrow.push(0);
        }
    }


    for (var i = 0; i < this.params.numsites; i++) {
        var type = Math.floor(Math.random() * 2) == 0 ? "FISH" : "NUTS";
        var reward = sitelist ? sitelist[i].reward : this.params.rewardmin + Math.floor(Math.random() * (this.params.rewardmax - this.params.rewardmin + 1));
        var x = sitelist ? sitelist[i].x : Math.random();
        var y = sitelist ? sitelist[i].y : Math.random();
        this.sitelist.push(new GatheringSite(this.params.permsize, reward, this.params.yield, type, i, x, y));
    }

    for (var i = 0; i < this.params.numsites; i++) {
        for (var j = i + 1; j < this.params.numsites; j++) {
            this.adjacencymatrix[i][j] = distance(this.sitelist[i], this.sitelist[j]) > this.params.reach ? 0 : 5 * distance(this.sitelist[i], this.sitelist[j]);
            this.adjacencymatrix[j][i] = distance(this.sitelist[i], this.sitelist[j]) > this.params.reach ? 0 : 5 * distance(this.sitelist[i], this.sitelist[j]);
        }
    }
}