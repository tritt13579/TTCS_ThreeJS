// export function initializeUI(onDataSubmit) {
//   const modal = document.getElementById("manual-input-modal");
//   const manualInputBtn = document.getElementById("manual-input-btn");
//   const closeBtn = document.getElementsByClassName("close")[0];
//   const totalNodesInput = document.getElementById("total-nodes");
//   const nodePreview = document.getElementById("node-preview");
//   const addEdgeBtn = document.getElementById("add-edge");
//   const edgesContainer = document.getElementById("edges-container");
//   const submitGraphBtn = document.getElementById("submit-graph");

//   // Modal controls
//   manualInputBtn.onclick = () => (modal.style.display = "block");
//   closeBtn.onclick = () => (modal.style.display = "none");
//   window.onclick = (event) => {
//     if (event.target === modal) modal.style.display = "none";
//   };

//   // Node number controls
//   document.querySelector(".minus").onclick = () => {
//     if (totalNodesInput.value > 2) {
//       totalNodesInput.value = parseInt(totalNodesInput.value) - 1;
//       updateNodePreview();
//       updateEdgeSelectors();
//     }
//   };

//   document.querySelector(".plus").onclick = () => {
//     if (totalNodesInput.value < 26) {
//       totalNodesInput.value = parseInt(totalNodesInput.value) + 1;
//       updateNodePreview();
//       updateEdgeSelectors();
//     }
//   };

//   totalNodesInput.addEventListener("input", () => {
//     let value = parseInt(totalNodesInput.value);
//     if (value < 2) totalNodesInput.value = 2;
//     if (value > 26) totalNodesInput.value = 26;
//     updateNodePreview();
//     updateEdgeSelectors();
//   });

//   // Edge handling
//   addEdgeBtn.onclick = () => {
//     const edgeDiv = document.createElement("div");
//     edgeDiv.className = "edge-input";
//     edgeDiv.innerHTML = `
//       <select class="edge-source">
//         <option value="">From</option>
//       </select>
//       <select class="edge-target">
//         <option value="">To</option>
//       </select>
//       <input type="number" class="edge-weight" placeholder="Weight" min="1" step="1">
//       <button class="remove-edge">✕</button>
//     `;
//     edgesContainer.appendChild(edgeDiv);
//     updateEdgeSelectors();
//   };

//   document.addEventListener("click", (e) => {
//     if (e.target.className === "remove-edge") {
//       e.target.parentElement.remove();
//     }
//   });

//   submitGraphBtn.onclick = () => {
//     const nodeCount = parseInt(totalNodesInput.value);
//     const nodes = Array.from({ length: nodeCount }, (_, i) => ({
//       id: String.fromCharCode(65 + i),
//     }));

//     const edges = [];
//     document.querySelectorAll(".edge-input").forEach((edgeDiv) => {
//       const source = edgeDiv.querySelector(".edge-source").value;
//       const target = edgeDiv.querySelector(".edge-target").value;
//       const weight = parseInt(edgeDiv.querySelector(".edge-weight").value);

//       if (source && target && !isNaN(weight)) {
//         edges.push({ source, target, weight });
//       }
//     });

//     if (edges.length < 1) {
//       alert("Please add at least 1 edge.");
//       return;
//     }

//     onDataSubmit({ nodes, edges });
//     modal.style.display = "none";
//   };

//   // Initialize UI
//   addEdgeBtn.click();
//   updateNodePreview();

//   function updateNodePreview() {
//     const count = parseInt(totalNodesInput.value);
//     const nodes = Array.from({ length: count }, (_, i) =>
//       String.fromCharCode(65 + i)
//     );
//     nodePreview.textContent = nodes.join(", ");
//   }

//   function updateEdgeSelectors() {
//     const nodeCount = parseInt(totalNodesInput.value);
//     const nodes = Array.from({ length: nodeCount }, (_, i) =>
//       String.fromCharCode(65 + i)
//     );

//     const selectors = document.querySelectorAll(".edge-source, .edge-target");
//     selectors.forEach((selector) => {
//       const currentValue = selector.value;
//       selector.innerHTML = `<option value="">${
//         selector.className.includes("source") ? "From" : "To"
//       }</option>`;
//       nodes.forEach((node) => {
//         selector.innerHTML += `<option value="${node}">${node}</option>`;
//       });
//       if (nodes.includes(currentValue)) selector.value = currentValue;
//     });
//   }

//   initializeControlsHandling();
// }

export function initializeUI(onDataSubmit) {
  const modal = document.getElementById("manual-input-modal");
  const manualInputBtn = document.getElementById("manual-input-btn");
  const closeBtn = document.getElementsByClassName("close")[0];
  const totalNodesInput = document.getElementById("total-nodes");
  const nodePreview = document.getElementById("node-preview");
  const addEdgeBtn = document.getElementById("add-edge");
  const edgesContainer = document.getElementById("edges-container");
  const submitGraphBtn = document.getElementById("submit-graph");

  // Modal controls
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

  totalNodesInput.addEventListener("input", () => {
    let value = parseInt(totalNodesInput.value);
    if (value < 2) totalNodesInput.value = 2;
    if (value > 26) totalNodesInput.value = 26;
    updateNodePreview();
    updateEdgeSelectors();
  });

  // Edge handling
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

    // Add event listeners to prevent reverse edges
    const sourceSelect = edgeDiv.querySelector(".edge-source");
    const targetSelect = edgeDiv.querySelector(".edge-target");

    sourceSelect.addEventListener("change", () =>
      validateEdgeSelection(sourceSelect, targetSelect)
    );
    targetSelect.addEventListener("change", () =>
      validateEdgeSelection(sourceSelect, targetSelect)
    );
  };

  document.addEventListener("click", (e) => {
    if (e.target.className === "remove-edge") {
      e.target.parentElement.remove();
    }
  });

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

    if (edges.length < 1) {
      alert("Please add at least 1 edge.");
      return;
    }

    onDataSubmit({ nodes, edges });
    modal.style.display = "none";
  };

  // Initialize UI
  addEdgeBtn.click();
  updateNodePreview();

  function updateNodePreview() {
    const count = parseInt(totalNodesInput.value);
    const nodes = Array.from({ length: count }, (_, i) =>
      String.fromCharCode(65 + i)
    );
    nodePreview.textContent = nodes.join(", ");
  }

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

  function validateEdgeSelection(sourceSelect, targetSelect) {
    const source = sourceSelect.value;
    const target = targetSelect.value;

    if (!source || !target) return;

    // Kiểm tra xem đã tồn tại cạnh ngược chưa (B->A khi đã có A->B)
    const existingEdges = Array.from(
      document.querySelectorAll(".edge-input")
    ).filter(
      (edgeDiv) =>
        edgeDiv.querySelector(".edge-source").value &&
        edgeDiv.querySelector(".edge-target").value
    );

    const hasReverseEdge = existingEdges.some((edgeDiv) => {
      const existingSource = edgeDiv.querySelector(".edge-source").value;
      const existingTarget = edgeDiv.querySelector(".edge-target").value;
      return existingSource === target && existingTarget === source;
    });

    if (hasReverseEdge) {
      alert(
        "Edge in opposite direction already exists! No need to add reverse edge."
      );
      sourceSelect.value = "";
      targetSelect.value = "";
    }
  }

  initializeControlsHandling();
}
function initializeControlsHandling() {
  const controls = document.querySelector(".controls");
  const playButton = document.getElementById("play-button");
  const toggleButton = document.getElementById("toggle-button");

  const expandControls = () => {
    controls.classList.remove("minimized");
    controls.style.transition = "all 0.3s ease";
  };

  const minimizeControls = () => {
    controls.classList.add("minimized");
    controls.style.transition = "all 0.3s ease";
  };

  // Minimize controls when play button is clicked
  playButton.addEventListener("click", () => {
    minimizeControls();
  });

  // Expand controls when clicking on minimized controls
  controls.addEventListener("click", (event) => {
    if (controls.classList.contains("minimized")) {
      if (event.target !== playButton) {
        expandControls();
      }
    }
  });

  // Prevent click propagation from inputs
  const inputs = controls.querySelectorAll("input, select, button");
  inputs.forEach((input) => {
    input.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });

  // Toggle controls with toggle button
  toggleButton.addEventListener("click", () => {
    if (controls.classList.contains("minimized")) {
      expandControls();
    } else {
      minimizeControls();
    }
  });
}

export function populateNodeDropdowns(data) {
  const startNodeSelect = document.getElementById("start-node");
  const endNodeSelect = document.getElementById("end-node");

  startNodeSelect.innerHTML = '<option value="">Select Start Node</option>';
  endNodeSelect.innerHTML = '<option value="">Select End Node</option>';

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

export function setupEventListeners(onFileLoad, onPlayAnimation) {
  const fileInput = document.getElementById("file-input");
  const playButton = document.getElementById("play-button");

  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await onFileLoad(file);
      } catch (error) {
        console.error(error);
        alert("Error loading file. Please check the file format.");
      }
    }
  });

  playButton.addEventListener("click", onPlayAnimation);
}
