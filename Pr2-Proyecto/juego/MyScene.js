
import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'
import * as TWEEN from '../libs/tween.esm.js'

import { Caja } from './Caja.js'


// Variables
var cubos = new Array;
var pinchos = new Array;
var saltoCubo = new Boolean(true);
var movNave = new Boolean(false);
var saltoCirculo = new Boolean(false);
var cambioCirculo = new Boolean(true);

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */
 class MyScene extends THREE.Scene {
    // Tendremos una variable que nos contará el número de intentos
    static attempts = 1;

    constructor (myCanvas) {
      super();
      
      // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
      this.renderer = this.createRenderer(myCanvas);
      
      // Añadimos el contador de intetos
      this.contador_intentos = document.getElementById("intentos");
      this.contador_intentos.innerHTML = MyScene.attempts;
      $("#intentos").fadeIn(1000);

      this.gui = this.createGUI();
      
      this.initStats();
      
      // Construimos los distinos elementos que tendremos en la escena
      this.crearObstaculos();
      
      // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
      // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
      this.createLights ();
      
      // Un suelo 
      this.createGround ();
      // Una pared
      this.createWall();
      // Un techo para el ultimo objeto
      this.createRoof();
      
      // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
      this.axis = new THREE.AxesHelper (8);
      this.add (this.axis);
      
      // Por último creamos el modelo.
      // El modelo puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a 
      // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.
      this.model = new Caja(this.gui, "Controles de la Caja");
      this.add (this.model);
      this.model.position.set(-300,1,0);

      // Tendremos una cámara con un control de movimiento con el ratón
      this.createCamera ();
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
      this.camera.position.set (this.model.getPosX(), 5, 125);
      // Y hacia dónde mira
      var look = new THREE.Vector3 (this.model.getPosX(),0,0);
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
      var geometryWall = new THREE.BoxGeometry (700,0.2,250);
      
      // El material se hará con una textura de madera
      var texture = new THREE.TextureLoader().load('../imgs/ladrillo-mapaNormal.png');
      var materialGround = new THREE.MeshPhongMaterial ({map: texture});
      
      // Ya se puede construir el Mesh
      var ground = new THREE.Mesh (geometryWall, materialGround);
      
      // Todas las figuras se crean centradas en el origen.
      // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
      ground.position.y = -0.1;

      // Que no se nos olvide añadirlo a la escena, que en este caso es  this
      this.add (ground);

      // Creamos los obstaculos
      this.crearObstaculos();
    }

    createRoof () {
      // El suelo es un Mesh, necesita una geometría y un material.
      // La geometría es una caja con muy poca altura
      var geometryWall = new THREE.BoxGeometry (700,0.2,250);
      
      // El material se hará con una textura de madera
      var texture = new THREE.TextureLoader().load('../imgs/ladrillo-mapaNormal.png');
      var materialGround = new THREE.MeshPhongMaterial ({map: texture});
      
      // Ya se puede construir el Mesh
      var roof = new THREE.Mesh (geometryWall, materialGround);
      
      // Colocamos el techo al final del mapa (solo es para el último objeto)
      roof.position.set(0,25,0);

      // Que no se nos olvide añadirlo a la escena, que en este caso es  this
      this.add (roof);

      // Creamos los obstaculos
      this.crearObstaculosRoof();
    }

    createWall(){
      // El suelo es un Mesh, necesita una geometría y un material.
      // La geometría es una caja con muy poca altura
      var geometryWall = new THREE.BoxGeometry (100,0.2,100);
      
      // El material se hará con una textura de madera
      var texture = new THREE.TextureLoader().load('../imgs/fondoPared.jpg');
      var matWall = new THREE.MeshPhongMaterial ({map: texture});
      
      // Ya se puede construir el Mesh
      var wall = new THREE.Mesh (geometryWall, matWall);
      var wall2 = new THREE.Mesh (geometryWall, matWall);
      var wall3 = new THREE.Mesh (geometryWall, matWall);
      var wall4 = new THREE.Mesh (geometryWall, matWall);
      var wall5 = new THREE.Mesh (geometryWall, matWall);
      var wall6 = new THREE.Mesh (geometryWall, matWall);
      var wall7 = new THREE.Mesh (geometryWall, matWall);
      var wallIzq1 = new THREE.Mesh(geometryWall, matWall);
      var wallIzq2 = new THREE.Mesh(geometryWall, matWall);

      // Todas las figuras se crean centradas en el origen.
      // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
      wall.rotateX(Math.PI/2);
      wall.position.set(0,50,-126);
      wall2.rotateX(Math.PI/2);
      wall2.position.set(-300,50,-126);
      wall3.rotateX(Math.PI/2);
      wall3.position.set(-200,50,-126);
      wall4.rotateX(Math.PI/2);
      wall4.position.set(-100,50,-126);
      wall5.rotateX(Math.PI/2);
      wall5.position.set(100,50,-126);
      wall6.rotateX(Math.PI/2);
      wall6.position.set(200,50,-126);
      wall7.rotateX(Math.PI/2);
      wall7.position.set(300,50,-126);

      // Cerramos la pared
      wallIzq1.position.set(-350,50,-100);
      wallIzq1.rotateY(Math.PI/2);
      wallIzq1.rotateX(Math.PI/2);
      wallIzq2.position.set(-350,50,0);
      wallIzq2.rotateY(Math.PI/2);
      wallIzq2.rotateX(Math.PI/2);
      
      // Que no se nos olvide añadirlo a la escena, que en este caso es  this
      this.add(wall);
      this.add(wall2);
      this.add(wall3);
      this.add(wall4);
      this.add(wall5);
      this.add(wall6);
      this.add(wall7);
      this.add(wallIzq1);
      this.add(wallIzq2);
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
      
      // Se actualiza la posición de la cámara según la posición del modelo
      this.camera.position.x = this.model.getPosX();

      /************************************************************/
      // Cambio de los objetos del juego
      if(this.model.getPosX() > -67 && this.model.getPosX() < 166){
        this.model.cambioCajaNave();
        saltoCubo = false;
        movNave = true;
      }

      if(this.model.getPosX() > 167){
        this.model.cambioNaveRueda();
        movNave = false;
        saltoCirculo = true;
      }
      /************************************************************/

      // Si llegamos a la posicion 350, hemos llegado al fin del juego
      if( this.model.getPosX() > 350){
        this.finJuego();
      }

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
      if( String.fromCharCode(x) == " " && saltoCubo == true ){
        this.saltar(this.model.position.x,this.model.position.y,this.model.position.z);
      }
      if( ((String.fromCharCode(x) == "W") || (String.fromCharCode(x) == "w")) && movNave == true ){
        this.moverArriba();
        
      }
      if( ((String.fromCharCode(x) == "S") || (String.fromCharCode(x) == "s"))  && movNave == true){
         this.moverAbajo();
      }
      // Si pulsamos el espacio, saltamos
      if( String.fromCharCode(x) == " " && saltoCirculo == true ){
        this.cambio(this.model.position.x,this.model.position.y,this.model.position.z);
      }

    }

    onMouseDown(event){
      var x = event.which;

      // Si pulsamos el boton izquierdo del ratón
      if( x == 1 && saltoCubo == true ){
        this.saltar(this.model.position.x,this.model.position.y,this.model.position.z);
      }
      else if( x == 1 && saltoCirculo == true){
        this.cambio(this.model.position.x,this.model.position.y,this.model.position.z);

      }
    }

    /**************************************************************/
    // FUNCIONES QUE CREAN LOS OBSTÁCULOS
    crearObstaculos(){
      // Añadimos los objetos que tiene el suelo (los obstáculos)
      // Serán cubos y conos
      var geomPincho = new THREE.ConeGeometry(1.5,2,3);
      var geomCubo = new THREE.BoxGeometry(2,2,2);
      var geomCubox2 = new THREE.BoxGeometry(3,3,3);
      var geomCubox3 = new THREE.BoxGeometry(4,4,4);
      var matObstaculos = new THREE.MeshPhongMaterial({color:0x8c004b});
  
      // Creamos tantos objetos como haya en el mapa
      var cubo = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo2 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo3 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo4 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo5 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo6 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo7 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo8= new THREE.Mesh(geomCubo,matObstaculos);
      var cubo9 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo10 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo11 = new THREE.Mesh(geomCubox2,matObstaculos);
      var cubo12 = new THREE.Mesh(geomCubox2,matObstaculos);
      var cubo13 = new THREE.Mesh(geomCubox2,matObstaculos);
      var cubo14 = new THREE.Mesh(geomCubox2,matObstaculos);
      var cubo15 = new THREE.Mesh(geomCubox2,matObstaculos);
      var cubo16 = new THREE.Mesh(geomCubox2,matObstaculos);
      var cubo17 = new THREE.Mesh(geomCubox2,matObstaculos);
      var cubo18 = new THREE.Mesh(geomCubox2,matObstaculos);
      var cubo19 = new THREE.Mesh(geomCubox2,matObstaculos);
      var cubo20 = new THREE.Mesh(geomCubox3,matObstaculos);
      var cubo21 = new THREE.Mesh(geomCubox3,matObstaculos);
      var cubo22 = new THREE.Mesh(geomCubox3,matObstaculos);
      var cubo23 = new THREE.Mesh(geomCubox3,matObstaculos);
      var cubo24 = new THREE.Mesh(geomCubox3,matObstaculos);
      var cubo25 = new THREE.Mesh(geomCubox3,matObstaculos);
      var cubo26 = new THREE.Mesh(geomCubox3,matObstaculos);
      var cubo27 = new THREE.Mesh(geomCubox3,matObstaculos);
      var cubo28 = new THREE.Mesh(geomCubox3,matObstaculos);
      var cubo29 = new THREE.Mesh(geomCubox3,matObstaculos);
      var cubo30 = new THREE.Mesh(geomCubox3,matObstaculos);
      var pincho = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho2 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho3 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho4 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho5 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho6 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho7 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho8 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho9 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho10 = new THREE.Mesh(geomPincho,matObstaculos);

      // Posicionamos cada obstaculo en el mapa
      cubo.position.set(-280,1,0);
      cubo2.position.set(-268,1,0);
      cubo3.position.set(-240,1,0);
      pincho3.position.set(-237.5,1,0);
      pincho3.rotateY(Math.PI);
      cubo4.position.set(-226,1,0);
      pincho4.position.set(-212,1,0);
      pincho4.rotateY(Math.PI);
      cubo5.position.set(-209,1,0);
      pincho.position.set(-198,1,0);
      pincho.rotateY(Math.PI);
      pincho2.position.set(-186,1,0);
      pincho2.rotateY(Math.PI);
      cubo6.position.set(-170,1,0);
      cubo7.position.set(-159,1,0);
      pincho5.position.set(-156.5,1,0);
      pincho5.rotateY(Math.PI);
      cubo8.position.set(-139,1,0);
      pincho6.position.set(-136.5,1,0);
      pincho6.rotateY(Math.PI);
      cubo9.position.set(-100,1,0);
      cubo10.position.set(-88,1,0);
      pincho7.position.set(-85.5,1,0);
      pincho7.rotateY(Math.PI);
      pincho8.position.set(-70,1,0);
      pincho8.rotateY(Math.PI);
      pincho9.position.set(-67,1,0);
      pincho9.rotateY(Math.PI);
      pincho10.position.set(-55,1,0);
      pincho10.rotateY(Math.PI);

      /******************************************************/
      // Obstaculos de la nave
      cubo11.position.set(-46,10,0);
      cubo12.position.set(-35,6,0);
      cubo13.position.set(-22,17,0);
      cubo14.position.set(-10,5,0);
      cubo15.position.set(2,8,0);
      cubo16.position.set(26,17,0);
      cubo17.position.set(40,5,0);
      cubo18.position.set(44,6,0);
      cubo19.position.set(60,15,0);
      cubo20.position.set(90,11,0);
      cubo21.position.set(105,4,0);
      cubo22.position.set(112,7,0);
      cubo23.position.set(124,17,0);
      cubo24.position.set(124,12,0);
      cubo25.position.set(135,4,0);
      cubo26.position.set(142,18,0);
      cubo27.position.set(149,12,0);
      cubo28.position.set(156,6,0);
      cubo29.position.set(165,15,0);
      cubo30.position.set(174,10,0);

      // Añadimos cada objeto en su array para las colisiones
      pinchos.push(pincho);
      pinchos.push(pincho2);
      pinchos.push(pincho3);
      pinchos.push(pincho4);
      pinchos.push(pincho5);
      pinchos.push(pincho6);
      pinchos.push(pincho7);
      pinchos.push(pincho8);
      pinchos.push(pincho9);
      pinchos.push(pincho10);
      cubos.push(cubo);
      cubos.push(cubo2);
      cubos.push(cubo3);
      cubos.push(cubo4);  
      cubos.push(cubo5);
      cubos.push(cubo6);
      cubos.push(cubo7);
      cubos.push(cubo8);
      cubos.push(cubo9);
      cubos.push(cubo10);
      cubos.push(cubo11);
      cubos.push(cubo12);
      cubos.push(cubo13);
      cubos.push(cubo14);
      cubos.push(cubo15);
      cubos.push(cubo16);
      cubos.push(cubo17);
      cubos.push(cubo18);
      cubos.push(cubo19);
      cubos.push(cubo20);
      cubos.push(cubo21);
      cubos.push(cubo22);
      cubos.push(cubo23);
      cubos.push(cubo24);
      cubos.push(cubo25);
      cubos.push(cubo26);
      cubos.push(cubo27);
      cubos.push(cubo28);
      cubos.push(cubo29);
      cubos.push(cubo30);

      // Añadimos los objetos a la escena
      this.add(pincho);
      this.add(pincho2); 
      this.add(cubo);
      this.add(cubo2);
      this.add(cubo3);
      this.add(cubo4);
      this.add(pincho3);
      this.add(pincho4);
      this.add(pincho5);
      this.add(pincho6);
      this.add(pincho7);
      this.add(pincho8);
      this.add(pincho9);
      this.add(pincho10);
      this.add(cubo5);
      this.add(cubo6);
      this.add(cubo7);
      this.add(cubo8);
      this.add(cubo9);
      this.add(cubo10);
      this.add(cubo11);
      this.add(cubo12);
      this.add(cubo13);
      this.add(cubo14);
      this.add(cubo15);
      this.add(cubo16);
      this.add(cubo17);
      this.add(cubo18);
      this.add(cubo19);
      this.add(cubo20);
      this.add(cubo21);
      this.add(cubo22);
      this.add(cubo23);
      this.add(cubo24);
      this.add(cubo25);
      this.add(cubo26);
      this.add(cubo27);
      this.add(cubo28);
      this.add(cubo29);
      this.add(cubo30);
    }

    crearObstaculosRoof(){
      // Añadimos los objetos que tiene el suelo (los obstáculos)
      // Serán cubos y conos
      var geomPincho = new THREE.ConeGeometry(1.5,2,3);
      var geomCubo = new THREE.BoxGeometry(2,2,2);
      var matObstaculos = new THREE.MeshPhongMaterial({color:0x8c004b});

      // Creamos los objetos
      var cubo31 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo32 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo33 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo34 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo35 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo36 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo37 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo38 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo39 = new THREE.Mesh(geomCubo,matObstaculos);
      var cubo40 = new THREE.Mesh(geomCubo,matObstaculos);
      var pincho11 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho12 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho13 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho14 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho15 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho16 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho17 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho18 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho19 = new THREE.Mesh(geomPincho,matObstaculos);
      var pincho20 = new THREE.Mesh(geomPincho,matObstaculos);

      // Los colocamos en su posición
      cubo31.position.set(186,1,0);
      cubo32.position.set(188,1,0);
      pincho11.position.set(198,1,0);
      pincho11.rotateY(Math.PI);
      pincho12.position.set(205,20,0);
      pincho12.rotateX(Math.PI);
      pincho13.position.set(212,1,0);
      pincho13.rotateY(Math.PI);
      cubo33.position.set(215,1,0);
      cubo34.position.set(230,20,0);
      cubo35.position.set(236,1,0);
      pincho14.position.set(246,20,0);
      pincho14.rotateX(Math.PI);
      pincho15.position.set(264,1,0);
      pincho15.rotateY(Math.PI);
      cubo36.position.set(274,20,0);
      cubo37.position.set(280,1,0);
      pincho16.position.set(296,20,0);
      pincho16.rotateX(Math.PI);
      cubo38.position.set(308,1,0);
      pincho17.position.set(319,20,0);
      pincho17.rotateX(Math.PI);
      pincho18.position.set(330,1,0);
      pincho18.rotateY(Math.PI);
      cubo39.position.set(338,20,0);
      //pincho19.position.set(339.5,1,0);
      //cubo40.position.set(342,1,0);
      pincho20.position.set(354,20,0);
      pincho20.rotateX(Math.PI);

      // Añadimos
      cubos.push(cubo31);
      cubos.push(cubo32);
      cubos.push(cubo33);
      cubos.push(cubo34);
      cubos.push(cubo35);
      cubos.push(cubo36);
      cubos.push(cubo37);
      cubos.push(cubo38);
      cubos.push(cubo39);
      cubos.push(cubo40);
      pinchos.push(pincho11);
      pinchos.push(pincho12);
      pinchos.push(pincho13);
      pinchos.push(pincho14);
      pinchos.push(pincho15);
      pinchos.push(pincho16);
      pinchos.push(pincho17);
      pinchos.push(pincho18);
      pinchos.push(pincho19);
      pinchos.push(pincho20);

      // Los añadimos a la escena
      this.add(cubo31);
      this.add(cubo32);
      this.add(cubo33);
      this.add(cubo34);
      this.add(cubo35);
      this.add(cubo36);
      this.add(cubo37);
      this.add(cubo38);
      this.add(cubo39);
      this.add(cubo40);

      this.add(pincho11);
      this.add(pincho12);
      this.add(pincho13);
      this.add(pincho14);
      this.add(pincho15);
      this.add(pincho16);
      this.add(pincho17);
      this.add(pincho18);
      this.add(pincho19);
      this.add(pincho20);
    }

    /**************************************************************/
    /**************************************************************/
    // FUNCIONES PARA LA COLISIÓN
    // Colision con los objetos cubo del mapa
    colisionCubos(){
      // Creamos un rayo
      var rayo = new THREE.Raycaster(this.model.position, new THREE.Vector3(1,0,0),0,0.5);

      for(let i=0; i < cubos.length; i++){
        var interseccion = rayo.intersectObject(cubos[i]);

        if( interseccion.length > 0 ){
          window.alert("!HAS CHOCADO");
          this.reseteaJuego();
        }
      }      
    }

    // Colision con los objetos cono del mapa
    colisionPinchos(){
      // Creamos un rayo
      var rayo = new THREE.Raycaster(this.model.position, new THREE.Vector3(1,0,0),0,0.5);

      for(let i=0; i < pinchos.length; i++){
        var interseccion = rayo.intersectObject(pinchos[i]);

        if( interseccion.length > 0 ){
          window.alert("!HAS CHOCADO");
          this.reseteaJuego();
        }
      }    
    }

    /**************************************************************/
    /**************************************************************/
    // FUNCIONES DE LOS MOVIMIENTOS
    // Función para el salto de la caja
    saltar(x,y,z){

      // Ponemos el salto a false
      saltoCubo = false;

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
  
      var animacion = new TWEEN.Tween(origen1).to(dest1, 1000).onUpdate(()=>{
        var pos = this.camino.getPointAt(origen1.p);
        this.model.position.copy(pos);
        var tangente = this.camino.getTangentAt(origen1.p);
        pos.add(tangente);
      });

      // Empezamos la animacion
      animacion.start();

      // Ponemos el booleano a true
      animacion.onComplete(() => {
        saltoCubo = true;
      })
    }

    // Funcion nave arriba
    moverArriba(){
      this.model.position.y += 0.5;
      if(this.model.position.y > 19){
        this.model.position.y = 19;
      }
    }

    // Funcion nave abajo
    moverAbajo(){
      this.model.position.y -= 0.5;
      if(this.model.position.y < 1){
        this.model.position.y = 1;
      }
    }

    // Función para el cambio de suelo a techo
    cambio(x,y,z){
      // Creamos el camino por el que irá el objeto
      // El true hace que el camino sea cerrado
      this.camino1 = new THREE.CatmullRomCurve3(
        [ new THREE.Vector3(x,y,z),
            new THREE.Vector3(x+2.5,y+2.5,z),
            new THREE.Vector3(x+5,y+5,z),
            new THREE.Vector3(x+6.25,y+7.5,z),
            new THREE.Vector3(x+7.5,y+10,z),
            new THREE.Vector3(x+9.5,y+19,z)]
      );

      this.camino2 = new THREE.CatmullRomCurve3(
        [new THREE.Vector3(x,y,z),
          new THREE.Vector3(x+2.5,y-2.5,z),
          new THREE.Vector3(x+5,y-5,z),
          new THREE.Vector3(x+6.25,y-7.5,z),
          new THREE.Vector3(x+7.5,y-10,z),
          new THREE.Vector3(x+9.5,y-19,z)]
      )

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
      var origen2 = {p: 0};
      var dest2 = {p: 1};

      if( cambioCirculo == true ){
        var animacion = new TWEEN.Tween(origen1).to(dest1, 1000).onUpdate(()=>{
          var pos = this.camino1.getPointAt(origen1.p);
          this.model.position.copy(pos);
          var tangente = this.camino1.getTangentAt(origen1.p);
          pos.add(tangente);
        });

        // Empezamos la animacion
        animacion.start();  

        animacion.onComplete(() => {
          cambioCirculo = false;
        });
      }
      else{
        var animacion2 = new TWEEN.Tween(origen2).to(dest2, 1000).onUpdate(()=>{
          var pos = this.camino2.getPointAt(origen2.p);
          this.model.position.copy(pos);
          var tangente = this.camino2.getTangentAt(origen2.p);
          pos.add(tangente);
        });

        // Empezamos la animacion
        animacion2.start();  

        animacion2.onComplete(() => {
          cambioCirculo = true;
        })
      }   
    }

    // Función para reiniciar
    reseteaJuego(){
      // Volvemos a tener un cubo
      this.model.Reseteo(movNave,saltoCirculo);

      // Al chocarte, devuelve el objeto a la posición inicial
      this.model.position.set(-300,1,0);
      this.camera.position.set(this.model.getPosX(),5,125);

      // Incrementamos los intentos
      MyScene.attempts++;
      // Actualizamos su valor
      this.contador_intentos.innerHTML = MyScene.attempts;
      
      // Actualizamos los booleanos para los movimientos
      saltoCubo = true;
      saltoCirculo = false;
      movNave = false;
    }

    finJuego(){
      // Eliminamos el objeto
      this.model.finJuego();
    
      // Hacemos aparecer los mensajes de final
      $("#fin").fadeIn(2000);
      $("#imagenVidas").fadeIn(200);
      $("#contadorIntentos").html(MyScene.attempts).fadeIn(3000);
      $("#botonReiniciar").delay(4000).fadeIn(2000);
      $("#botonFinal").delay(5000).fadeIn(2000);     
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
  window.addEventListener( "mousedown", (event) => scene.onMouseDown(event));
});
  