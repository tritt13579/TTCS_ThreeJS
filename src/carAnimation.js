import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

export async function animateCar(scene, data, path) {
  const carLoader = new GLTFLoader();
  let car;
  let baseSpeed = 1.2;
  let speedMultiplier = 1;

  // Get speed control elements
  const speedControl = document.getElementById("speed-control");
  const speedValue = document.getElementById("speed-value");

  // Update speed multiplier when slider changes
  speedControl.addEventListener("input", (e) => {
    speedMultiplier = parseFloat(e.target.value);
    speedValue.textContent = `${speedMultiplier}x`;
  });

  // Xóa xe cũ trước khi tạo xe mới
  const existingCar = scene.getObjectByName("animatedCar");
  if (existingCar) {
    scene.remove(existingCar);
    console.log("Old car removed.");
  }

  // Load the 3D car model
  try {
    car = await loadCarModel(carLoader);
    car.name = "animatedCar";
    scene.add(car);
  } catch (error) {
    console.error("Error loading car model:", error);
    return;
  }

  // Kiểm tra đường đi hợp lệ
  if (!path || path.length < 2) {
    console.error("Invalid path: Path is empty or too short.");
    alert("No valid path for the car to follow.");
    return;
  }

  // Xử lý đường đi với đường cong Bezier
  const pathEdges = [];
  for (let i = 0; i < path.length - 1; i++) {
    const sourceNode = data.nodes.find((node) => node.id === path[i]);
    const targetNode = data.nodes.find((node) => node.id === path[i + 1]);

    if (!sourceNode || !targetNode) {
      console.error(`Node not found: ${path[i]} or ${path[i + 1]}`);
      alert("Path contains invalid nodes.");
      return;
    }

    // Tính toán điểm điều khiển cho đường cong Bezier
    const midPoint = new THREE.Vector3(
      (sourceNode.position.x + targetNode.position.x) / 2,
      5,
      (sourceNode.position.z + targetNode.position.z) / 2
    );

    // Tạo đường cong Bezier
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(sourceNode.position.x, 5, sourceNode.position.z),
      midPoint,
      new THREE.Vector3(targetNode.position.x, 5, targetNode.position.z)
    );

    // Giảm số điểm trên đường cong để tăng tốc độ
    const curvePoints = curve.getPoints(100); // Giảm từ 200 xuống 100 điểm
    pathEdges.push(...curvePoints);
  }

  // Kiểm tra nếu không có điểm nào được tạo
  if (pathEdges.length < 2) {
    console.error("No valid path points generated");
    return;
  }

  let currentIndex = 0;
  let currentRotation = 0;
  const rotationLerpFactor = 0.1;
  let animationId = null;

  function animate() {
    // Kiểm tra điều kiện dừng
    if (currentIndex >= pathEdges.length - 1) {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      console.log("Animation completed.");
      return;
    }

    // Lấy điểm hiện tại và điểm tiếp theo
    const currentPoint = pathEdges[Math.floor(currentIndex)];
    const nextPoint =
      pathEdges[Math.min(Math.floor(currentIndex) + 1, pathEdges.length - 1)];

    // Kiểm tra tính hợp lệ của các điểm
    if (!currentPoint || !nextPoint) {
      console.error("Invalid path points");
      cancelAnimationFrame(animationId);
      return;
    }

    // Di chuyển xe
    car.position.set(currentPoint.x, currentPoint.y, currentPoint.z);

    // Tính toán hướng xe
    const direction = new THREE.Vector3()
      .subVectors(nextPoint, currentPoint)
      .normalize();

    // Tính góc quay mục tiêu
    const targetRotation = Math.atan2(direction.x, direction.z);

    // Xử lý việc quay xe mượt mà
    let rotationDiff = targetRotation - currentRotation;

    // Xử lý trường hợp quay qua 180 độ
    if (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
    if (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;

    // Áp dụng lerp cho góc quay
    currentRotation += rotationDiff * rotationLerpFactor;
    car.rotation.y = currentRotation;

    // Điều chỉnh tốc độ dựa trên góc quay và speed multiplier
    const turnSpeedMultiplier = Math.abs(rotationDiff) > Math.PI / 4 ? 0.7 : 1; // Tăng tốc độ khi rẽ
    const finalSpeed = baseSpeed * turnSpeedMultiplier * speedMultiplier;
    currentIndex += finalSpeed;

    // Tiếp tục animation
    animationId = requestAnimationFrame(animate);
  }

  // Bắt đầu animation
  animate();

  // Return một hàm cleanup để có thể dừng animation khi cần
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    // Remove event listener when animation is cleaned up
    speedControl.removeEventListener("input");
  };
}

function loadCarModel(loader) {
  return new Promise((resolve, reject) => {
    loader.load(
      "/models/car.glb",
      (gltf) => {
        const car = gltf.scene;
        car.scale.set(10, 10, 10);
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
