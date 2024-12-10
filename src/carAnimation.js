// import * as THREE from "three";

// export async function animateCar(scene, data, path) {
//   const carGeometry = new THREE.BoxGeometry(5, 5, 10);
//   const carMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//   const car = new THREE.Mesh(carGeometry, carMaterial);
//   scene.add(car);

//   const pathEdges = [];
//   for (let i = 0; i < path.length - 1; i++) {
//     const sourceNode = data.nodes.find((node) => node.id === path[i]);
//     const targetNode = data.nodes.find((node) => node.id === path[i + 1]);

//     const midPoint = new THREE.Vector3(
//       (sourceNode.position.x + targetNode.position.x) / 2,
//       5 + Math.random() * 10,
//       (sourceNode.position.z + targetNode.position.z) / 2
//     );
//     const points = [
//       new THREE.Vector3(sourceNode.position.x, 5, sourceNode.position.z),
//       midPoint,
//       new THREE.Vector3(targetNode.position.x, 5, targetNode.position.z),
//     ];

//     const curve = new THREE.CatmullRomCurve3(points);
//     pathEdges.push(curve.getPoints(100)); // 100 points for smooth animation
//   }

//   let segmentIndex = 0;
//   let pointIndex = 0;

//   function animate() {
//     if (segmentIndex >= pathEdges.length) return;

//     const points = pathEdges[segmentIndex];
//     const point = points[pointIndex];
//     car.position.set(point.x, point.y, point.z);

//     pointIndex++;
//     if (pointIndex >= points.length) {
//       segmentIndex++;
//       pointIndex = 0;
//     }

//     requestAnimationFrame(animate);
//   }

//   animate();
// }

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import * as THREE from "three";

// export async function animateCar(scene, data, path) {
//   const carLoader = new GLTFLoader();
//   let car;

//   // Load the 3D car model
//   try {
//     car = await loadCarModel(carLoader);
//     scene.add(car);
//   } catch (error) {
//     console.error("Error loading car model:", error);
//     return;
//   }

//   const pathEdges = [];
//   for (let i = 0; i < path.length - 1; i++) {
//     const sourceNode = data.nodes.find((node) => node.id === path[i]);
//     const targetNode = data.nodes.find((node) => node.id === path[i + 1]);

//     const midPoint = new THREE.Vector3(
//       (sourceNode.position.x + targetNode.position.x) / 2,
//       5 + Math.random() * 10,
//       (sourceNode.position.z + targetNode.position.z) / 2
//     );
//     const points = [
//       new THREE.Vector3(sourceNode.position.x, 5, sourceNode.position.z),
//       midPoint,
//       new THREE.Vector3(targetNode.position.x, 5, targetNode.position.z),
//     ];

//     const curve = new THREE.CatmullRomCurve3(points);
//     pathEdges.push(curve.getPoints(100)); // 100 points for smooth animation
//   }

//   let segmentIndex = 0;
//   let pointIndex = 0;

//   function animate() {
//     if (segmentIndex >= pathEdges.length) return;

//     const points = pathEdges[segmentIndex];
//     const point = points[pointIndex];
//     car.position.set(point.x, point.y, point.z);

//     // Rotate the car to align with the movement direction
//     if (pointIndex < points.length - 1) {
//       const nextPoint = points[pointIndex + 1];
//       const direction = new THREE.Vector3()
//         .subVectors(nextPoint, point)
//         .normalize();
//       const quaternion = new THREE.Quaternion();
//       quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
//       car.quaternion.copy(quaternion);
//     }

//     pointIndex++;
//     if (pointIndex >= points.length) {
//       segmentIndex++;
//       pointIndex = 0;
//     }

//     requestAnimationFrame(animate);
//   }

//   animate();
// }

// // Helper function to load car model
// function loadCarModel(loader) {
//   return new Promise((resolve, reject) => {
//     loader.load(
//       "/models/car.glb",
//       (gltf) => {
//         const car = gltf.scene;
//         car.scale.set(10, 10, 10); // Adjust scale as needed
//         car.traverse((child) => {
//           if (child.isMesh) {
//             child.castShadow = true; // Enable shadows if needed
//           }
//         });
//         resolve(car);
//       },
//       undefined,
//       (error) => {
//         console.error("Error loading car model:", error);
//         reject(error);
//       }
//     );
//   });
// }

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

export async function animateCar(scene, data, path) {
  const carLoader = new GLTFLoader();
  let car;

  // Load the 3D car model
  try {
    car = await loadCarModel(carLoader);
    scene.add(car);
  } catch (error) {
    console.error("Error loading car model:", error);
    return;
  }

  const pathEdges = [];
  for (let i = 0; i < path.length - 1; i++) {
    const sourceNode = data.nodes.find((node) => node.id === path[i]);
    const targetNode = data.nodes.find((node) => node.id === path[i + 1]);

    const midPoint = new THREE.Vector3(
      (sourceNode.position.x + targetNode.position.x) / 2,
      5 + Math.random() * 10,
      (sourceNode.position.z + targetNode.position.z) / 2
    );
    const points = [
      new THREE.Vector3(sourceNode.position.x, 5, sourceNode.position.z),
      midPoint,
      new THREE.Vector3(targetNode.position.x, 5, targetNode.position.z),
    ];

    const curve = new THREE.CatmullRomCurve3(points);
    pathEdges.push(curve.getPoints(100)); // 100 points for smooth animation
  }

  let segmentIndex = 0;
  let pointIndex = 0;

  function animate() {
    if (segmentIndex >= pathEdges.length) return;

    const points = pathEdges[segmentIndex];
    const point = points[pointIndex];
    car.position.set(point.x, point.y, point.z);

    // Rotate the car to align with the movement direction
    if (pointIndex < points.length - 1) {
      const nextPoint = points[pointIndex + 1];
      const direction = new THREE.Vector3()
        .subVectors(nextPoint, point)
        .normalize();
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
      car.quaternion.copy(quaternion);
    }

    pointIndex++;
    if (pointIndex >= points.length) {
      segmentIndex++;
      pointIndex = 0;
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// Helper function to load car model
function loadCarModel(loader) {
  return new Promise((resolve, reject) => {
    loader.load(
      "/models/car.glb",
      (gltf) => {
        const car = gltf.scene;
        car.scale.set(10, 10, 10); // Adjust scale as needed
        car.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true; // Enable shadows if needed
          }
        });
        resolve(car);
      },
      undefined,
      (error) => {
        console.error("Error loading car model:", error);
        reject(error);
      }
    );
  });
}
