let camera;
let renderer;

const blue = new THREE.LineBasicMaterial({color: 0x1e90ff, opacity: 0.6});
const red = new THREE.LineBasicMaterial({color: 0xff0000, opacity: 0.6});
const yellow = new THREE.LineBasicMaterial({color: 0xffff00, opacity: 0.6});
const bry = [blue, red, yellow];

setupArray();

function init() {
  const stats = initStats();
  const clock = new THREE.Clock();
  const groupB = new THREE.Group();
  const groupR = new THREE.Group();
  const groupY = new THREE.Group();
  const groups = [groupB, groupR, groupY];
  const scene = new THREE.Scene();


  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);


  camera = new THREE.PerspectiveCamera(45,
                                 window.innerWidth / window.innerHeight,
                                 0.1, 3000);
  camera.position.z = -780;
  camera.lookAt(scene.position);

  let trackballConrols = new THREE.TrackballControls(camera,
                                                     renderer.domElement);
  trackballConrols.rotateSpeed = 1.0;
  trackballConrols.zoomSpeed = 0.1;
  trackballConrols.panSpeed = 0.1;


  const axis = new THREE.AxisHelper(450);
  scene.add(axis);

  paintComponent();


  const controls = new function() {
    this.rotationX = false;
    this.rotationY = false;
    this.rotationZ = false;

    this.blue = true;
    this.red = true;
    this.yellow = true;
    this.axis = false;

    this.cameraMode = "Perspective";
    this.switchCamera = function() {
      if (camera instanceof THREE.PerspectiveCamera) {
        camera = new THREE.OrthographicCamera(window.innerWidth / -2,
                                              window.innerWidth / 2,
                                              window.innerHeight / 2,
                                              window.innerHeight / -2,
                                              -100, 3000);
        camera.position.z = -1000;
        camera.lookAt(scene.position);

        trackballConrols = new THREE.OrthographicTrackballControls(camera,
                                                          renderer.domElement);
        trackballConrols.rotateSpeed = 0.05;
        trackballConrols.zoomSpeed = 0.1;
        trackballConrols.panSpeed = 0.1;

        this.cameraMode = "Orthographic";
      } else {
        camera = new THREE.PerspectiveCamera(45,
                                       window.innerWidth / window.innerHeight,
                                       0.1, 3000);
        camera.position.z = -780;
        camera.lookAt(scene.position);

        trackballConrols = new THREE.TrackballControls(camera,
                                                       renderer.domElement);
        trackballConrols.rotateSpeed = 1.0;
        trackballConrols.zoomSpeed = 0.1;
        trackballConrols.panSpeed = 0.1;

        this.cameraMode = "Perspective";
      }
    };

    this.state = 'regular600';
    this.redraw = function() {
      switch (controls.state) {
        case 'regular600':
          t = STATE[0];
          break;
        case 'truncated600':
          t = STATE[1];
          break;
        case 'rectified600':
          t = STATE[2];
          break;
        case 'bitruncated':
          t = STATE[3];
          break;
        case 'rectified120':
          t = STATE[4];
          break;
        case 'truncated120':
          t = STATE[5];
          break;
        case 'regular120':
          t = STATE[6];
          break;
        default:
          t = STATE[0];
      }
      reset();
      setupArray();

      // remove all existing lines
      for (let i = 1; i <= 3; i++) {
        while (scene.children[i].children.length > 0) {
          scene.children[i].remove(scene.children[i].children[0]);
        }
      }

      paintComponent();
    };
  };

  const gui = new dat.GUI();

  gui.add(controls, 'state',
          ['regular600', 'truncated600', 'rectified600',
           'bitruncated', 'rectified120', 'truncated120',
           'regular120']).onChange(controls.redraw);

  gui.add(controls, 'switchCamera');
  gui.add(controls, 'cameraMode').listen();

  const guiRotation = gui.addFolder('rotation');
  guiRotation.add(controls, 'rotationX');
  guiRotation.add(controls, 'rotationY');
  guiRotation.add(controls, 'rotationZ');

  const guiLines = gui.addFolder('lines');
  guiLines.add(controls, 'blue');
  guiLines.add(controls, 'red');
  guiLines.add(controls, 'yellow');
  guiLines.add(controls, 'axis');

  document.getElementById("WebGL-output").appendChild(renderer.domElement);
  render();


  function render() {
    stats.update();
    const delta = clock.getDelta();
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
            const lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(new THREE.Vector3(ends(dim, i)[0][0],
                                                         ends(dim, i)[0][1],
                                                         ends(dim, i)[0][2]));
            lineGeometry.vertices.push(new THREE.Vector3(ends(dim, i)[1][0],
                                                         ends(dim, i)[1][1],
                                                         ends(dim, i)[1][2]));
            const line = new THREE.Line(lineGeometry, bry[j]);
            groups[j].add(line);
          }
          scene.add(groups[j]);
        }
      }
    }
  }


  function initStats() {
    const stats = new Stats();

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
