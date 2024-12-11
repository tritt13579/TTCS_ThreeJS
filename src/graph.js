export function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const queue = [];

  graph.nodes.forEach((node) => {
    distances[node.id] = node.id === start ? 0 : Infinity;
    previous[node.id] = null;
    queue.push(node.id);
  });

  while (queue.length > 0) {
    const currentNode = queue.reduce((minNode, node) =>
      distances[node] < distances[minNode] ? node : minNode
    );

    if (currentNode === end) break;

    queue.splice(queue.indexOf(currentNode), 1);
    visited.add(currentNode);

    const neighbors = graph.edges
      .filter(
        (edge) => edge.source === currentNode || edge.target === currentNode
      )
      .map((edge) => (edge.source === currentNode ? edge.target : edge.source));

    neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        const edge = graph.edges.find(
          (e) =>
            (e.source === currentNode && e.target === neighbor) ||
            (e.target === currentNode && e.source === neighbor)
        );
        const alt = distances[currentNode] + edge.weight;
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = currentNode;
        }
      }
    });
  }

  const path = [];
  for (let at = end; at; at = previous[at]) {
    path.unshift(at);
  }
  return path.length > 1 ? path : null;
}
