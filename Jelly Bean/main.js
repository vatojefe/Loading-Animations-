import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Set up scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8B0000); // Set background color to orange

// Set up camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Set up renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Set up light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// Load glTF model with animation
const loader = new GLTFLoader();
let mixer;

loader.load('/Jelly/Moon-Jelly.gltf', (gltf) => {
    const model = gltf.scene;
    const animations = gltf.animations;

    if (animations && animations.length) {
        mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(animations[0]);
        console.log('Duration: ', action.getClip().duration);
        console.log('Time Scale: ', mixer.timeScale);
        action.play();
    }

    scene.add(model);
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
let then = Date.now();

const animate = () => {
    requestAnimationFrame(animate);

    let now = Date.now();
    let delta = (now - then) / 1000; // Convert milliseconds to seconds
    then = now;

    if (mixer) {
        mixer.update(delta);
    }

    controls.update();
    renderer.render(scene, camera);
};

animate();

