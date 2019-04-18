// Code provided by Dr. Chris Marriott.

var distance = function (p, q) {
    return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y));
}

/** Solve a linear system of equations given by a n&times;n matrix
    with a result vector n&times;1. */
    function GaussianElimination(A) {
        var n = A.length;
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
            }  else {
                x[i] = 0;
            }
        }
        return x;
    }