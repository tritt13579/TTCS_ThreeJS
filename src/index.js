import { initScene } from "./scene.js";
import { loadData } from "./dataLoader.js";
import { displayNodes, displayEdges } from "./graphVisualizer.js";
import { addTreesAround, createSnow } from "./environmentSetup.js";
import { dijkstra, johnson, floydWarshall } from "./graph.js";
import { animateCar } from "./carAnimation.js";

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
    // Store current data
    currentData = data;

    // Initialize scene
    const sceneSetup = initScene();
    scene = sceneSetup.scene;
    camera = sceneSetup.camera;
    renderer = sceneSetup.renderer;
    controls = sceneSetup.controls;

    nodeLabels = await displayNodes(scene, data, camera);
    edgeWeights = await displayEdges(scene, data, camera);

    // Add environmental elements
    await addTreesAround(scene, data);
    updateSnowEffect = createSnow(scene);

    // Render loop
    function animate() {
      requestAnimationFrame(animate);
      updateSnowEffect();
      // Update node labels to face the camera
      nodeLabels.forEach((labelMesh) => {
        labelMesh.quaternion.copy(camera.quaternion);
      });

      // Update edge weights to face the camera
      edgeWeights.forEach((textMesh) => {
        textMesh.quaternion.copy(camera.quaternion);
      });
      controls.update();
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
const modal = document.getElementById("manual-input-modal");
const manualInputBtn = document.getElementById("manual-input-btn");
const closeBtn = document.getElementsByClassName("close")[0];
const totalNodesInput = document.getElementById("total-nodes");
const nodePreview = document.getElementById("node-preview");
const addEdgeBtn = document.getElementById("add-edge");
const edgesContainer = document.getElementById("edges-container");
const submitGraphBtn = document.getElementById("submit-graph");

// Modal open/close
manualInputBtn.onclick = () => (modal.style.display = "block");
closeBtn.onclick = () => (modal.style.display = "none");
window.onclick = (event) => {
  if (event.target === modal) modal.style.display = "none";
};

// Node number controls
document.querySelector(".minus").onclick = () => {
  if (totalNodesInput.value > 2) {
    totalNodesInput.value = parseInt(totalNodesInput.value) - 1;
    updateNodePreview();
    updateEdgeSelectors();
  }
};

document.querySelector(".plus").onclick = () => {
  if (totalNodesInput.value < 26) {
    totalNodesInput.value = parseInt(totalNodesInput.value) + 1;
    updateNodePreview();
    updateEdgeSelectors();
  }
};

// Update node preview when input changes
totalNodesInput.addEventListener("input", () => {
  let value = parseInt(totalNodesInput.value);
  if (value < 2) totalNodesInput.value = 2;
  if (value > 26) totalNodesInput.value = 26;
  updateNodePreview();
  updateEdgeSelectors();
});

function updateNodePreview() {
  const count = parseInt(totalNodesInput.value);
  const nodes = Array.from({ length: count }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  nodePreview.textContent = nodes.join(", ");
}

// Add edge input
addEdgeBtn.onclick = () => {
  const edgeDiv = document.createElement("div");
  edgeDiv.className = "edge-input";
  edgeDiv.innerHTML = `
    <select class="edge-source">
      <option value="">From</option>
    </select>
    <select class="edge-target">
      <option value="">To</option>
    </select>
    <input type="number" class="edge-weight" placeholder="Weight" min="1" step="1">
    <button class="remove-edge">✕</button>
  `;
  edgesContainer.appendChild(edgeDiv);
  updateEdgeSelectors();
};

// Remove edge
document.addEventListener("click", (e) => {
  if (e.target.className === "remove-edge") {
    e.target.parentElement.remove();
  }
});

// Update edge selectors
function updateEdgeSelectors() {
  const nodeCount = parseInt(totalNodesInput.value);
  const nodes = Array.from({ length: nodeCount }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const selectors = document.querySelectorAll(".edge-source, .edge-target");
  selectors.forEach((selector) => {
    const currentValue = selector.value;
    selector.innerHTML = `<option value="">${
      selector.className.includes("source") ? "From" : "To"
    }</option>`;
    nodes.forEach((node) => {
      selector.innerHTML += `<option value="${node}">${node}</option>`;
    });
    if (nodes.includes(currentValue)) selector.value = currentValue;
  });
}

// Submit graph data
submitGraphBtn.onclick = () => {
  const nodeCount = parseInt(totalNodesInput.value);
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: String.fromCharCode(65 + i),
  }));

  const edges = [];
  document.querySelectorAll(".edge-input").forEach((edgeDiv) => {
    const source = edgeDiv.querySelector(".edge-source").value;
    const target = edgeDiv.querySelector(".edge-target").value;
    const weight = parseInt(edgeDiv.querySelector(".edge-weight").value);

    if (source && target && !isNaN(weight)) {
      edges.push({ source, target, weight });
    }
  });

  // Validate the data
  if (edges.length < 1) {
    alert("Please add at least 1 edge.");
    return;
  }

  // Initialize the visualization with the new data
  init({ nodes, edges });
  modal.style.display = "none";
};

// Add initial edge input
addEdgeBtn.click();
updateNodePreview();
