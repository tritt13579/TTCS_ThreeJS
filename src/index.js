import { initScene } from "./scene.js";
import { loadData } from "./dataLoader.js";
import { displayNodes, displayEdges } from "./graphVisualizer.js";
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
    currentData = data;

    const sceneSetup = initScene();
    scene = sceneSetup.scene;
    camera = sceneSetup.camera;
    renderer = sceneSetup.renderer;
    controls = sceneSetup.controls;

    nodeLabels = await displayNodes(scene, data, camera);
    edgeWeights = displayEdges(scene, data, camera);

    await addTreesAround(scene, data);
    updateSnowEffect = createSnow(scene);

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

    populateNodeDropdowns(data);
    console.log("Scene initialized. Waiting for user interaction.");
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
