var camera;
var scene;
var renderer;

var drawbry = [true, true, true];
var blue = new THREE.LineBasicMaterial({color: 0x1e90ff, opacity: 0.6});
var red = new THREE.LineBasicMaterial({color: 0xff0000, opacity: 0.6});
var yellow = new THREE.LineBasicMaterial({color: 0xffff00, opacity: 0.6});
var bry = [blue, red, yellow];

setupArray();

function init() {
  let groupB = new THREE.Group();
  let groupR = new THREE.Group();
  let groupY = new THREE.Group();
  let groups = [groupB, groupR, groupY];

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45,
                                       window.innerWidth / window.innerHeight,
                                       0.1, 3000);

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  let canvas = renderer.domElement;
  canvas.addEventListener('click', function() {
    canvas.webkitRequestFullScreen();
  });

  camera.position.z = -1200;
  camera.lookAt(scene.position);

  let effect = new THREE.CardboardEffect(renderer);

  paintComponent();

  document.getElementById("WebGL-output").appendChild(renderer.domElement);
  render();


  function render() {
    requestAnimationFrame(render);
    effect.render(scene, camera);
  }


  function paintComponent() {
    for (let dim = 0; dim < 4; dim++) {
      if (dim <= t && t <= dim + 2) {
        for (let j = 0; j < 3; j++) {
          if (drawbry[j]) {
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
          }
          scene.add(groups[j]);
        }
      }
    }
  }
}


function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
