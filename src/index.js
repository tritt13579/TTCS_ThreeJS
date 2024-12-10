import { initScene } from "./scene.js";
import { loadData } from "./dataLoader.js";
import { displayNodes, displayEdges } from "./graphVisualizer.js";
import { addTreesAround } from "./environmentSetup.js";
import { dijkstra } from "./graph.js";
import { animateCar } from "./carAnimation.js";

async function init() {
  try {
    // Load graph data
    const data = await loadData();

    // Initialize scene
    const { scene, camera, renderer } = initScene();

    // Display graph elements
    await displayNodes(scene, data, camera);
    displayEdges(scene, data, camera);

    // Add environmental elements
    await addTreesAround(scene, data);

    const path = dijkstra(data, "C", "J");
    if (path) {
      await animateCar(scene, data, path);
    } else {
      console.error("No path found between A and D.");
    }

    // Render loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

init();
