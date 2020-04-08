<template>
  <main id="main" class="container mx-auto grid col-gap-3 grid-cols-12">
    <div class="col-span-12 sm:col-span-6 md:col-span-4">
      <div class="card mb-4 w-full">
        <h4 class="text-gray-700 text-2xl font-bold">Add node</h4>
        <form @submit.prevent="addNode" class="flex w-full flex-col mt-4">
          <input required v-model="node" type="text" placeholder="Node Name" class="mb-2">
          <button type="submit" class="flex-grow">Add Node</button>
        </form>
      </div>
      <div class="card mb-4 col-span-12 sm:col-span-6 md:col-span-4">
        <h4 class="text-gray-700 text-2xl font-bold">Add edge</h4>
        <form @submit.prevent="addEdge" class="flex flex-col w-full mt-4">
          <input required v-model="conn.end1" type="text" placeholder="Node 1" class="mb-2">
          <input required v-model="conn.end2" type="text" placeholder="Node 2" class="mb-2">
          <input required v-model.number="conn.weight" type="text" placeholder="Weight" class="mb-2">
          <button type="submit" class="flex-grow">Add Edge</button>
        </form>
      </div>
      <div class="card mb-4 col-span-12 sm:col-span-6 md:col-span-4">
        <h4 class="text-gray-700 text-2xl font-bold">Dijkstra's</h4>
        <div v-if="this.path" class="border border-gray-300 p-2 rounded">
          <p>Path: <span v-for="p of path.path" :key="p">{{ p }}, </span></p>
          <p>Weight: {{ path.weight }}</p>
        </div>
        <form @submit.prevent="findPath" class="flex flex-col w-full mt-4">
          <input required v-model="start" type="text" placeholder="Start node" class="mb-2">
          <input required v-model="end" type="text" placeholder="End node" class="mb-2">
          <button type="submit" class="flex-grow">Find path</button>
          <div class="w-full rounded bg-red-100 p-3 font-bold text-red-700 mt-2" v-if="dijkstraError">
            {{ dijkstraError }}
          </div>
        </form>
      </div>
      <div class="card mb-4 col-span-12 sm:col-span-6 md:col-span-4">
        <h4 class="text-gray-700 text-2xl font-bold">Components (comp. conexe)</h4>
        <div v-if="components">
          <div v-for="c of components" :key="c[0]" class="p-2 border border-gray-300 rounded mb-2">
            <div v-for="node of c" :key="node">
              {{ node }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mb-4 col-span-12 sm:col-span-6 md:col-span-8">
      <h4 class="text-gray-700 text-2xl font-bold">Nodes</h4>
      <div class="w-full flex flex-col" v-if="this.graph">
        <div v-for="node in this.graph.nodes" :key="node" class="p-2 bg-gray-100 rounded mb-2 flex flex-row justify-between">
          {{ node }}
          <div>
            <span v-for="neighbor of graph.adjacencyList[node]" :key="neighbor.node" class="ml-2 text-sm rounded-full px-2 py-1 border">
              {{ neighbor.node }} - {{ neighbor.weight }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Graph from '../services/graph'

export default {
  name: 'Home',
  components: {},
  data () {
    return {
      graph: undefined,
      components: {},
      node: null,
      conn: {
        end1: null,
        end2: null,
        weight: null
      },
      start: null,
      end: null,
      path: null,
      dijkstraError: ''
    }
  },
  mounted () {
    this.graph = new Graph()

    this.graph.addNode("Electro");
    this.graph.addNode("Rectorat");
    this.graph.addNode("MPT");
    this.graph.addNode("Biblioteca");
    this.graph.addNode("Camine");
    this.graph.addNode("ASPC");

    this.graph.addNode("Primarie");
    this.graph.addNode("Prefectura");
    this.graph.addNode("Iulius Town");

    this.graph.addEdge("MPT", "Electro", 7);
    this.graph.addEdge("MPT", "Biblioteca", 4);
    this.graph.addEdge("MPT", "Camine", 9);
    this.graph.addEdge("Camine", "ASPC", 5);
    this.graph.addEdge("Biblioteca", "Electro", 2);
    this.graph.addEdge("Biblioteca", "Rectorat", 3);
    this.graph.addEdge("Biblioteca", "ASPC", 3);
    this.graph.addEdge("ASPC", "Rectorat", 3);
    this.graph.addEdge("Electro", "Rectorat", 6);

    this.graph.addEdge("Primarie", "Prefectura", 2);
    this.graph.addEdge("Iulius Town", "Prefectura", 7);
    this.graph.addEdge("Iulius Town", "Primarie", 10);

    this.findComponents()
  },
  methods: {
    addNode () {
      if(!this.node) return
      this.graph.addNode(this.node)

      this.node = null
    },
    addEdge () {
      this.graph.addEdge(this.conn.end1, this.conn.end2, this.conn.weight)
      this.findComponents()

      this.conn = {
        end1: null,
        end2: null,
        weight: null
      }
    },
    findPath() {
      if(!this.graph.nodes.includes(this.start)) {
        return this.dijkstraError = `Node <${this.start}> does not exist. Hint: It's case sensitive.`
      }

      if(!this.graph.nodes.includes(this.end)) {
        return this.dijkstraError = `Node <${this.end}> does not exist. Hint: It's case sensitive.`
      }

      const currentComponent = this.components[this.graph.maxPaths[this.start]]
      this.findComponents()

      // check if start and end are in the same component
      if(currentComponent.includes(this.start) &&
        currentComponent.includes(this.end)) {
          this.path = this.graph.findPathWithDijkstra(this.start, this.end)
        }
      else {
        return this.dijkstraError = 'Start and end nodes are not in the same component.'
      }
    },
    findComponents() {
      for(let node of this.graph.nodes) {
        this.graph.depthSearch(node)
      }
      this.components = {}

      for(let node in this.graph.maxPaths) {
        console.log(node)
        if(this.components[this.graph.maxPaths[node]]) {
          this.components[this.graph.maxPaths[node]].push(node)
        }
        else {
          this.components[this.graph.maxPaths[node]] = [node]
        }
      }
    }
  }
}
</script>

<style lang="postcss">
.card {
  @apply rounded shadow-md bg-white p-3;
}

button {
  @apply bg-blue-500 text-white py-2 px-3 rounded shadow !important;
}

input {
  @apply py-2 px-3 rounded bg-white border border-gray-200 !important;
}

</style>
