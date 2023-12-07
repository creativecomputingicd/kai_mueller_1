//IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

//CONSTANT & VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;
//-- GUI PARAMETERS
var gui;
const parameters = {
  resolutionX: 25,
  domino: 0,
  offset: 0,
  modification: 0
}

//-- SCENE VARIABLES
var scene;
var camera;
var renderer;
var container;
var control;
var ambientLight;
var directionalLight;

//-- GEOMETRY PARAMETERS
//Create an empty array for storing all the cubes
let sceneCubes = [];
let resX = parameters.resolutionX;
let dom = parameters.domino;
let off = parameters.offset;
let mod = parameters.modification;


function main(){
  //GUI
  gui = new GUI;
  gui.add(parameters, 'resolutionX', 1, 50, 1);
  gui.add(parameters, 'domino', 0, 90, 1);
  gui.add(parameters, 'offset', 0, 50);
  gui.add(parameters, 'modification', -1, 0);

  //CREATE SCENE AND CAMERA
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 40, width / height, 0.1, 1000);
  camera.position.set(-70, 20, 60);

  //LIGHTINGS
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight( 0xffffff, 5);
  directionalLight.position.set(2,5,5);
  directionalLight.target.position.set(-1,-1,0);
  scene.add( directionalLight );
  scene.add(directionalLight.target);

  //GEOMETRY INITIATION
  // Initiate first cubes
  createCubes();
  dominoCubes();

  //RESPONSIVE WINDOW
  window.addEventListener('resize', handleResize);
 
  //CREATE A RENDERER
  renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container = document.querySelector('#threejs-container');
  container.append(renderer.domElement);
  
  //CREATE MOUSE CONTROL
  control = new OrbitControls( camera, renderer.domElement );

  //EXECUTE THE UPDATE
  animate();
}
 
//-----------------------------------------------------------------------------------
//HELPER FUNCTIONS
//-----------------------------------------------------------------------------------
//GEOMETRY FUNCTIONS
// Create Cubes
function createCubes(){
  for(let i=0; i<resX; i++){
    let box_y = 10+(mod*i);
    if (box_y >= 0){

      const geometry = new THREE.BoxGeometry(1, box_y, 5);
      const material = new THREE.MeshPhysicalMaterial();
      material.color = new THREE.Color(0xffffff);
      material.color.setRGB(0,0,i);

      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(i+1, 0, 0);
      cube.name = "cube " + i;
      sceneCubes.push(cube);

      scene.add(cube);
    }
  }
}

/*
//Rotate Cubes
function rotateCubes(){
  sceneCubes.forEach((element, index)=>{
    let scene_cube = scene.getObjectByName(element.name);
    let radian_rot = (index*(rotX/resX)) * (Math.PI/180);
    scene_cube.rotation.set(radian_rot, 0, 0);
    rotX = parameters.rotationX;
  })
}
*/

//Domino Cubes
function dominoCubes(){
  sceneCubes.forEach((element, index)=>{
    let scene_cube = scene.getObjectByName(element.name);
    let domino_tilt =  (dom * (index/sceneCubes.length)) * (Math.PI/180);
    scene_cube.rotation.set(0, 0, domino_tilt);
    scene_cube.position.x += off*index*0.1;
    //scene_cube.scale.set(0.1*index, index*mod, 1);
  })
}

/*
//Modify Cubes (Scale and Distance)
function modCubes(){
  sceneCubes.forEach((element, index)=>{
    let scene_cube = scene.getObjectByName(element.name);
    scene_cube.position.x += (off)/index;
    //scene_cube.scale.set(index * (mod/2), index * mod, index * mod);
  })
}
*/

//Remove 3D Objects and clean the caches
function removeObject(sceneObject){
  if (!(sceneObject instanceof THREE.Object3D)) return;

  //Remove the geometry to free GPU resources
  if(sceneObject.geometry) sceneObject.geometry.dispose();

  //Remove the material to free GPU resources
  if(sceneObject.material){
    if (sceneObject.material instanceof Array) {
      sceneObject.material.forEach(material => material.dispose());
    } else {
        sceneObject.material.dispose();
    }
  }

  //Remove object from scene
  sceneObject.removeFromParent();
}

//Remove the cubes
function removeCubes(){

  sceneCubes.forEach(element =>{
    let scene_cube = scene.getObjectByName(element.name);
    removeObject(scene_cube);
  })

  sceneCubes = [];
}

//RESPONSIVE
function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
}


//ANIMATE AND RENDER
function animate() {
	requestAnimationFrame( animate );
 
  control.update();

  if(resX != parameters.resolutionX || dom != parameters.domino || off != parameters.offset || mod != parameters.modification){
    resX = parameters.resolutionX;
    dom = parameters.domino;
    off = parameters.offset;
    mod = parameters.modification;
    
    removeCubes();
    createCubes();
    dominoCubes();
    //modCubes();
  }


  if(dom != parameters.domino){
    dominoCubes();
  }


 
	renderer.render( scene, camera );
}
//-----------------------------------------------------------------------------------
// CLASS
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
// EXECUTE MAIN 
//-----------------------------------------------------------------------------------

main();