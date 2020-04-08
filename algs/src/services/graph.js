const Queue = require('./queue')

module.exports = class Graph {
  constructor() {
    this.nodes = []
    this.adjacencyList = {}
    this.verticesNr = 0
    this.maxPaths = {}
  }

  addNode(node) {
    if(this.nodes.includes(node)) {
      return false
    }
    this.nodes.push(node)
    this.maxPaths[node] = 0
    this.adjacencyList[node] = []
    return true
  }

  addEdge(node1, node2, weight) {
    this.adjacencyList[node1].push({ node: node2, weight: weight })
    this.adjacencyList[node2].push({ node: node1, weight: weight })
    this.verticesNr++
    return true
  }

  findPathWithDijkstra(startNode, endNode) {
    let weights = {}
    let backtrace = {}
    let queue = new Queue()

    weights[startNode] = 0

    this.nodes.forEach(node => {
      if (node !== startNode) {
        weights[node] = Infinity
      }
    })

    queue.enqueue([startNode, 0])

    while (!queue.isEmpty()) {
      let shortestStep = queue.dequeue()
      let currentNode = shortestStep[0]

      this.adjacencyList[currentNode].forEach(neighbor => {
        let wi = weights[currentNode] + neighbor.weight

        if (wi < weights[neighbor.node]) {
          weights[neighbor.node] = wi
          backtrace[neighbor.node] = currentNode
          queue.enqueue([neighbor.node, wi])
        }
        console.log(queue.collection)
      })
    }

    let path = [endNode]
    let lastStep = endNode
    while (lastStep !== startNode) {
      path.unshift(backtrace[lastStep])
      lastStep = backtrace[lastStep]
    }
    return { path: path, weight: weights[endNode] }
  }

  depthSearch(startingNode) {
    var visited = []
    for (var i = 0; i < this.verticesNr; i++)
      visited[i] = false

    this.dfs(startingNode, visited)
  }

  dfs(vert, visited) {
    visited[vert] = true
    this.maxPaths[vert]++

    let neighbors = this.adjacencyList[vert]

    for (var i in neighbors) {
      let node = neighbors[i].node
      if (!visited[node]) {
        this.dfs(node, visited)
      }
    }
  }
}
