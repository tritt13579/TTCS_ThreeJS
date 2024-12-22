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

  // Kiểm tra nếu không có đường đi hợp lệ
  if (!path || path.length < 2) {
    console.error("Invalid path: Path is empty or too short.");
    alert("No valid path for the car to follow.");
    return;
  }

  // Xử lý đường đi
  const pathEdges = [];
  for (let i = 0; i < path.length - 1; i++) {
    const sourceNode = data.nodes.find((node) => node.id === path[i]);
    const targetNode = data.nodes.find((node) => node.id === path[i + 1]);

    if (!sourceNode || !targetNode) {
      console.error(`Node not found: ${path[i]} or ${path[i + 1]}`);
      alert("Path contains invalid nodes.");
      return;
    }

    // Tạo đường cong Bezier
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
    pathEdges.push(...curve.getPoints(150)); // Sử dụng nhiều điểm để mượt
  }

  let currentIndex = 0; // Điểm hiện tại trong đường dẫn

  // Hàm animate
  function animate() {
    if (currentIndex >= pathEdges.length) {
      console.log("Animation completed.");
      return;
    }

    // Cập nhật vị trí xe
    const currentPoint = pathEdges[currentIndex];
    car.position.set(currentPoint.x, currentPoint.y, currentPoint.z);

    // Tính toán hướng xe
    if (currentIndex < pathEdges.length - 1) {
      const nextPoint = pathEdges[currentIndex + 1];
      const direction = new THREE.Vector3()
        .subVectors(nextPoint, currentPoint)
        .normalize();

      const targetRotation = Math.atan2(direction.x, direction.z);
      const rotationSpeed = 0.1; // Tốc độ quay của xe
      car.rotation.y += rotationSpeed * (targetRotation - car.rotation.y);
      // car.rotation.y = targetRotation;
    }

    currentIndex++;
    requestAnimationFrame(animate); // Gọi lại animate
  }

  // Bắt đầu animation
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
