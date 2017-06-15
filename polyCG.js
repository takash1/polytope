var camera;
var scene;
var renderer;

var blue = new THREE.LineBasicMaterial({color: 0x1e90ff, opacity: 0.6});
var red = new THREE.LineBasicMaterial({color: 0xff0000, opacity: 0.6});
var yellow = new THREE.LineBasicMaterial({color: 0xffff00, opacity: 0.6});
var bry = [blue, red, yellow];

setupArray();

function init() {
  let stats = initStats();
  let clock = new THREE.Clock();
  let groupB = new THREE.Group();
  let groupR = new THREE.Group();
  let groupY = new THREE.Group();
  let groups = [groupB, groupR, groupY];

  scene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(window.innerWidth / -2,
                                        window.innerWidth / 2,
                                        window.innerHeight / 2,
                                        window.innerHeight / -2,
                                        -100, 3000);


  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.z = -1000;
  camera.lookAt(scene.position);


  let trackballConrols = new THREE.OrthographicTrackballControls(camera);
  trackballConrols.rotateSpeed = 0.05;
  trackballConrols.zoomSpeed = 0.1;
  trackballConrols.panSpeed = 0.1;

  let axis = new THREE.AxisHelper(450);
  scene.add(axis);

  paintComponent();

  let controls = new function() {
    this.rotationX = false;
    this.rotationY = false;
    this.rotationZ = false;

    this.blue = true;
    this.red = true;
    this.yellow = true;
    this.axis = false;
  };

  let gui = new dat.GUI();

  let guiRotation = gui.addFolder('rotation');
  guiRotation.add(controls, 'rotationX');
  guiRotation.add(controls, 'rotationY');
  guiRotation.add(controls, 'rotationZ');

  let guiLines = gui.addFolder('lines');
  guiLines.add(controls, 'blue');
  guiLines.add(controls, 'red');
  guiLines.add(controls, 'yellow');
  guiLines.add(controls, 'axis');

  document.getElementById("WebGL-output").appendChild(renderer.domElement);
  render();


  function render() {
    stats.update();
    let delta = clock.getDelta();
    trackballConrols.update(delta);

    if (controls.rotationX) {
      scene.rotation.x += 0.01;
    }
    if (controls.rotationY) {
      scene.rotation.y += 0.01;
    }
    if (controls.rotationZ) {
      scene.rotation.z += 0.01;
    }

    groupB.visible = controls.blue;
    groupR.visible = controls.red;
    groupY.visible = controls.yellow;
    axis.visible = controls.axis;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }


  function paintComponent() {
    for (let dim = 0; dim < 4; dim++) {
      if (dim <= t && t <= dim + 2) {
        for (let j = 0; j < 3; j++) {
          for (let i = tenum[dim][j]; i < tenum[dim][j+1]; i++) {
            let lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(new THREE.Vector3(ends(dim, i)[0][0],
                                                         ends(dim, i)[0][1],
                                                         ends(dim, i)[0][2]));
            lineGeometry.vertices.push(new THREE.Vector3(ends(dim, i)[1][0],
                                                         ends(dim, i)[1][1],
                                                         ends(dim, i)[1][2]));
            let line = new THREE.Line(lineGeometry, bry[j]);
            groups[j].add(line);
          }
          scene.add(groups[j]);
        }
      }
    }
  }


  function initStats() {
    let stats = new Stats();

    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.getElementById("Stats-output").appendChild(stats.domElement);

    return stats;
  }
}


function onResize() {
  camera.left = window.innerWidth / -2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = window.innerHeight / -2;

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
