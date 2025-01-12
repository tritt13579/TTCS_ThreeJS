import { initScene } from "./scene.js";
import { loadData } from "./dataLoader.js";
import { displayNodes, displayEdges, cleanupGraph } from "./graphVisualizer.js";
import { addTreesAround, createSnow } from "./environmentSetup.js";
import { dijkstra, johnson, floydWarshall } from "./graph.js";
import { animateCar } from "./carAnimation.js";
import {
  initializeUI,
  populateNodeDropdowns,
  setupEventListeners,
} from "./ui-handler.js";

let currentData = null;
let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let nodeLabels = [];
let edgeWeights = [];
let updateSnowEffect;

async function init(data) {
  try {
    // Nếu scene đã tồn tại, cleanup trước
    if (scene) {
      cleanupGraph(scene);

      if (updateSnowEffect) {
        updateSnowEffect = null;
      }
    } else {
      // Khởi tạo scene lần đầu
      const sceneSetup = initScene();
      scene = sceneSetup.scene;
      camera = sceneSetup.camera;
      renderer = sceneSetup.renderer;
      controls = sceneSetup.controls;
    }

    currentData = data;

    nodeLabels = await displayNodes(scene, data, camera);
    edgeWeights = displayEdges(scene, data, camera);

    await addTreesAround(scene, data);
    updateSnowEffect = createSnow(scene);

    // Cập nhật UI
    populateNodeDropdowns(data);

    // Nếu đây là lần đầu khởi tạo, setup animation loop
    if (!renderer.info.autoUpdate) {
      function animate() {
        requestAnimationFrame(animate);
        updateSnowEffect();
        nodeLabels.forEach((labelMesh) => {
          labelMesh.quaternion.copy(camera.quaternion);
        });
        edgeWeights.forEach((textMesh) => {
          textMesh.quaternion.copy(camera.quaternion);
        });
        controls.update();
        renderer.render(scene, camera);
      }
      animate();
    }
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

async function handlePlayAnimation() {
  const startNode = document.getElementById("start-node").value;
  const endNode = document.getElementById("end-node").value;
  const algorithm = document.getElementById("algorithm-select").value;

  if (!currentData || !startNode || !endNode) {
    alert("Please select both start and end nodes.");
    return;
  }

  try {
    let path = null;

    if (algorithm === "dijkstra") {
      path = dijkstra(currentData, startNode, endNode);
    } else if (algorithm === "johnson") {
      const allPairsShortestPaths = johnson(currentData);
      path = allPairsShortestPaths[startNode]?.[endNode] || null;
    } else if (algorithm === "floyd-warshall") {
      const { paths } = floydWarshall(currentData);
      path = paths[startNode][endNode] || null;
    }

    if (path) {
      await animateCar(scene, currentData, path);
    } else {
      console.error(`No path found between ${startNode} and ${endNode}.`);
      alert(`No path found between ${startNode} and ${endNode}.`);
    }
  } catch (error) {
    console.error("Animation error:", error);
    alert("Error running animation.");
  }
}

// Initialize UI and setup event handlers
initializeUI((data) => init(data));
setupEventListeners(async (file) => {
  const data = await loadData(file);
  await init(data);
}, handlePlayAnimation);
