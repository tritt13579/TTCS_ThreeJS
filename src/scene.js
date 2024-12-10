import * as THREE from "three";

export function initScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5dc);
  // scene.background = new THREE.Color(0xd3d3d3); // Light gray (xám nhạt)

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1);
  sunLight.position.set(10, 20, 10); // Vị trí ánh sáng mặt trời
  scene.add(sunLight);

  // Position camera from above and slightly angled
  camera.position.set(0, 200, 200);
  camera.lookAt(0, 0, 0);

  return { scene, camera, renderer };
}
