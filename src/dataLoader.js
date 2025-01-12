export async function loadData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);
        resolve(json);
      } catch (error) {
        reject("Invalid JSON file");
      }
    };
    reader.onerror = () => reject("File could not be read");
    reader.readAsText(file);
  });
}

export function applyForceDirectedLayout(data) {
  const width = 500;
  const height = 300;
  const k = Math.sqrt((width * height) / data.nodes.length);
  const iterations = 500;

  // Initial random positioning
  data.nodes.forEach((node) => {
    node.x = Math.random() * width - width / 2;
    node.y = Math.random() * height - height / 2;
  });

  for (let iter = 0; iter < iterations; iter++) {
    data.nodes.forEach((nodeA) => {
      nodeA.vx = 0;
      nodeA.vy = 0;
      data.nodes.forEach((nodeB) => {
        if (nodeA !== nodeB) {
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 0) {
            const force = (k * k) / distance;
            nodeA.vx += (dx / distance) * force;
            nodeA.vy += (dy / distance) * force;
          }
        }
      });
    });

    // Attraction forces for edges
    data.edges.forEach((edge) => {
      const source = data.nodes.find((node) => node.id === edge.source);
      const target = data.nodes.find((node) => node.id === edge.target);
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = (distance * distance) / k;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    });

    // Update node positions
    data.nodes.forEach((node) => {
      node.x += node.vx * 0.1;
      node.y += node.vy * 0.1;

      // Ensure nodes stay within graph boundaries
      node.x = Math.max(-width / 2 + 20, Math.min(width / 2 - 20, node.x));
      node.y = Math.max(-height / 2 + 20, Math.min(height / 2 - 20, node.y));
    });
  }

  return data;
}
