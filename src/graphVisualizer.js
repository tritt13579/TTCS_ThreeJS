import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { applyForceDirectedLayout } from "./dataLoader.js";

let nodeLabels = []; // Mảng lưu các nhãn node
let edgeWeights = []; // Mảng lưu các trọng số cạnh

export async function displayNodes(scene, data, camera) {
  applyForceDirectedLayout(data);

  const houseLoader = new GLTFLoader();
  const fontLoader = new FontLoader();

  const font = await new Promise((resolve, reject) => {
    fontLoader.load(
      "/fonts/helvetiker_regular.typeface.json",
      resolve,
      undefined,
      reject
    );
  });

  for (const node of data.nodes) {
    try {
      const position = { x: node.x, y: 0, z: node.y };

      // Load house model
      const house = await loadHouseModel(houseLoader, position);
      scene.add(house);
      node.object = house;
      node.position = position;

      // Add label above the house
      const labelGeometry = new TextGeometry(node.id, {
        font: font,
        size: 7,
        depth: 1,
        curveSegments: 12,
      });
      const labelMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
      const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);

      // Set label position above the house
      labelMesh.position.set(position.x, position.y + 24, position.z);

      // Add label to scene and store it
      scene.add(labelMesh);
      nodeLabels.push(labelMesh); // Lưu nhãn node
    } catch (err) {
      console.error(`Cannot display node ${node.id}:`, err);
    }
  }
  return nodeLabels; // Trả về mảng nhãn node
}

function loadHouseModel(loader, position) {
  return new Promise((resolve, reject) => {
    loader.load(
      "/models/house.glb",
      (gltf) => {
        const house = gltf.scene;
        const bbox = new THREE.Box3().setFromObject(house);
        house.scale.set(48, 48, 48);
        house.position.set(position.x, -5, position.z);
        resolve(house);
      },
      undefined,
      (error) => {
        console.error("Error loading house model:", error);
        reject(error);
      }
    );
  });
}

export function displayEdges(scene, data, camera) {
  const fontLoader = new FontLoader();

  fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    data.edges.forEach((edge) => {
      const sourceNode = data.nodes.find((node) => node.id === edge.source);
      const targetNode = data.nodes.find((node) => node.id === edge.target);

      if (sourceNode && targetNode) {
        const points = [
          new THREE.Vector3(sourceNode.position.x, 5, sourceNode.position.z),
          new THREE.Vector3(targetNode.position.x, 5, targetNode.position.z),
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x999999 });
        const line = new THREE.Line(geometry, material);

        scene.add(line);

        const midpoint = new THREE.Vector3(
          (sourceNode.position.x + targetNode.position.x) / 2,
          2,
          (sourceNode.position.z + targetNode.position.z) / 2
        );

        const textGeometry = new TextGeometry(edge.weight.toString(), {
          font: font,
          size: 7,
          depth: 1,
          curveSegments: 12,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.set(midpoint.x, midpoint.y, midpoint.z);

        // Add text to scene and store it
        scene.add(textMesh);
        edgeWeights.push(textMesh); // Lưu trọng số cạnh
      } else {
        console.warn(`Cannot find node for edge:`, edge);
      }
    });
  });
  return edgeWeights; // Trả về mảng trọng số cạnh
}
