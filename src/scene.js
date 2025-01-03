import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { TextureLoader } from "three";

export function initScene() {
  const scene = new THREE.Scene();

  // Bầu trời HDRI
  new RGBELoader().load("textures/sky.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture; // Làm nền bầu trời
    scene.environment = texture; // Sử dụng làm ánh sáng môi trường
  });

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 200, 300);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  // Ánh sáng
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 0.05);
  sunLight.position.set(10, 100, 50);
  sunLight.castShadow = true;
  scene.add(sunLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2;
  controls.minDistance = 50;
  controls.maxDistance = 500;

  // Nền đất với texture và phản chiếu HDR
  const textureLoader = new TextureLoader();
  const snowTexture = textureLoader.load("textures/snow.jpg"); // Texture tuyết
  const normalTexture = textureLoader.load("textures/snow_normal.jpg"); // Normal map cho độ sâu

  const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
  const groundMaterial = new THREE.MeshPhysicalMaterial({
    map: snowTexture, // Áp dụng texture tuyết
    // normalMap: normalTexture, // Áp dụng normal map
    envMapIntensity: 0.5, // Phản chiếu HDR từ bầu trời
    roughness: 0.8, // Giữ độ nhám cao để tạo cảm giác tự nhiên
    metalness: 0.1, // Hiệu ứng kim loại nhẹ
  });

  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add(ground);

  // Cập nhật renderer mỗi frame
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  return { scene, camera, renderer, controls };
}
