const Graph = require('./graph')

let map = new Graph();
map.addNode("Electro");
map.addNode("Rectorat");
map.addNode("MPT");
map.addNode("Biblioteca");
map.addNode("Camine");
map.addNode("ASPC");

map.addNode("Primarie");
map.addNode("Prefectura");
map.addNode("Iulius Town");

map.addEdge("MPT", "Electro", 7);
map.addEdge("MPT", "Biblioteca", 4);
map.addEdge("MPT", "Camine", 9);
map.addEdge("Camine", "ASPC", 5);
map.addEdge("Biblioteca", "Electro", 2);
map.addEdge("Biblioteca", "Rectorat", 3);
map.addEdge("Biblioteca", "ASPC", 3);
map.addEdge("ASPC", "Rectorat", 3);
map.addEdge("Electro", "Rectorat", 6);

map.addEdge("Primarie", "Prefectura", 2);
map.addEdge("Iulius Town", "Prefectura", 7);
map.addEdge("Iulius Town", "Primarie", 10);


console.log(map.nodes)

console.log(
  map.findPathWithDijkstra('Dig Inn', 'Starbucks')
)

for(let vertex of map.nodes) {
  map.depthSearch(vertex)
}

console.log(map.maxPaths)
