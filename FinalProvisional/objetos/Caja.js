
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'

class Caja extends THREE.Object3D{
    constructor(gui,titleGui){
        super();
    
        // Se crea la parte de la interfaz que corresponde a la grapadora
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
        this.createGUI(gui,titleGui);
        
        // El material se usa desde varios métodos. Por eso se alamacena en un atributo
        this.mat = new THREE.MeshPhongMaterial({color:0x000000});
        this.matPrueba = new THREE.MeshPhongMaterial({color:0xff5733});
        
        // Creamos un objeto básico
        var caja = new THREE.Mesh( new THREE.BoxGeometry(2,2,2), this.mat);
        var otraCaja = new THREE.Mesh( new THREE.BoxGeometry(1.75,1.75,2), this.mat);
        var cubo = new THREE.Mesh(new THREE.BoxGeometry(1.5,1.5,2), this.mat);

        // Añadimos la caja
        //this.add(caja);

        // Creamos un csg 
        var csg = new CSG();
        csg.subtract([caja,otraCaja]);
        csg.union([cubo]);

        this.mesh = csg.toMesh();
        //this.mesh.position.set(-300,1,0);

        this.add(this.mesh);

        // Añadimos los objetos que tiene el suelo (los obstáculos)
    }

    createGUI (gui,titleGui) {

    }
      
    update () {
        // La caja se mueve constantemente en x un %
        this.position.x += 0.2;
    }

    // Función para el salto de la caja
    saltar(x,y,z){

        // Creamos el camino por el que irá el objeto
        // El true hace que el camino sea cerrado
        this.camino = new THREE.CatmullRomCurve3(
            [ new THREE.Vector3(x,y,z),
                new THREE.Vector3(x+2,y+2,z),
                new THREE.Vector3(x+4,y+4,z),
                new THREE.Vector3(x+6,y+4,z),
                new THREE.Vector3(x+8,y+2,z),
                new THREE.Vector3(x+10,y,z)]
        );

        // Dibujamos la línea
        var geomLinea = new THREE.BufferGeometry();
        geomLinea.setFromPoints(this.camino.getPoints(100));
        var materialLinea = new THREE.LineBasicMaterial({color: 0x000000, linewidth : 4});
        var lineaVisible = new THREE.Line(geomLinea,materialLinea);

        this.add(lineaVisible);
    }

    getPosX(){
        return(this.position.x);
    }

    getWidth(){
        return(this.getWidth());
    }

    getHeight(){
        return(this.getHeight());
    }

    obtenerEsferaEnglobante(){
        // Creamos una esfera que englobe a la caja en la posicion en la que esté
        var geomEsfera = new THREE.SphereGeometry(this.getWidth());

        var esferaEnglobante = new THREE.Mesh(geomEsfera,this.mat);

        return(esferaEnglobante);
    }

}

export { Caja }