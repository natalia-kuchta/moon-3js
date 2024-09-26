import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import getStarfield from "./src/getStarfield.js";
import {getFresnelMat} from "./src/getFrenselMat.js";


const w = window.innerWidth;
const h = window.innerHeight;


const scene = new THREE.Scene();
const camera= new THREE.PerspectiveCamera(75,w/h,0.1, 1000);
camera.position.z = 4;


const renderer = new THREE.WebGLRenderer({antyalias: true});
renderer.setSize(w,h);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace =  THREE.LinearSRGBColorSpace;

new OrbitControls(camera, renderer.domElement);

const moonGroup = new THREE.Group();
moonGroup.rotation.z = -24.4 * Math.PI/180;
scene.add(moonGroup);

const detail = 10;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1,detail);
const material = new THREE.MeshPhongMaterial({
    map:loader.load("./textures/00_moon.jpg"),
    //specularMap: loader.load("./textures/02_moon.jpg"),
    bumpMap: loader.load("./textures/01_moon.jpg"),
    bumpScale: 0.04,

});

const moonMesh = new THREE.Mesh(geometry,material);
scene.add(moonMesh);

const lightsMaterial = new THREE.MeshBasicMaterial({
    map:loader.load("./textures/03_moon.jpg"),
    blending: THREE.AdditiveBlending,
});



const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry,fresnelMat);
glowMesh.scale.addScalar(0.01);
moonGroup.add(glowMesh);

const star = getStarfield({numStars:2000});
scene.add(star);

const moonLight = new THREE.DirectionalLight(0xffffff,3);
moonLight.position.set(-2,0.5,1.5);
scene.add(moonLight);


function animate(){
    requestAnimationFrame(animate);
    glowMesh.rotation.y += 0.002;
    moonMesh.rotation.y += 0.006;
    star.rotation.y += 0.0002;
    renderer.render(scene,camera);

}
animate();

function handleWindowResize(){
    camera.aspect =w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w,h);
}
window.addEventListener('resize', handleWindowResize, false);