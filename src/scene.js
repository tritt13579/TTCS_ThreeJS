// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// export function initScene() {
//   const scene = new THREE.Scene();
//   scene.background = new THREE.Color(0xdddddd); // Màu nền

//   const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   );

//   const renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   document.body.appendChild(renderer.domElement);

//   // Ambient light
//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//   scene.add(ambientLight);

//   const sunLight = new THREE.DirectionalLight(0xffffff, 1);
//   sunLight.position.set(10, 20, 10); // Vị trí ánh sáng mặt trời
//   scene.add(sunLight);

//   // Position camera from above and slightly angled
//   camera.position.set(0, 200, 200);
//   camera.lookAt(0, 0, 0);

//   // Controls
//   const controls = new OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true; // Hiệu ứng làm mềm chuyển động
//   controls.dampingFactor = 0.05; // Độ mượt khi xoay
//   controls.screenSpacePanning = false; // Không cho phép di chuyển ngang
//   controls.maxPolarAngle = Math.PI / 2; // Giới hạn góc nhìn từ trên xuống
//   controls.minDistance = 50; // Giới hạn phóng gần
//   controls.maxDistance = 500; // Giới hạn phóng xa

//   // Tạo lớp tuyết phủ lên mặt đất
//   const snowGroundGeometry = new THREE.PlaneGeometry(500, 500);
//   const snowGroundMaterial = new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     side: THREE.DoubleSide,
//   });
//   const snowGround = new THREE.Mesh(snowGroundGeometry, snowGroundMaterial);
//   snowGround.rotation.x = -Math.PI / 2; // Xoay để mặt đất nằm ngang
//   snowGround.position.y = -10; // Đặt gần mặt đất
//   scene.add(snowGround);

//   return { scene, camera, renderer, controls };
// }

// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { TextureLoader } from "three";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// export function initScene() {
//   const scene = new THREE.Scene();

//   // Bầu trời
//   new RGBELoader().load("textures/sky.hdr", (texture) => {
//     texture.mapping = THREE.EquirectangularReflectionMapping; // Ánh xạ toàn cảnh
//     scene.background = texture; // Làm nền bầu trời
//     scene.environment = texture; // Sử dụng làm ánh sáng môi trường
//   });

//   const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   );

//   const renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   document.body.appendChild(renderer.domElement);

//   // Ánh sáng
//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//   scene.add(ambientLight);

//   const sunLight = new THREE.DirectionalLight(0xffffff, 1);
//   sunLight.position.set(10, 20, 10); // Vị trí ánh sáng mặt trời
//   sunLight.castShadow = true; // Tạo bóng
//   scene.add(sunLight);

//   // Camera position
//   camera.position.set(0, 200, 200);
//   camera.lookAt(0, 0, 0);

//   // Controls
//   const controls = new OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.dampingFactor = 0.05;
//   controls.screenSpacePanning = false;
//   controls.maxPolarAngle = Math.PI / 2;
//   controls.minDistance = 50;
//   controls.maxDistance = 500;

//   // Tạo nền tuyết
//   const snowTexture = new TextureLoader().load("textures/snow.jpg"); // Đường dẫn đến file ảnh texture tuyết
//   const snowGroundGeometry = new THREE.PlaneGeometry(500, 500);
//   const snowGroundMaterial = new THREE.MeshPhongMaterial({
//     map: snowTexture,
//     shininess: 10, // Độ bóng của mặt tuyết
//   });
//   const snowGround = new THREE.Mesh(snowGroundGeometry, snowGroundMaterial);
//   snowGround.rotation.x = -Math.PI / 2;
//   snowGround.position.y = 0;
//   snowGround.receiveShadow = true;
//   scene.add(snowGround);

//   return { scene, camera, renderer, controls };
// }

// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { TextureLoader } from "three";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// export function initScene() {
//   const scene = new THREE.Scene();

//   // Bầu trời HDRI
//   new RGBELoader().load("textures/sky4.hdr", (texture) => {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     scene.background = texture; // Làm nền bầu trời
//     scene.environment = texture; // Sử dụng làm ánh sáng môi trường
//   });

//   // Camera
//   const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   );
//   camera.position.set(0, 200, 200);
//   camera.lookAt(0, 0, 0);

//   // Renderer
//   const renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.toneMapping = THREE.ACESFilmicToneMapping;
//   renderer.outputEncoding = THREE.sRGBEncoding;
//   document.body.appendChild(renderer.domElement);

//   // Ánh sáng
//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
//   scene.add(ambientLight);

//   const sunLight = new THREE.DirectionalLight(0xffffff, 0.1);
//   sunLight.position.set(10, 100, 50);
//   sunLight.castShadow = true;
//   scene.add(sunLight);

//   // Controls
//   const controls = new OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.dampingFactor = 0.05;
//   controls.maxPolarAngle = Math.PI / 2;
//   controls.minDistance = 50;
//   controls.maxDistance = 500;

//   // Nền đất mở rộng với texture tuyết
//   const snowTexture = new TextureLoader().load("textures/snow2.jpg");
//   snowTexture.wrapS = snowTexture.wrapT = THREE.RepeatWrapping;
//   snowTexture.repeat.set(20, 20); // Lặp texture để mặt đất lớn hơn

//   const snowGroundGeometry = new THREE.PlaneGeometry(500, 500); // Mở rộng kích thước mặt đất
//   const snowGroundMaterial = new THREE.MeshStandardMaterial({
//     map: snowTexture,
//     roughness: 0.8,
//     metalness: 0,
//   });
//   const snowGround = new THREE.Mesh(snowGroundGeometry, snowGroundMaterial);
//   snowGround.rotation.x = -Math.PI / 2;
//   snowGround.position.y = 0;
//   snowGround.receiveShadow = true;
//   scene.add(snowGround);

//   // Cập nhật renderer mỗi frame
//   function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
//   }

//   animate();

//   return { scene, camera, renderer, controls };
// }

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
