/* global THREE */
var camera, scene;
var box, cube, cube2;
var renderer, vrrenderer;
var vrHMD, vrHMDSensor;
var pos = 0;

function initScene() {
    scene = new THREE.Scene();

    var width  = window.innerWidth;
    var height = window.innerHeight;
    var fov    = 60;
    var aspect = width / height;
    var near   = 1;
    var far    = 5000;
    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 50, 0 );
    
    // Controls
    var controls = new THREE.OrbitControls(camera);
    controls.rotateUp(Math.PI / 4);
    controls.target.set(
      camera.position.x + 0.1,
      camera.position.y,
      camera.position.z
    );

    // Light
    var light = new THREE.PointLight( 0xffffff, 1.5, 500 );
    light.position.set( 0, 200, 0 );
    scene.add( light );
    
    // Box
    var geometry = new THREE.BoxGeometry( 30, 30, 30 );
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
    box = new THREE.Mesh( geometry, material );
    box.position.set(0, 0, 0);
    scene.add(box);
    
    // Sphere
    var sphere = new THREE.SphereGeometry(30);
    var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
    cube = new THREE.Mesh( sphere, cubeMaterial );
    cube.position.y = 30;
    scene.add(cube);
    
    var sphere = new THREE.SphereGeometry(20);
    var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    cube2 = new THREE.Mesh( sphere, cubeMaterial );
    cube2.position.y = 20;
    scene.add(cube2);
    
    // Plane
    var geometry = new THREE.PlaneGeometry( 10000, 10000, 10, 10 );
    var texture  = new THREE.ImageUtils.loadTexture('js/threejs/examples/textures/waternormals.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 64, 64 );
    var material = new THREE.MeshLambertMaterial({map: texture});    
    var plane = new THREE.Mesh( geometry, material );
    plane.rotation.x = -Math.PI / 2;
    scene.add( plane );
    
    document.getElementById('container').addEventListener('click', toggleFullScreen, false);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild( renderer.domElement );
    
    vrrenderer = new THREE.VRRenderer(renderer, vrHMD);
}

function render () {
        requestAnimationFrame( render );
        
        pos += 0.03;
        cube.position.x = Math.cos( pos ) * 300;
        cube.position.z = Math.sin( pos ) * 300;
        cube2.position.x = Math.cos( pos * 2) * 150;
        cube2.position.z = Math.sin( pos * 2) * 150;

        box.rotation.set(
          0,
          box.rotation.y + .01,
          box.rotation.z + .01
        );
        
        var state = vrHMDSensor.getState();
        camera.quaternion.set(state.orientation.x, state.orientation.y, state.orientation.z, state.orientation.w);  
        vrrenderer.render( scene, camera );
}

window.addEventListener("load", function() {
    if (navigator.getVRDevices) {
        navigator.getVRDevices().then(vrDeviceCallback);
    } else if (navigator.mozGetVRDevices) {
        navigator.mozGetVRDevices(vrDeviceCallback);
    }
}, false);

function vrDeviceCallback(vrdevs) {
    for (var i = 0; i < vrdevs.length; ++i) {
        if (vrdevs[i] instanceof HMDVRDevice) {
            vrHMD = vrdevs[i];
            break;
        }
    }
    for (var i = 0; i < vrdevs.length; ++i) {
        if (vrdevs[i] instanceof PositionSensorVRDevice &&
            vrdevs[i].hardwareUnitId == vrHMD.hardwareUnitId) {
            vrHMDSensor = vrdevs[i];
            break;
        }
    }
    initScene();
    initRenderer();
    render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard method
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {              // current working methods

        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.msRequestFullScreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen({vrDisplay: vrHMD});
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen({vrDisplay: vrHMD});
        }

    } else {

        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }

    }
}
