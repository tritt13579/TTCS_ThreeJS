import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

export async function animateCar(scene, data, path) {
  const carLoader = new GLTFLoader();
  let car;

  // Xóa xe cũ trước khi tạo xe mới
  const existingCar = scene.getObjectByName("animatedCar");
  if (existingCar) {
    scene.remove(existingCar);
    console.log("Old car removed.");
  }

  // Load the 3D car model
  try {
    car = await loadCarModel(carLoader);
    car.name = "animatedCar"; // Đặt tên cho xe
    scene.add(car);
  } catch (error) {
    console.error("Error loading car model:", error);
    return;
  }

  const pathEdges = [];
  const pathDirections = [];

  for (let i = 0; i < path.length - 1; i++) {
    const sourceNode = data.nodes.find((node) => node.id === path[i]);
    const targetNode = data.nodes.find((node) => node.id === path[i + 1]);

    // Tạo đường cong Bezier để làm mượt việc chuyển động giữa các node
    const controlPoint = new THREE.Vector3(
      (sourceNode.position.x + targetNode.position.x) / 2,
      5,
      (sourceNode.position.z + targetNode.position.z) / 2
    );

    const points = [
      new THREE.Vector3(sourceNode.position.x, 5, sourceNode.position.z),
      controlPoint,
      new THREE.Vector3(targetNode.position.x, 5, targetNode.position.z),
    ];

    const curve = new THREE.QuadraticBezierCurve3(
      points[0],
      points[1],
      points[2]
    );
    const curvePoints = curve.getPoints(150);
    pathEdges.push(curvePoints);

    // Tính toán hướng của đoạn đường
    const direction = new THREE.Vector3()
      .subVectors(targetNode.position, sourceNode.position)
      .normalize();
    pathDirections.push(direction);
  }

  let segmentIndex = 0;
  let pointIndex = 0;
  let currentRotation = 0;

  function animate() {
    if (segmentIndex >= pathEdges.length) return;

    const points = pathEdges[segmentIndex];
    const point = points[pointIndex];

    // Di chuyển xe
    car.position.set(point.x, 5, point.z);

    // Tính toán và làm mượt việc xoay xe
    if (pointIndex < points.length - 1) {
      const nextPoint = points[pointIndex + 1];
      const direction = new THREE.Vector3()
        .subVectors(nextPoint, point)
        .normalize();

      // Tính góc xoay mới
      const targetRotation = Math.atan2(direction.x, direction.z);

      // Làm mượt việc xoay xe
      const rotationSpeed = 0.1; // Tốc độ xoay, điều chỉnh để phù hợp
      currentRotation += (targetRotation - currentRotation) * rotationSpeed;

      car.rotation.y = currentRotation;
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
            child.castShadow = true;
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
