import { initScene } from "./scene.js";
import { loadData } from "./dataLoader.js";
import { displayNodes, displayEdges } from "./graphVisualizer.js";
import { addTreesAround } from "./environmentSetup.js";
import { dijkstra } from "./graph.js";
import { animateCar } from "./carAnimation.js";

let currentData = null;
let scene = null;
let camera = null;
let renderer = null;

async function init(data) {
  try {
    // Store current data
    currentData = data;

    // Initialize scene
    const sceneSetup = initScene();
    scene = sceneSetup.scene;
    camera = sceneSetup.camera;
    renderer = sceneSetup.renderer;

    // Display graph elements
    await displayNodes(scene, data, camera);
    displayEdges(scene, data, camera);

    // Add environmental elements
    await addTreesAround(scene, data);

    // Render loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // Populate node selection dropdowns
    populateNodeDropdowns(data);

    // Remove default animation
    console.log("Scene initialized. Waiting for user interaction.");
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

function populateNodeDropdowns(data) {
  const startNodeSelect = document.getElementById("start-node");
  const endNodeSelect = document.getElementById("end-node");

  // Clear previous options
  startNodeSelect.innerHTML = '<option value="">Select Start Node</option>';
  endNodeSelect.innerHTML = '<option value="">Select End Node</option>';

  // Add nodes to dropdowns
  data.nodes.forEach((node) => {
    const startOption = document.createElement("option");
    startOption.value = node.id;
    startOption.textContent = node.id;
    startNodeSelect.appendChild(startOption);

    const endOption = document.createElement("option");
    endOption.value = node.id;
    endOption.textContent = node.id;
    endNodeSelect.appendChild(endOption);
  });
}

async function handlePlayAnimation() {
  const startNode = document.getElementById("start-node").value;
  const endNode = document.getElementById("end-node").value;

  if (!currentData || !startNode || !endNode) {
    alert("Please select both start and end nodes.");
    return;
  }

  try {
    const path = dijkstra(currentData, startNode, endNode);
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

// Handle file input
const fileInput = document.getElementById("file-input");
fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const data = await loadData(file);
      await init(data);
    } catch (error) {
      console.error(error);
      alert("Error loading file. Please check the file format.");
    }
  }
});

// Add event listeners for play button
const playButton = document.getElementById("play-button");
playButton.addEventListener("click", handlePlayAnimation);
