var Adjacency = require('lightning-adjacency');

var el = document.createElement('div');
document.body.appendChild(el);

var data = {
  nodes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  group: [0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2],
  links: [[0, 1, 1], [0, 2, 1], [1, 3, 3], [5, 6, 4], [7, 9, 2]],
  labels: ["name 0", "name 1", "name 2", "name 3", "name 4", "name 5", "name 6", "name 7", "name 8", "name 9", "name 10"]
};

var options = {
  numbers: true,
  symmetric: true,
  sort: 'group',
  width: 600,
  height: 400
};

var adjacency = new Adjacency(el, data, options);
