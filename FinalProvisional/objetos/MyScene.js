
import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'
import * as TWEEN from '../libs/tween.esm.js'

import { Caja } from './Caja.js'


// Variables
var cubos = new Array;
var pinchos = new Array;

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */
 class MyScene extends THREE.Scene {
    constructor (myCanvas) {
      super();
      
      // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
      this.renderer = this.createRenderer(myCanvas);
      
      // Se añade a la gui los controles para manipular los elementos de esta clase
      this.gui = this.createGUI ();
      
      this.initStats();
      
      // Construimos los distinos elementos que tendremos en la escena
      this.crearObstaculos();
      
      // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
      // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
      this.createLights ();
      
      // Tendremos una cámara con un control de movimiento con el ratón
      this.createCamera ();
      
      // Un suelo 
      this.createGround ();
      
      // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
      this.axis = new THREE.AxesHelper (8);
      this.add (this.axis);
      
      // Por último creamos el modelo.
      // El modelo puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a 
      // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.
      this.model = new Caja(this.gui, "Controles de la Caja");
      this.add (this.model);
      this.model.position.set(-300,1,0);

      // Vectores para la deteccion de colisiones
      this.posCubo = new THREE.Vector3();
      this.posObstaculos = new THREE.Vector3();
    }
    
    initStats() {
    
      var stats = new Stats();
      
      stats.setMode(0); // 0: fps, 1: ms
      
      // Align top-left
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '0px';
      
      $("#Stats-output").append( stats.domElement );
      
      this.stats = stats;
    }
    
    createCamera () {
      // Para crear una cámara le indicamos
      //   El ángulo del campo de visión en grados sexagesimales
      //   La razón de aspecto ancho/alto
      //   Los planos de recorte cercano y lejano
      this.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
      // También se indica dónde se coloca
      this.camera.position.set (-300, 5, 125);
      // Y hacia dónde mira
      var look = new THREE.Vector3 (-300,0,0);
      this.camera.lookAt(look);
      this.add (this.camera);
      
      /*
      // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
      this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);
      // Se configuran las velocidades de los movimientos
      this.cameraControl.rotateSpeed = 5;
      this.cameraControl.zoomSpeed = -2;
      this.cameraControl.panSpeed = 0.5;
      // Debe orbitar con respecto al punto de mira de la cámara
      this.cameraControl.target = look;   
      */ 
    }
    
    createGround () {
      // El suelo es un Mesh, necesita una geometría y un material.
      // La geometría es una caja con muy poca altura
      var geometryGround = new THREE.BoxGeometry (700,0.2,250);
      
      // El material se hará con una textura de madera
      var texture = new THREE.TextureLoader().load('../imgs/ladrillo-mapaNormal.png');
      var materialGround = new THREE.MeshPhongMaterial ({map: texture});
      
      // Ya se puede construir el Mesh
      var ground = new THREE.Mesh (geometryGround, materialGround);
      
      // Todas las figuras se crean centradas en el origen.
      // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
      ground.position.y = -0.1;

      // Que no se nos olvide añadirlo a la escena, que en este caso es  this
      this.add (ground);

      // Creamos los obstaculos
      this.crearObstaculos();
    }
    
    createGUI () {
      // Se crea la interfaz gráfica de usuario
      var gui = new GUI();
      
      // La escena le va a añadir sus propios controles. 
      // Se definen mediante un objeto de control
      // En este caso la intensidad de la luz y si se muestran o no los ejes
      this.guiControls = {
        // En el contexto de una función   this   alude a la función
        lightIntensity : 0.5,
        axisOnOff : true
      }
  
      // Se crea una sección para los controles de esta clase
      var folder = gui.addFolder ('Luz y Ejes');
      
      // Se le añade un control para la intensidad de la luz
      folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1)
        .name('Intensidad de la Luz : ')
        .onChange ( (value) => this.setLightIntensity (value) );
      
      // Y otro para mostrar u ocultar los ejes
      folder.add (this.guiControls, 'axisOnOff')
        .name ('Mostrar ejes : ')
        .onChange ( (value) => this.setAxisVisible (value) );
      
      return gui;
    }
    
    createLights () {
      // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
      // La luz ambiental solo tiene un color y una intensidad
      // Se declara como   var   y va a ser una variable local a este método
      // se hace así puesto que no va a ser accedida desde otros métodos
      var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
      // La añadimos a la escena
      this.add (ambientLight);
      
      // Se crea una luz focal que va a ser la luz principal de la escena
      // La luz focal, además tiene una posición, y un punto de mira
      // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
      // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
      // Creamos 3 focos para nuestro juego
      this.spotLight = new THREE.SpotLight( 0xffffff, this.guiControls.lightIntensity );
      this.spotLight.position.set( 0, 240, 0 );
      this.add (this.spotLight);
    }
    
    setLightIntensity (valor) {
      this.spotLight.intensity = valor;
    }
    
    setAxisVisible (valor) {
      this.axis.visible = valor;
    }
    
    createRenderer (myCanvas) {
      // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
      
      // Se instancia un Renderer   WebGL
      var renderer = new THREE.WebGLRenderer();
      
      // Se establece un color de fondo en las imágenes que genera el render
      renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
      
      // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // La visualización se muestra en el lienzo recibido
      $(myCanvas).append(renderer.domElement);
      
      return renderer;  
    }
    
    getCamera () {
      // En principio se devuelve la única cámara que tenemos
      // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
      return this.camera;
    }
    
    setCameraAspect (ratio) {
      // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
      // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
      this.camera.aspect = ratio;
      // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
      this.camera.updateProjectionMatrix();
    }
    
    onWindowResize () {
      // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
      // Hay que actualizar el ratio de aspecto de la cámara
      this.setCameraAspect (window.innerWidth / window.innerHeight);
      
      // Y también el tamaño del renderizador
      this.renderer.setSize (window.innerWidth, window.innerHeight);
    }
  
    update () {
      
      if (this.stats) this.stats.update();
      
      // Se actualizan los elementos de la escena para cada frame
      
      // Se actualiza la posición de la cámara según su controlador
      //this.cameraControl.update();
      this.camera.position.x += 0.2

      // Se actualiza el resto del modelo
      this.model.update();
      
      // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
      this.renderer.render (this, this.getCamera());

      // Actualizamos la animacion
      TWEEN.update();

      // Comprobamos si hay colisisones
      this.colisionCubos();
      this.colisionPinchos();
  
      // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
      // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
      // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
      requestAnimationFrame(() => this.update())
    }

    /**
     * Funciones para la colisión
     */
    onKeyPress(event){
      var x = event.which;

      // Si pulsamos el espacio, saltamos
      if( String.fromCharCode(x) == " "){
        this.saltar(this.model.position.x,this.model.position.y,this.model.position.z);
        //alert("Espacio pulsado");
      }
    }

    crearObstaculos(){
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
        pincho.position.set(-200,1,0);
        pincho.rotateY(Math.PI);
        pincho2.position.set(-192,1,0);
        pincho2.rotateY(Math.PI);
        cubo2.position.set(-248,1,0);
        cubo3.position.set(-246,1,0);
        
    
        pinchos.push(pincho);
        pinchos.push(pincho2);
        cubos.push(cubo);
        cubos.push(cubo2);
        //cubos.push(cubo3);
        this.add(pincho);
        this.add(pincho2); 
        this.add(cubo);
        this.add(cubo2);
        //this.add(cubo3);
    }

    colisionCubos(){
      // Creamos un rayo
      var rayo = new THREE.Raycaster(this.model.position, new THREE.Vector3(1,0,0),0,0.5);

      for(let i=0; i < cubos.length; i++){
        var interseccion = rayo.intersectObject(cubos[i]);

        if( interseccion.length > 0 ){
          window.alert("!HAS CHOCADO");
        }
      }      
    }

    colisionPinchos(){
      // Creamos un rayo
      var rayo = new THREE.Raycaster(this.model.position, new THREE.Vector3(1,0,0),0,0.5);

      for(let i=0; i < pinchos.length; i++){
        var interseccion = rayo.intersectObject(pinchos[i]);

        if( interseccion.length > 0 ){
          window.alert("!HAS CHOCADO");
        }
      }    
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

      /*
      // Dibujamos la línea
      var geomLinea = new THREE.BufferGeometry();
      geomLinea.setFromPoints(this.camino.getPoints(100));
      var materialLinea = new THREE.LineBasicMaterial({color: 0x000000, linewidth : 4});
      var lineaVisible = new THREE.Line(geomLinea,materialLinea);

      this.add(lineaVisible);
      */

      // Hacemos la animación de saltar
      var origen1 = {p: 0};
      var dest1 = {p: 1};
  
      var animacion = new TWEEN.Tween(origen1).to(dest1, 1500).onUpdate(()=>{
          var pos = this.camino.getPointAt(origen1.p);
          this.model.position.copy(pos);
          var tangente = this.camino.getTangentAt(origen1.p);
          pos.add(tangente);
      });

      // Empezamos la animacion
      animacion.start();
    }
  }
  
  /// La función   main
  $(function () {
    
    // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
    var scene = new MyScene("#WebGL-output");
  
    // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
    window.addEventListener ("resize", () => scene.onWindowResize());
    
    // Que no se nos olvide, la primera visualización.
    scene.update();

    // Métodos que ocurriran al pulsar teclas
    window.addEventListener( "keypress", (event) => scene.onKeyPress(event));
  });
  