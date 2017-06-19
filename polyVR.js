let camera;
let renderer;

const blue = new THREE.LineBasicMaterial({color: 0x1e90ff, opacity: 0.6});
const red = new THREE.LineBasicMaterial({color: 0xff0000, opacity: 0.6});
const yellow = new THREE.LineBasicMaterial({color: 0xffff00, opacity: 0.6});
const bry = [blue, red, yellow];


setupArray();

function init() {
  const groupB = new THREE.Group();
  const groupR = new THREE.Group();
  const groupY = new THREE.Group();
  const groups = [groupB, groupR, groupY];
  const scene = new THREE.Scene();

  const divide = 100;
  const angle = 2 * Math.PI / divide;
  let rot = 0;


  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  const canvas = renderer.domElement;
  canvas.addEventListener('click', function() {
    canvas.webkitRequestFullScreen();
  });

  camera = new THREE.PerspectiveCamera(45,
                                       window.innerWidth / window.innerHeight,
                                       0.1, 3000);

  camera.position.z = -1200;
  camera.lookAt(scene.position);

  const effect = new THREE.CardboardEffect(renderer);

  paintComponent();

  document.getElementById("WebGL-output").appendChild(renderer.domElement);
  render();


  function render() {
<<<<<<< HEAD
    if (rot < divide) {
      scene.rotation.y += angle;
      rot++;
    } else if (rot < 2 * divide) {
      scene.rotation.x += angle;
      rot++;
    } else {
      rot = 0;
    }
    controls.update();
=======
>>>>>>> parent of d15d604... Add Headtracking
    requestAnimationFrame(render);
    effect.render(scene, camera);
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
}


function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
