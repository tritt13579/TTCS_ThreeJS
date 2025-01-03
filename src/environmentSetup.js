import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

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

      // Check distance from edge midpoints
      for (const edge of data.edges) {
        const sourceNode = data.nodes.find((node) => node.id === edge.source);
        const targetNode = data.nodes.find((node) => node.id === edge.target);

        if (sourceNode && targetNode) {
          const midpoint = {
            x: (sourceNode.position.x + targetNode.position.x) / 2,
            z: (sourceNode.position.z + targetNode.position.z) / 2,
          };

          const distance = Math.sqrt(
            Math.pow(position.x - midpoint.x, 2) +
              Math.pow(position.z - midpoint.z, 2)
          );

          if (distance < minDistance) {
            validPosition = false;
            break;
          }
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
        tree.traverse((child) => {
          if (child.isMesh) {
            if (child.material && child.material.color) {
              child.material.color.multiplyScalar(0.98);
            }
          }
        });
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

export function createSnow(scene) {
  const particleCount = 10000; // Số lượng hạt tuyết
  const snowGeometry = new THREE.BufferGeometry();

  const textureLoader = new THREE.TextureLoader();
  const snowTexture = textureLoader.load("textures/snow_flake.png");

  // Tạo material với texture hoa tuyết
  const snowMaterial = new THREE.PointsMaterial({
    size: 1.8,
    map: snowTexture,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  // Tạo các hạt tuyết với các vị trí ngẫu nhiên
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = Math.random() * 1000 - 500;
    positions[i * 3 + 1] = Math.random() * 1000 - 500;
    positions[i * 3 + 2] = Math.random() * 1000 - 500;
  }

  snowGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  // Tạo hệ thống hạt tuyết dưới dạng sprite
  const snowParticles = new THREE.Points(snowGeometry, snowMaterial);
  scene.add(snowParticles);

  // Hàm cập nhật vị trí các hạt tuyết trong mỗi frame
  function updateSnow() {
    const positions = snowParticles.geometry.attributes.position.array;

    // Di chuyển các hạt tuyết theo trục Y (từ trên xuống)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] -= Math.random() * 1.5; // Làm cho tuyết rơi xuống dưới
      if (positions[i * 3 + 1] < -250) {
        positions[i * 3 + 1] = 250; // Khi tuyết ra ngoài phạm vi, đặt lại vị trí trên cao
      }
    }

    snowParticles.geometry.attributes.position.needsUpdate = true; // Cập nhật vị trí các hạt
  }

  return updateSnow;
}
