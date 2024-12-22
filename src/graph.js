export function johnson(graph) {
  const { nodes, edges } = graph;

  // Step 1: Add a new node `q` connecting to all existing nodes with weight 0
  const q = { id: "q" };
  const augmentedEdges = [...edges];
  nodes.forEach((node) => {
    augmentedEdges.push({ source: "q", target: node.id, weight: 0 });
  });

  // Step 2: Bellman-Ford to calculate h-values
  const h = {};
  nodes.concat(q).forEach((node) => (h[node.id] = Infinity));
  h[q.id] = 0;

  for (let i = 0; i < nodes.length; i++) {
    augmentedEdges.forEach(({ source, target, weight }) => {
      if (h[source] + weight < h[target]) {
        h[target] = h[source] + weight;
      }
    });
  }

  // Check for negative-weight cycles
  for (const { source, target, weight } of augmentedEdges) {
    if (h[source] + weight < h[target]) {
      throw new Error("Graph contains a negative-weight cycle");
    }
  }

  // Step 3: Reweight edges
  const reweightedEdges = edges.map(({ source, target, weight }) => ({
    source,
    target,
    weight: weight + h[source] - h[target],
  }));

  // Step 4: Run Dijkstra for each node
  const shortestPaths = {};
  const pathMap = {};
  nodes.forEach((node) => {
    const { distances, paths } = dijkstraWithPaths(
      { nodes, edges: reweightedEdges },
      node.id
    );
    shortestPaths[node.id] = distances;
    pathMap[node.id] = paths;
  });

  // Adjust distances and paths back using h-values
  Object.keys(shortestPaths).forEach((u) => {
    Object.keys(shortestPaths[u]).forEach((v) => {
      if (shortestPaths[u][v] !== Infinity) {
        shortestPaths[u][v] += h[v] - h[u];
      }
    });
  });

  return pathMap;
}

function dijkstraWithPaths(graph, start) {
  const distances = {};
  const previous = {};
  const paths = {};
  const visited = new Set();
  const queue = [];

  graph.nodes.forEach((node) => {
    distances[node.id] = node.id === start ? 0 : Infinity;
    previous[node.id] = null;
    queue.push(node.id);
    paths[node.id] = [];
  });

  while (queue.length > 0) {
    const currentNode = queue.reduce((minNode, node) =>
      distances[node] < distances[minNode] ? node : minNode
    );

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

  Object.keys(previous).forEach((node) => {
    const path = [];
    for (let at = node; at; at = previous[at]) {
      path.unshift(at);
    }
    if (path[0] === start) {
      paths[node] = path;
    }
  });

  return { distances, paths };
}

export function dijkstra(graph, start, end = null) {
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

    if (end && currentNode === end) break;

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

  if (end) {
    const path = [];
    for (let at = end; at; at = previous[at]) {
      path.unshift(at);
    }
    return path.length > 1 ? path : null;
  } else {
    return distances;
  }
}
export function floydWarshall(graph) {
  const { nodes, edges } = graph;
  const distance = {};
  const next = {};

  // Khởi tạo khoảng cách và next cho tất cả các cặp nút
  nodes.forEach((node) => {
    distance[node.id] = {};
    next[node.id] = {};
    nodes.forEach((otherNode) => {
      distance[node.id][otherNode.id] = Infinity;
      next[node.id][otherNode.id] = null;
    });
    distance[node.id][node.id] = 0; // Khoảng cách từ một nút đến chính nó là 0
  });

  // Đặt các khoảng cách cho các cạnh trực tiếp
  edges.forEach(({ source, target, weight }) => {
    if (distance[source] && distance[target]) {
      distance[source][target] = weight;
      next[source][target] = target;
    }
  });

  // Áp dụng thuật toán Floyd-Warshall
  nodes.forEach((k) => {
    nodes.forEach((i) => {
      nodes.forEach((j) => {
        if (
          distance[i.id][k.id] + distance[k.id][j.id] <
          distance[i.id][j.id]
        ) {
          distance[i.id][j.id] = distance[i.id][k.id] + distance[k.id][j.id];
          next[i.id][j.id] = next[i.id][k.id];
        }
      });
    });
  });

  // Tính toán lại đường dẫn
  const paths = {};
  nodes.forEach((i) => {
    paths[i.id] = {};
    nodes.forEach((j) => {
      if (distance[i.id][j.id] < Infinity) {
        const path = [];
        for (let at = i.id; at !== j.id; at = next[at][j.id]) {
          path.push(at);
        }
        path.push(j.id);
        paths[i.id][j.id] = path;
      } else {
        paths[i.id][j.id] = null;
      }
    });
  });

  return { distance, paths };
}
