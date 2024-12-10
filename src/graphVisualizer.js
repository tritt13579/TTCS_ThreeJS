import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { applyForceDirectedLayout } from "./dataLoader.js";

// export async function displayNodes(scene, data, camera) {
//   applyForceDirectedLayout(data);

//   const houseLoader = new GLTFLoader();
//   const fontLoader = new FontLoader();

//   // Load font once to use for all labels
//   const font = await new Promise((resolve, reject) => {
//     fontLoader.load(
//       "/fonts/helvetiker_regular.typeface.json",
//       resolve,
//       undefined,
//       reject
//     );
//   });

//   for (const node of data.nodes) {
//     try {
//       const position = { x: node.x, y: 0, z: node.y };

//       // Load house model
//       const house = await loadHouseModel(houseLoader, position);
//       scene.add(house);
//       node.object = house;
//       node.position = position;

//       // Add label above the house
//       const labelGeometry = new TextGeometry(node.id, {
//         font: font,
//         size: 8, // Kích thước văn bản
//         height: 1, // Độ dày văn bản
//         curveSegments: 12,
//       });
//       const labelMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Màu xanh cho chữ
//       const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);

//       // Đặt vị trí văn bản phía trên ngôi nhà
//       labelMesh.position.set(position.x, position.y + 40, position.z);

//       // Xoay văn bản về hướng cụ thể
//       const targetPosition = new THREE.Vector3(0, 0, 0); // Hướng về trung tâm đồ thị
//       labelMesh.lookAt(targetPosition);

//       scene.add(labelMesh);

//       // Hiệu ứng nhẹ (nếu cần)
//       function animateLabel() {
//         // labelMesh.rotation.y += 0.005; // Xoay nhẹ quanh trục Y
//         requestAnimationFrame(animateLabel);
//       }
//       animateLabel();
//     } catch (err) {
//       console.error(`Cannot display node ${node.id}:`, err);
//     }
//   }
// }

export async function displayNodes(scene, data, camera) {
  applyForceDirectedLayout(data);

  const houseLoader = new GLTFLoader();
  const fontLoader = new FontLoader();

  // Load font once to use for all labels
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
        size: 7, // Kích thước văn bản
        depth: 1, // Độ dày văn bản
        curveSegments: 12,
      });
      const labelMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Màu xanh cho chữ
      const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);

      // Đặt vị trí văn bản phía trên ngôi nhà
      labelMesh.position.set(position.x, position.y + 24, position.z);

      // Nghiêng văn bản 45 độ trên trục X hoặc Z
      // labelMesh.rotation.set(
      //   THREE.MathUtils.degToRad(45), // Nghiêng 45 độ trên trục X
      //   0, // Không xoay trên trục Y
      //   THREE.MathUtils.degToRad(45) // Nghiêng 45 độ trên trục Z
      // );

      labelMesh.rotation.x = -Math.PI / 4; // Nghiêng 45 độ trên trục X

      scene.add(labelMesh);
    } catch (err) {
      console.error(`Cannot display node ${node.id}:`, err);
    }
  }
}

function loadHouseModel(loader, position) {
  return new Promise((resolve, reject) => {
    loader.load(
      "/models/house.glb",
      (gltf) => {
        const house = gltf.scene;
        house.scale.set(48, 48, 48);
        house.position.set(position.x, position.y, position.z);
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

// export function displayEdges(scene, data, camera) {
//   const fontLoader = new FontLoader();

//   // Load font for displaying weights
//   fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
//     data.edges.forEach((edge) => {
//       const sourceNode = data.nodes.find((node) => node.id === edge.source);
//       const targetNode = data.nodes.find((node) => node.id === edge.target);

//       if (sourceNode && targetNode) {
//         // Tạo các điểm để tạo đường cong
//         const points = [
//           new THREE.Vector3(sourceNode.position.x, 5, sourceNode.position.z),
//           new THREE.Vector3(
//             (sourceNode.position.x + targetNode.position.x) / 2,
//             5 + Math.random() * 10,
//             (sourceNode.position.z + targetNode.position.z) / 2
//           ),
//           new THREE.Vector3(targetNode.position.x, 5, targetNode.position.z),
//         ];

//         // Tạo một đường cong bằng CatmullRomCurve3
//         const curve = new THREE.CatmullRomCurve3(points);

//         // Lấy các điểm trên đường cong
//         const curvePoints = curve.getPoints(50); // 50 điểm cho độ mượt

//         const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
//         const material = new THREE.LineBasicMaterial({ color: 0x999999 });
//         const line = new THREE.Line(geometry, material);

//         scene.add(line);

//         // Vị trí trung tâm cạnh để đặt trọng số
//         const midpoint = new THREE.Vector3(
//           (sourceNode.position.x + targetNode.position.x) / 2,
//           2, // Đặt gần mặt đất
//           (sourceNode.position.z + targetNode.position.z) / 2
//         );

//         // Tạo đối tượng văn bản để hiển thị trọng số
//         const textGeometry = new TextGeometry(edge.weight.toString(), {
//           font: font,
//           size: 7, // Tăng kích thước văn bản để dễ đọc
//           depth: 1,
//           curveSegments: 12,
//         });
//         const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Màu đen cho trọng số
//         const textMesh = new THREE.Mesh(textGeometry, textMaterial);

//         // Đặt vị trí trọng số
//         textMesh.position.set(midpoint.x, midpoint.y, midpoint.z);

//         // Hướng trọng số luôn đối diện camera
//         textMesh.quaternion.copy(camera.quaternion);

//         scene.add(textMesh);
//       } else {
//         console.warn(`Cannot find node for edge:`, edge);
//       }
//     });
//   });
// }

export function displayEdges(scene, data, camera) {
  const fontLoader = new FontLoader();

  // Load font for displaying weights
  fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    data.edges.forEach((edge) => {
      const sourceNode = data.nodes.find((node) => node.id === edge.source);
      const targetNode = data.nodes.find((node) => node.id === edge.target);

      if (sourceNode && targetNode) {
        // Tạo một đường thẳng từ nguồn đến đích
        const points = [
          new THREE.Vector3(sourceNode.position.x, 5, sourceNode.position.z),
          new THREE.Vector3(targetNode.position.x, 5, targetNode.position.z),
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x999999 });
        const line = new THREE.Line(geometry, material);

        scene.add(line);

        // Vị trí trung tâm cạnh để đặt trọng số
        const midpoint = new THREE.Vector3(
          (sourceNode.position.x + targetNode.position.x) / 2,
          2, // Đặt gần mặt đất
          (sourceNode.position.z + targetNode.position.z) / 2
        );

        // Tạo đối tượng văn bản để hiển thị trọng số
        const textGeometry = new TextGeometry(edge.weight.toString(), {
          font: font,
          size: 7, // Tăng kích thước văn bản để dễ đọc
          depth: 1,
          curveSegments: 12,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Màu đen cho trọng số
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Đặt vị trí trọng số
        textMesh.position.set(midpoint.x, midpoint.y, midpoint.z);

        // Hướng trọng số luôn đối diện camera
        textMesh.quaternion.copy(camera.quaternion);

        scene.add(textMesh);
      } else {
        console.warn(`Cannot find node for edge:`, edge);
      }
    });
  });
}
