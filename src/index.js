'use strict';
var Matrix = require('lightning-matrix');
var d3 = require('d3');
var utils = require('lightning-client-utils');
var _ = require('lodash');

var Visualization = Matrix.extend({

    getDefaultOptions: function() {
        return {
            labels: false,
            symmetric: true,
            sort: "label"
        }
    },

    formatData: function(data) {
        var matrix = [];
        var self = this;

        // parse labels
        var n = data.nodes.length;
        var label = data.label ? data.label : _.times(n, _.constant(0));
        label = label.map(function(d) {return d - d3.min(label)});

        // fill matrix with node and link info
        data.nodes.forEach(function(node, i) {
            matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0, c: "black"}; });
        });
        data.links.forEach(function(link) {
            matrix[link[0]][link[1]].z = link[2];
            if (label[link[0]] == label[link[1]]) {
                matrix[link[0]][link[1]].l = label[link[0]];
            } else {
                matrix[link[0]][link[1]].l = -1;
            }
        });

        // add extra entries to symmetrize
        if (self.options.symmetric) {
            data.links.forEach(function(link) {
                matrix[link[1]][link[0]].z = link[2];
                if (label[link[0]] == label[link[1]]) {
                    matrix[link[1]][link[0]].l = label[link[0]];
                } else {
                    matrix[link[1]][link[0]].l = -1;
                }
            });
        }

        // fill in diagnonals
        d3.range(n).forEach(function(i) {
            matrix[i][i].z = zmin;
            matrix[i][i].l = label[i];
        });
        var entries = _.flatten(matrix);

        // get summary statistics
        var nrow = matrix.length;
        var ncol = matrix[0].length;
        var zmin = d3.min(data.links, function(d) {return d[2]});
        var zmax = d3.max(data.links, function(d) {return d[2]});
        var rowsum = _.map(_.range(nrow), function(i) {
            return d3.sum(_.filter(entries, function(d) {return d.y == i}), function(d) {return d.z})
        });
        var colsum = _.map(_.range(ncol), function(j) {
            return d3.sum(_.filter(entries, function(d) {return d.x == j}), function(d) {return d.z})
        });

        return {entries: entries, nrow: nrow, ncol: ncol, rowsum: rowsum, colsum: colsum,
            zmin: zmin, zmax: zmax, label: label, rows: data.names, columns: data.names}
    },

    sortRows: function() {
        var self = this;
        if (this.options.sort == 'label') {
            var sorter = function(a, b) {
                return self.data.label[b] - self.data.label[a]
            };
            this.y.domain(d3.range(this.data.nrow).sort(sorter));
            this.x.domain(d3.range(this.data.ncol).sort(sorter));
        }
        if (this.options.sort == 'degree') {
            var colsorter = function(a, b) {
                return self.data.colsum[b] - self.data.colsum[a]
            };
            var rowsorter = function(a, b) {
                return self.data.colsum[b] - self.data.colsum[a]
            };
            this.y.domain(d3.range(this.data.nrow).sort(rowsorter));
            this.x.domain(d3.range(this.data.ncol).sort(colsorter));
        }
    },

    makeScales: function() {
        var self = this;
        var n = _.uniq(this.data.label).length;
        var color = utils.getColors(n);
        this.c = d3.scale.ordinal();
        this.c.domain([0, n])
            .range(color);
        this.z = d3.scale.linear();
        this.z.domain(utils.linspace(self.data.zmin, self.data.zmax, 9))
            .range([0.3, 1]).clamp(true)
    },

    updateRange: function(d) {
        this.c.range(colorbrewer[d][9])
    },

    updateDomain: function(d) {
        this.z.domain(d)
    },

    formatLabel: function(val) {
        if (val == 0 || isNaN(val)) {
            return '';
        } else {
            return parseFloat(d3.format(".2f")(val)).toString();
        }
    },

    getColor: function(d, opacity) {
        var color;
        if (d.l == -1) {
            color = 'rgb(150,150,150)';
        } else {
            color = this.c(d.l);
        }
        if (d.z == 0) {
            color =  "#eee";
        }
        if (opacity < 1.0) {
            return utils.buildRGBA(color, 0.15);
        }
        return (d.z != 0) ? utils.buildRGBA(color, this.z(d.z) * opacity) : "#eee"
    }

});


module.exports = Visualization;
