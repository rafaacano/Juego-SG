import * as THREE from '../libs/three.module.js'

class portal extends THREE.Object3D{

    constructor(){
        super();

        // Creamos toroides para representar los portales
        var geomToroide = new THREE.TorusGeometry(3,1,24,100);
        var matToro = new THREE.MeshPhongMaterial({color:0x5c25fa});

        var portal1 = new THREE.Mesh(geomToroide,matToro);
        var portal2 = new THREE.Mesh(geomToroide,matToro);

        // Los añadimos
        this.add(portal1);
        this.add(portal2);

        // Los posicionamos y rotamos
        portal1.rotateY(Math.PI/2);
        portal1.position.set(-66,6,0);
        portal2.rotateY(Math.PI/2);
        portal2.position.set(167,5,0);
    }


}

export{ portal }