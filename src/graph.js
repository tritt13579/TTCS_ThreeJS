// // Thuật toán Dijkstra
// export function dijkstra(graph, start, end) {
//   const distances = {};
//   const prevNodes = {};
//   const pq = [];

//   graph.nodes.forEach((node) => {
//     distances[node.id] = Infinity;
//     prevNodes[node.id] = null;
//     pq.push({ id: node.id, priority: Infinity });
//   });

//   distances[start] = 0;
//   pq.find((node) => node.id === start).priority = 0;

//   while (pq.length) {
//     pq.sort((a, b) => a.priority - b.priority);
//     const { id: current } = pq.shift();

//     if (current === end) break;

//     graph.edges
//       .filter((edge) => edge.from === current || edge.to === current)
//       .forEach((edge) => {
//         const neighbor = edge.from === current ? edge.to : edge.from;
//         const newDist = distances[current] + edge.weight;

//         if (newDist < distances[neighbor]) {
//           distances[neighbor] = newDist;
//           prevNodes[neighbor] = current;

//           const nodeInQueue = pq.find((node) => node.id === neighbor);
//           if (nodeInQueue) nodeInQueue.priority = newDist;
//         }
//       });
//   }

//   const path = [];
//   let currentNode = end;
//   while (currentNode !== null) {
//     path.unshift(currentNode);
//     currentNode = prevNodes[currentNode];
//   }
//   return path;
// }
// export function dijkstra(graph, start, end) {
//   const distances = {};
//   const prevNodes = {};
//   const pq = [];

//   // Khởi tạo khoảng cách và queue
//   graph.nodes.forEach((node) => {
//     distances[node.id] = Infinity;
//     prevNodes[node.id] = null;
//     pq.push({ id: node.id, priority: Infinity });
//   });

//   // Đặt khoảng cách của nút bắt đầu là 0
//   distances[start] = 0;
//   const startNode = pq.find((node) => node.id === start);
//   if (startNode) {
//     startNode.priority = 0;
//   }

//   while (pq.length > 0) {
//     // Sắp xếp queue theo priority (khoảng cách)
//     pq.sort((a, b) => a.priority - b.priority);

//     // Lấy nút có khoảng cách nhỏ nhất
//     const { id: current } = pq.shift();

//     // Nếu đã đến nút đích thì dừng
//     if (current === end) break;

//     // Kiểm tra các cạnh kết nối
//     graph.edges
//       .filter((edge) => edge.source === current || edge.target === current)
//       .forEach((edge) => {
//         // Xác định nút láng giềng
//         const neighbor = edge.source === current ? edge.target : edge.source;

//         // Tính khoảng cách mới
//         const newDist = distances[current] + edge.weight;

//         // Cập nhật nếu tìm thấy đường đi ngắn hơn
//         if (newDist < distances[neighbor]) {
//           distances[neighbor] = newDist;
//           prevNodes[neighbor] = current;

//           // Cập nhật priority trong queue
//           const nodeInQueue = pq.find((node) => node.id === neighbor);
//           if (nodeInQueue) {
//             nodeInQueue.priority = newDist;
//           }
//         }
//       });
//   }

//   // Truy vết đường đi ngắn nhất
//   const path = [];
//   let currentNode = end;
//   while (currentNode !== null) {
//     path.unshift(currentNode);
//     currentNode = prevNodes[currentNode];
//   }

//   return path;
// }
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
