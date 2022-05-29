
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { Caja } from './Caja.js'

class Nave extends THREE.Object3D {
    constructor(gui,titleGui) {
      super();
      
      // Se crea la parte de la interfaz que corresponde a la grapadora
      // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
      this.createGUI(gui,titleGui);
      
      // El material se usa desde varios métodos. Por eso se alamacena en un atributo
      var material = new THREE.MeshNormalMaterial();
      material.flatShading = true;
      material.needsUpdate = true;

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

      var model = new Caja(this.gui, "Controles de la Caja");
      this.add (model);

      model.scale.x = 0.3;
      model.scale.y = 0.3;
      model.scale.z = 0.3;

      model.translateX(0.9);
      model.translateY(0.75);

      //Creacion de los nodos BPS
      // var csg = new CSG();
      // csg.union([respaldo]);
      // csg.union([asiento]);

      // var sillon  = csg.toMesh();

      //Construccion del arbol binario
      

      this.add(propulsor);
      this.add(cilindro);
      this.add(subcabina);
      this.add(punta);
      this.add(respaldo);
      this.add(asiento);
      
      
    }
    createGUI(gui, titleGui) {
      // Controles para el tamaño, la orientación y la posición de la caja

      this.guiControls = new function () {
        this.ver = true;

        // Un botón para dejarlo todo en su posición inicial
        // Cuando se pulse se ejecutará esta función.
        this.reset = function () {
          this.ver = true;
        }
      }

      // Se crea una sección para los controles de la caja
      var folder = gui.addFolder(titleGui);
      // Estas lineas son las que añaden los componentes de la interfaz
      // Las tres cifras indican un valor mínimo, un máximo y el incremento
      // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
      folder.add(this.guiControls, 'ver').name('Ver Objeto: ');
      folder.add(this.guiControls, 'reset').name('[ Reset ]');
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



    update() {
      /*this.taza.visible = this.guiControls.ver;
      this.taza.rotation.y += 0.010;*/

      // Primero, el escalado
      // Segundo, la rotación en Z
      // Después, la rotación en Y
      // Luego, la rotación en X
      // Y por último la traslación

      this.position.x += 0.2;
    }

}

export { Nave }

