import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export async function addTreesAround(scene, data) {
  const treeLoader = new GLTFLoader();
  const trees = [];
  const range = 350;
  const minDistance = 50;

  for (let i = 0; i < 10; i++) {
    let validPosition = false;
    let position;

    while (!validPosition) {
      position = {
        x: Math.random() * range - range / 2,
        y: 0,
        z: Math.random() * range - range / 2,
      };

      validPosition = true;

      // Check distance from houses
      for (const node of data.nodes) {
        const distance = Math.sqrt(
          Math.pow(position.x - node.position.x, 2) +
            Math.pow(position.z - node.position.z, 2)
        );
        if (distance < minDistance) {
          validPosition = false;
          break;
        }
      }

      // Check distance from other trees
      for (const tree of trees) {
        const distance = Math.sqrt(
          Math.pow(position.x - tree.position.x, 2) +
            Math.pow(position.z - tree.position.z, 2)
        );
        if (distance < minDistance) {
          validPosition = false;
          break;
        }
      }
    }

    try {
      const tree = await loadTreeModel(treeLoader, position);
      scene.add(tree);
      trees.push(tree);
    } catch (error) {
      console.error("Cannot add tree:", error);
    }
  }
}

function loadTreeModel(loader, position) {
  return new Promise((resolve, reject) => {
    loader.load(
      "/models/tree.glb",
      (gltf) => {
        const tree = gltf.scene;
        tree.scale.set(0.05, 0.05, 0.05);
        tree.position.set(position.x, position.y, position.z);
        resolve(tree);
      },
      undefined,
      (error) => {
        console.error("Error loading tree model:", error);
        reject(error);
      }
    );
  });
}
