import { Node } from './components/Node'

class NodesHandler {
  constructor (scene, config) {
    this.nodeIdMap = {}
    this.nodeRelatedEdgesMap = {}
    this.scene = scene
    this.config = config
  }
  get nodes () {
    return Object.values(this.nodeIdMap)
  }
  get selectedNodesIds() {
    return Object.keys(this.nodeIdMap).filter((id) => {
      if (this.nodeIdMap[id].selected) return id
    })
  }
  addRelatedEdgesToNodes = (newEdges) => {
    newEdges.forEach((newEdge) => {
      this.#addNodeRelatedEdge(newEdge.source, newEdge, 'from')
      this.#addNodeRelatedEdge(newEdge.target, newEdge, 'to')
    })
  }
  deleteRelatedEdgesToNodes = (edges) => {
    edges.forEach((edge) => {
      this.#deleteNodeRelatedEdge(edge.source, edge.id)
      this.#deleteNodeRelatedEdge(edge.target, edge.id)
    })
  }
  #addNodeRelatedEdge (nodeId, newEdge, direction) {
    if (this.nodeRelatedEdgesMap[nodeId]) {
      const isEdgeExist = this.nodeRelatedEdgesMap[nodeId].findIndex((edge) => edge.id === newEdge.id) !== -1
      if (isEdgeExist) return

      this.nodeRelatedEdgesMap[nodeId].push({id: newEdge.id, direction})
    } else {
      this.nodeRelatedEdgesMap[nodeId] = [{id: newEdge.id, direction}]
    }
  }
  #deleteNodeRelatedEdge (nodeId, edgeId) {
    const nodeRelatedEdges = this.nodeRelatedEdgesMap[nodeId]
    const edgeIndex = nodeRelatedEdges.findIndex((edge) => edge.id === edgeId)
    nodeRelatedEdges.splice(edgeIndex, 1)
  }

  addNodes = (nodes) => {
    nodes.forEach((node) => {
      const nodeInst = new Node(node, this.config)
      this.nodeIdMap[nodeInst.userId] = nodeInst
      this.scene.add(nodeInst)
    })
  }
  deleteNodes = (nodeIds) => {
    nodeIds.forEach((nodeId) => {
      this.scene.remove(this.nodeIdMap[nodeId])
      delete this.nodeIdMap[nodeId]
    })
  }
  selectNodes = (nodeIds) => {
    this.nodes.forEach((nodeInst) => {
      nodeInst.selected = nodeIds.includes(nodeInst.userId)
    })
  }
  updateNodesPositionByOffset = (nodeIds, offset) => {
    nodeIds.forEach((nodeId)=> {
      this.nodeIdMap[nodeId].position.add(offset)
    })
  }
  updateNodesColor = (nodeIds, colorData) => {
    nodeIds.forEach((nodeId) => {
      this.nodeIdMap[nodeId].updateColor(colorData)
    })
  }
  updateNodesPosition = (nodes) => {
    nodes.forEach((node) => {
      this.nodeIdMap[node.id].updatePosition(node.position)
    })
  }
}

export { NodesHandler }