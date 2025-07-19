import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize( window.innerWidth, window.innerHeight );

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});




// Add a high intensity directional light
const highIntensityDirLight = new THREE.DirectionalLight(0xffffff, 5.0);
highIntensityDirLight.position.set(10, 20, 10);
scene.add(highIntensityDirLight);


// Add a HemisphereLight for ambient sky/ground lighting
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// Add a DirectionalLight to simulate a key light (like a studio softbox)
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(5, 10, 7.5);
dirLight.castShadow = true;
scene.add(dirLight);

// Optionally, add a fill light for softer shadows
const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
fillLight.position.set(-5, 2, 2);
scene.add(fillLight);


// Add helpers for all the lights

// DirectionalLight helper for highIntensityDirLight
const highIntensityDirLightHelper = new THREE.DirectionalLightHelper(highIntensityDirLight, 2, 0xff0000);
scene.add(highIntensityDirLightHelper);

// HemisphereLight helper for hemiLight
const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 2);
scene.add(hemiLightHelper);

// DirectionalLight helper for dirLight (key light)
const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 2, 0x00ff00);
scene.add(dirLightHelper);

// DirectionalLight helper for fillLight
const fillLightHelper = new THREE.DirectionalLightHelper(fillLight, 2, 0x0000ff);
scene.add(fillLightHelper);

const loader = new THREE.TextureLoader();
const color = loader.load('./text/color.jpg');
const roughness = loader.load('./text/roughness.jpg');
const normal = loader.load('./text/normal.png');
let height = loader.load('./text/height.png');

// const geometry = new THREE.SphereGeometry( 1, 10, 10, 10 );
// const geometry = new THREE.CylinderGeometry( 1, 1, 1, 10, 10, true );
const geometry = new THREE.BoxGeometry( 3, 1.8, 2 );
const material = new THREE.MeshStandardMaterial( { map: color, roughnessmap: roughness, normalMap: normal,} );


// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;


// Add lil-gui panel for all the settings and mesh settings

// Assuming lil-gui is installed and imported as GUI
import GUI from 'lil-gui';

// Create GUI
const gui = new GUI();

// --- LIGHTS FOLDER ---
const lightsFolder = gui.addFolder('Lights');

// High Intensity Directional Light
const highIntensityDirLightFolder = lightsFolder.addFolder('High Intensity Dir Light');
highIntensityDirLightFolder.add(highIntensityDirLight, 'intensity', 0, 10).name('Intensity');
highIntensityDirLightFolder.addColor({color: highIntensityDirLight.color.getHex()}, 'color').onChange(v => highIntensityDirLight.color.set(v)).name('Color');
highIntensityDirLightFolder.add(highIntensityDirLight.position, 'x', -10, 10).name('Pos X');
highIntensityDirLightFolder.add(highIntensityDirLight.position, 'y', -10, 10).name('Pos Y');
highIntensityDirLightFolder.add(highIntensityDirLight.position, 'z', -10, 10).name('Pos Z');

// Hemisphere Light
const hemiLightFolder = lightsFolder.addFolder('Hemisphere Light');
hemiLightFolder.add(hemiLight, 'intensity', 0, 5).name('Intensity');
hemiLightFolder.addColor({skyColor: hemiLight.color.getHex()}, 'skyColor').onChange(v => hemiLight.color.set(v)).name('Sky Color');
hemiLightFolder.addColor({groundColor: hemiLight.groundColor.getHex()}, 'groundColor').onChange(v => hemiLight.groundColor.set(v)).name('Ground Color');
hemiLightFolder.add(hemiLight.position, 'x', -10, 10).name('Pos X');
hemiLightFolder.add(hemiLight.position, 'y', -10, 10).name('Pos Y');
hemiLightFolder.add(hemiLight.position, 'z', -10, 10).name('Pos Z');

// Key Directional Light
const dirLightFolder = lightsFolder.addFolder('Key Dir Light');
dirLightFolder.add(dirLight, 'intensity', 0, 5).name('Intensity');
dirLightFolder.addColor({color: dirLight.color.getHex()}, 'color').onChange(v => dirLight.color.set(v)).name('Color');
dirLightFolder.add(dirLight.position, 'x', -10, 10).name('Pos X');
dirLightFolder.add(dirLight.position, 'y', -10, 10).name('Pos Y');
dirLightFolder.add(dirLight.position, 'z', -10, 10).name('Pos Z');

// Fill Directional Light
const fillLightFolder = lightsFolder.addFolder('Fill Dir Light');
fillLightFolder.add(fillLight, 'intensity', 0, 2).name('Intensity');
fillLightFolder.addColor({color: fillLight.color.getHex()}, 'color').onChange(v => fillLight.color.set(v)).name('Color');
fillLightFolder.add(fillLight.position, 'x', -10, 10).name('Pos X');
fillLightFolder.add(fillLight.position, 'y', -10, 10).name('Pos Y');
fillLightFolder.add(fillLight.position, 'z', -10, 10).name('Pos Z');

lightsFolder.close();

// --- MESH FOLDER ---
const meshFolder = gui.addFolder('Mesh');

// Geometry settings (Box)
const geometryParams = {
  width: 3,
  height: 1.8,
  depth: 2
};
meshFolder.add(geometryParams, 'width', 0.1, 10).onChange(v => {
  cube.geometry.dispose();
  cube.geometry = new THREE.BoxGeometry(geometryParams.width, geometryParams.height, geometryParams.depth);
}).name('Width');
meshFolder.add(geometryParams, 'height', 0.1, 10).onChange(v => {
  cube.geometry.dispose();
  cube.geometry = new THREE.BoxGeometry(geometryParams.width, geometryParams.height, geometryParams.depth);
}).name('Height');
meshFolder.add(geometryParams, 'depth', 0.1, 10).onChange(v => {
  cube.geometry.dispose();
  cube.geometry = new THREE.BoxGeometry(geometryParams.width, geometryParams.height, geometryParams.depth);
}).name('Depth');

// Material settings
const materialParams = {
  roughness: material.roughness,
  metalness: material.metalness !== undefined ? material.metalness : 0,
  color: material.color.getHex(),
  wireframe: material.wireframe
};
meshFolder.add(materialParams, 'roughness', 0, 1).onChange(v => material.roughness = v).name('Roughness');
meshFolder.add(materialParams, 'metalness', 0, 1).onChange(v => material.metalness = v).name('Metalness');
meshFolder.addColor(materialParams, 'color').onChange(v => material.color.set(v)).name('Color');
meshFolder.add(materialParams, 'wireframe').onChange(v => material.wireframe = v).name('Wireframe');

// Mesh position/rotation/scale
const meshTransformFolder = meshFolder.addFolder('Transform');
meshTransformFolder.add(cube.position, 'x', -10, 10).name('Pos X');
meshTransformFolder.add(cube.position, 'y', -10, 10).name('Pos Y');
meshTransformFolder.add(cube.position, 'z', -10, 10).name('Pos Z');
meshTransformFolder.add(cube.rotation, 'x', 0, Math.PI * 2).name('Rot X');
meshTransformFolder.add(cube.rotation, 'y', 0, Math.PI * 2).name('Rot Y');
meshTransformFolder.add(cube.rotation, 'z', 0, Math.PI * 2).name('Rot Z');
meshTransformFolder.add(cube.scale, 'x', 0.1, 5).name('Scale X');
meshTransformFolder.add(cube.scale, 'y', 0.1, 5).name('Scale Y');
meshTransformFolder.add(cube.scale, 'z', 0.1, 5).name('Scale Z');

meshFolder.close();




function animate() {
  window.requestAnimationFrame(animate);
  renderer.render( scene, camera );
//   cube.rotation.x += 0.01;
// cube.rotation.y += 0.01;

controls.update();

}
animate();
