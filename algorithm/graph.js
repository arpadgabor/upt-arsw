const Queue = require('./queue')

module.exports = class Graph {
  constructor() {
    this.nodes = []
    this.adjacencyList = {}
    this.verticesNr = 0
    this.maxPaths = {}
  }

  addNode(node) {
    this.nodes.push(node)
    this.maxPaths[node] = 0
    this.adjacencyList[node] = []
  }

  addEdge(node1, node2, weight) {
    this.adjacencyList[node1].push({ node: node2, weight: weight })
    this.adjacencyList[node2].push({ node: node1, weight: weight })
    this.verticesNr++
  }

  findPathWithDijkstra(startNode, endNode) {
    let times = {}
    let backtrace = {}
    let queue = new Queue()

    times[startNode] = 0

    this.nodes.forEach(node => {
      if (node !== startNode) {
        times[node] = Infinity
      }
    })

    queue.enqueue([startNode, 0])

    while (!queue.isEmpty()) {
      let shortestStep = queue.dequeue()
      let currentNode = shortestStep[0]

      this.adjacencyList[currentNode].forEach(neighbor => {
        let time = times[currentNode] + neighbor.weight

        if (time < times[neighbor.node]) {
          times[neighbor.node] = time
          backtrace[neighbor.node] = currentNode
          queue.enqueue([neighbor.node, time])
        }
      })
    }

    let path = [endNode]
    let lastStep = endNode
    while (lastStep !== startNode) {
      path.unshift(backtrace[lastStep])
      lastStep = backtrace[lastStep]
    }
    return `Path is ${path} and time is ${times[endNode]}`
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
