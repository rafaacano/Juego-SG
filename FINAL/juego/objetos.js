
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'

class objetos extends THREE.Object3D{
    constructor(){
        super();

        this.contador = 0;
        
        this.mat = new THREE.MeshPhongMaterial({color:0x000000});

        //Creamos las distintas geomtrias del vehiculo
        this.createGeometriaCubo();
        this.createGeometriaNave();
        //this.createGeometriaRueda();
    }

    /******************************************************/
    // Funciones que crean los diferentes objetos del juego
    createGeometriaCubo(){        
        // Creamos un objeto básico
        var caja = new THREE.Mesh( new THREE.BoxGeometry(2,2,2), this.mat);
        var otraCaja = new THREE.Mesh( new THREE.BoxGeometry(1.75,1.75,2), this.mat);
        var cubo = new THREE.Mesh(new THREE.BoxGeometry(1.5,1.5,2), this.mat);

        // Creamos un csg 
        var csg = new CSG();
        csg.subtract([caja,otraCaja]);
        csg.union([cubo]);

        this.geometriaCubo = csg.toMesh();

        this.add(this.geometriaCubo);
    }

    createGeometriaNave(){
        // El this.mat se usa desde varios métodos. Por eso se alamacena en un atributo
        this.matPrueba = new THREE.MeshPhongMaterial({color:0xff5733});
    
        var geometry = new THREE.BoxBufferGeometry(0.3, 0.5, 0.3);

        var geometry2 = new THREE.CylinderBufferGeometry(0.3, 0.55, 0.45, 50);

        var geometry3 = new THREE.BoxBufferGeometry(0.8, 0.7, 0.3);

        var geometry4 = new THREE.CylinderBufferGeometry(0.25, 0.4, 0.6, 50);

        var geometr5 = new THREE.BoxBufferGeometry(0.1, 0.5, 0.5);
        
        var geometr6 = new THREE.BoxBufferGeometry(1, 0.1, 0.5);

        var propulsor = new THREE.Mesh( geometry, this.matPrueba );

        var cilindro = new THREE.Mesh(geometry2, this.matPrueba);

        var subcabina = new THREE.Mesh(geometry3, this.matPrueba);

        var punta = new THREE.Mesh(geometry4, this.matPrueba);

        var respaldo = new THREE.Mesh(geometr5, this.matPrueba);
        
        var asiento = new THREE.Mesh(geometr6, this.matPrueba);

        cilindro.rotateZ(-Math.PI/2);
        cilindro.translateY(0.35);

        subcabina.translateX(0.97);

        punta.translateX(1.67);
        punta.rotateZ(-Math.PI/2);

        asiento.translateX(0.9);
        respaldo.translateX(0.46);

        respaldo.translateY(0.7);
        asiento.translateY(0.4);

        var caja = new THREE.Mesh( new THREE.BoxGeometry(2,2,2), this.mat);
        var otraCaja = new THREE.Mesh( new THREE.BoxGeometry(1.75,1.75,2), this.mat);
        var cubo = new THREE.Mesh(new THREE.BoxGeometry(1.5,1.5,2), this.mat);

        // Añadimos la caja
        //this.add(caja);

        // Creamos un csg 
        var csg = new CSG();
        csg.subtract([caja,otraCaja]);
        csg.union([cubo]);

        var miniCaja = csg.toMesh();

        miniCaja.scale.x = 0.3;
        miniCaja.scale.y = 0.3;
        miniCaja.scale.z = 0.3;

        miniCaja.translateX(0.9);
        miniCaja.translateY(0.75);

        //Creacion de los nodos BPS
        var csg2 = new CSG();
        csg2.union([propulsor, cilindro, subcabina, punta, respaldo, asiento, miniCaja]);

        this.geometriaNave  = csg2.toMesh();
    }
     
    /*********************************************/
    // Funciones para cambiar de objeto
    cambioCajaNave(){
        this.remove(this.geometriaCubo);
        this.add(this.geometriaNave);
    }

    cambioNaveRueda(){
        this.remove(this.geometriaNave);

        // Aquí creamos la geometria de la rueda
        var material = new THREE.MeshNormalMaterial();
        const geometry = new THREE.RingGeometry( 0.1, 1, 8, 2 );
        this.mesh = new THREE.Mesh( geometry, this.mat );
        this.add(this.mesh);

        var geometry2 = new THREE.ConeBufferGeometry(0.3, 0.7, 10);
        this.cono1 = new THREE.Mesh(geometry2, material);

        this.cono1.translateX(0.5);
        this.cono1.translateY(1.17);
        this.cono1.translateZ(-0.1);
        this.cono1.rotateZ(-23*Math.PI/180);

        this.cono2 = new THREE.Mesh(geometry2, material);

        this.cono2.translateX(1.17);
        this.cono2.translateY(0.5);
        this.cono2.translateZ(-0.1);
        this.cono2.rotateZ(-67*Math.PI/180);

        this.cono3 = new THREE.Mesh(geometry2, material);

        this.cono3.translateX(1.17);
        this.cono3.translateY(-0.5);
        this.cono3.translateZ(-0.1);
        this.cono3.rotateZ(-113*Math.PI/180);

        this.cono4 = new THREE.Mesh(geometry2, material);

        this.cono4.translateX(0.5);
        this.cono4.translateY(-1.17);
        this.cono4.translateZ(-0.1);
        this.cono4.rotateZ(-157*Math.PI/180);

        this.cono5 = new THREE.Mesh(geometry2, material);

        this.cono5.translateX(-0.5);
        this.cono5.translateY(-1.17);
        this.cono5.translateZ(-0.1);
        this.cono5.rotateZ(157*Math.PI/180);

        this.cono6 = new THREE.Mesh(geometry2, material);

        this.cono6.translateX(-1.17);
        this.cono6.translateY(-0.5);
        this.cono6.translateZ(-0.1);
        this.cono6.rotateZ(113*Math.PI/180);

        this.cono7 = new THREE.Mesh(geometry2, material);

        this.cono7.translateX(-1.17);
        this.cono7.translateY(0.5);
        this.cono7.translateZ(-0.1);
        this.cono7.rotateZ(67*Math.PI/180);

        this.cono8 = new THREE.Mesh(geometry2, material);

        this.cono8.translateX(-0.5);
        this.cono8.translateY(1.17);
        this.cono8.translateZ(-0.1);
        this.cono8.rotateZ(23*Math.PI/180);
        
        this.add(this.cono1);
        this.add(this.cono2);
        this.add(this.cono3);
        this.add(this.cono4);
        this.add(this.cono5);
        this.add(this.cono6);
        this.add(this.cono7);
        this.add(this.cono8);
    }

    Reseteo(){

        this.clear();

        // Añadimos el cubo
        this.add(this.geometriaCubo);

        var aux = 36 - (this.contador % 36);

        for(let i = 0; i < aux; i++){
            this.rotateZ(-10*Math.PI/180);
        }

        this.contador = 0;
    }

    /*
    finJuego(){
        // Eliminamos el circulo
        this.remove(this.mesh);
        this.remove(this.cono1);
        this.remove(this.cono2);
        this.remove(this.cono3);
        this.remove(this.cono4);
        this.remove(this.cono5);
        this.remove(this.cono6);
        this.remove(this.cono7);
        this.remove(this.cono8);
    }
    */

    /*********************************************/

    update(saltoCirculo) {
        // La caja se mueve constantemente en x un %
        this.position.x += 0.3;

        // Si somos el circulo, vamos rotando en -z
        if( saltoCirculo == true ){
            this.rotateZ(-10*Math.PI/180);
            this.contador = this.contador + 1;
        }
    }

    getPosX(){
        return(this.position.x);
    }

}

export { objetos }