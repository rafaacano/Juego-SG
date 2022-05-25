import * as THREE from '../libs/three.module.js'

// Arrays de objetos
var cubos = new Array;
var pinchos = new Array;

class obstaculos extends THREE.Object3D{
    constructor(gui,titleGui){
        super();
    
        // Se crea la parte de la interfaz que corresponde a la grapadora
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
        this.createGUI(gui,titleGui);
        
        // Añadimos los objetos que tiene el suelo (los obstáculos)
        var geomPincho = new THREE.ConeGeometry(1.5,2,3);
        var geomCubo = new THREE.BoxGeometry(2,2,2);
        var matPincho = new THREE.MeshPhongMaterial({color:0x8c004b});
    
        var cubo = new THREE.Mesh(geomCubo,matPincho);
        var cubo2 = new THREE.Mesh(geomCubo,matPincho);
        var cubo3 = new THREE.Mesh(geomCubo,matPincho);
        var pincho = new THREE.Mesh(geomPincho,matPincho);
        var pincho2 = new THREE.Mesh(geomPincho,matPincho);
        cubo.position.set(-250,1,0);
        pincho.position.set(8,1,0);
        pincho.rotateY(Math.PI);
        pincho2.position.set(10.5,1,0);
        pincho2.rotateY(Math.PI);
        cubo2.position.set(-248,1,0);
        cubo3.position.set(-246,1,0);
        
    
        pinchos.push(pincho);
        pinchos.push(pincho2);
        cubos.push(cubo);
        cubos.push(cubo2);
        cubos.push(cubo3);
        this.add(pincho);
        this.add(pincho2); 
        this.add(cubo);
        this.add(cubo2);
        this.add(cubo3);

        // Añadimos los objetos que tiene el suelo (los obstáculos)
    }
}