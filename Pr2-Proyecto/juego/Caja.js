
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'

class Caja extends THREE.Object3D{

    
    constructor(gui,titleGui){
        super();
    
        // Se crea la parte de la interfaz que corresponde a la grapadora
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
        this.createGUI(gui,titleGui);
        
        //Creamos las distintas geomtrias del vehiculo

        this.createGeometriaCubo();

        this.createGeometriaNave();
        
        //this.createGeometriaRueda();

        this.add(this.geometriaCubo);

        
    }

    createGUI (gui,titleGui) {

    }

    createGeometriaCubo(){
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

        this.geometriaCubo = csg.toMesh();

        

    }

    createGeometriaNave(){
        var material = new THREE.MeshNormalMaterial();

        var geometry = new THREE.BoxBufferGeometry(0.3, 0.5, 0.3);

        var geometry2 = new THREE.CylinderBufferGeometry(0.3, 0.55, 0.45, 50);

        var geometry3 = new THREE.BoxBufferGeometry(0.8, 0.7, 0.3);

        var geometry4 = new THREE.CylinderBufferGeometry(0.25, 0.4, 0.6, 50);

        var geometr5 = new THREE.BoxBufferGeometry(0.1, 0.5, 0.5);
        
        var geometr6 = new THREE.BoxBufferGeometry(1, 0.1, 0.5);

        var propulsor = new THREE.Mesh( geometry, material );

        var cilindro = new THREE.Mesh(geometry2, material);

        var subcabina = new THREE.Mesh(geometry3, material);

        var punta = new THREE.Mesh(geometry4, material);

        var respaldo = new THREE.Mesh(geometr5, material);
        
        var asiento = new THREE.Mesh(geometr6, material);

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

    /*createGeometriaRueda(){
        var material = new THREE.MeshNormalMaterial();


        var geometry = new THREE.RingGeometry( 0.1, 1, 8, 2 );
        var mesh = new THREE.Mesh( geometry, material );

        var geometry2 = new THREE.ConeBufferGeometry(0.3, 0.7, 10);
        var cono1 = new THREE.Mesh(geometry2, material);

        cono1.translateX(0.5);
        cono1.translateY(1.17);
        cono1.translateZ(-0.1);
        cono1.rotateZ(-23*Math.PI/180);

        var cono2 = new THREE.Mesh(geometry2, material);

        cono2.translateX(1.17);
        cono2.translateY(0.5);
        cono2.translateZ(-0.1);
        cono2.rotateZ(-67*Math.PI/180);

        var cono3 = new THREE.Mesh(geometry2, material);

        cono3.translateX(1.17);
        cono3.translateY(-0.5);
        cono3.translateZ(-0.1);
        cono3.rotateZ(-113*Math.PI/180);

        var cono4 = new THREE.Mesh(geometry2, material);

        cono4.translateX(0.5);
        cono4.translateY(-1.17);
        cono4.translateZ(-0.1);
        cono4.rotateZ(-157*Math.PI/180);

        var cono5 = new THREE.Mesh(geometry2, material);

        cono5.translateX(-0.5);
        cono5.translateY(-1.17);
        cono5.translateZ(-0.1);
        cono5.rotateZ(157*Math.PI/180);

        var cono6 = new THREE.Mesh(geometry2, material);

        cono6.translateX(-1.17);
        cono6.translateY(-0.5);
        cono6.translateZ(-0.1);
        cono6.rotateZ(113*Math.PI/180);

        var cono7 = new THREE.Mesh(geometry2, material);

        cono7.translateX(-1.17);
        cono7.translateY(0.5);
        cono7.translateZ(-0.1);
        cono7.rotateZ(67*Math.PI/180);

        var cono8 = new THREE.Mesh(geometry2, material);

        cono8.translateX(-0.5);
        cono8.translateY(1.17);
        cono8.translateZ(-0.1);
        cono8.rotateZ(23*Math.PI/180);

        //Creacion de los nodos BPS
        var csg3 = new CSG();
        csg3.union([mesh]);

        this.geometriaRueda  = csg3.toMesh();
    }*/

    cambioCajaNave(){
        this.remove(this.geometriaCubo);
        this.add(this.geometriaNave);
    }

    cambioNaveRueda(){
        this.remove(this.geometriaNave);
        var material = new THREE.MeshNormalMaterial();


        const geometry = new THREE.RingGeometry( 0.1, 1, 8, 2 );
        const mesh = new THREE.Mesh( geometry, material );
        this.add(mesh);

        var geometry2 = new THREE.ConeBufferGeometry(0.3, 0.7, 10);
        var cono1 = new THREE.Mesh(geometry2, material);

        cono1.translateX(0.5);
        cono1.translateY(1.17);
        cono1.translateZ(-0.1);
        cono1.rotateZ(-23*Math.PI/180);
        var cono2 = new THREE.Mesh(geometry2, material);

        cono2.translateX(1.17);
        cono2.translateY(0.5);
        cono2.translateZ(-0.1);
        cono2.rotateZ(-67*Math.PI/180);

        var cono3 = new THREE.Mesh(geometry2, material);

        cono3.translateX(1.17);
        cono3.translateY(-0.5);
        cono3.translateZ(-0.1);
        cono3.rotateZ(-113*Math.PI/180);

        var cono4 = new THREE.Mesh(geometry2, material);

        cono4.translateX(0.5);
        cono4.translateY(-1.17);
        cono4.translateZ(-0.1);
        cono4.rotateZ(-157*Math.PI/180);

        var cono5 = new THREE.Mesh(geometry2, material);

        cono5.translateX(-0.5);
        cono5.translateY(-1.17);
        cono5.translateZ(-0.1);
        cono5.rotateZ(157*Math.PI/180);

        var cono6 = new THREE.Mesh(geometry2, material);

        cono6.translateX(-1.17);
        cono6.translateY(-0.5);
        cono6.translateZ(-0.1);
        cono6.rotateZ(113*Math.PI/180);

        var cono7 = new THREE.Mesh(geometry2, material);

        cono7.translateX(-1.17);
        cono7.translateY(0.5);
        cono7.translateZ(-0.1);
        cono7.rotateZ(67*Math.PI/180);

        var cono8 = new THREE.Mesh(geometry2, material);

        cono8.translateX(-0.5);
        cono8.translateY(1.17);
        cono8.translateZ(-0.1);
        cono8.rotateZ(23*Math.PI/180);

        // var csg = new CSG();
        // csg.union([mesh, cono1]);

        // this.add(csg.toMesh());
        
        this.add(cono1);
        this.add(cono2);
        this.add(cono3);
        this.add(cono4);
        this.add(cono5);
        this.add(cono6);
        this.add(cono7);
        this.add(cono8);
    }
      
    update () {
        // La caja se mueve constantemente en x un %
        this.position.x += 0.3;
        
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

    getPosY(){
        return(this.position.y);
    }

    getPosZ(){
        return(this.position.z);
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