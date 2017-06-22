let camera;
let renderer;


function init() {
  const blue = new THREE.LineBasicMaterial({color: 0x1e90ff, opacity: 0.6});
  const red = new THREE.LineBasicMaterial({color: 0xff0000, opacity: 0.6});
  const yellow = new THREE.LineBasicMaterial({color: 0xffff00, opacity: 0.6});
  const bry = [blue, red, yellow];

  const groupB = new THREE.Group();
  const groupR = new THREE.Group();
  const groupY = new THREE.Group();
  const groups = [groupB, groupR, groupY];
  const scene = new THREE.Scene();

  let st = 0;
  const state = [1, 1.5, 2, 2.5, 3, 5-GR, 4];
  let rotationX = 0;
  let rotationY = 0;
  let rotationZ = 0;
  let visible_blue = true;
  let visible_red = true;
  let visible_yellow = true;
  let visible_axis = false;


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

  const controls = new THREE.VRControls(camera);
  const effect = new THREE.VREffect(renderer);
  const clock = new THREE.Clock();
  if (WEBVR.isAvailable()) {
    document.body.appendChild(WEBVR.getButton(effect));
  }

  const axis = new THREE.AxisHelper(450);
  scene.add(axis);

  setupArray();
  paintComponent();

  window.addEventListener("keydown", function(e) {
    // change state (t or space)
    if (e.keyCode == 84 || e.keyCode == 32) {
      st = (st + 1) % 7;
      t = state[st];
      reset();
      setupArray();

      // remove all existing lines
      for (let i = 1; i <= 3; i++) {
        while (scene.children[i].children.length > 0) {
          scene.children[i].remove(scene.children[i].children[0]);
        }
      }

      paintComponent();
    }

    // move
    // x plus (h or left)
    if (e.keyCode == 72 || e.keyCode == 37) {
      scene.position.x += 10;
    }
    // x minus (l or right)
    if (e.keyCode == 76 || e.keyCode == 39) {
      scene.position.x -= 10;
    }
    // y plus (k or up)
    if (e.keyCode == 75 || e.keyCode == 38) {
      scene.position.y += 10;
    }
    // y minus (j or down)
    if (e.keyCode == 74 || e.keyCode == 40) {
      scene.position.y -= 10;
    }
    // z plus (p or PageDown)
    if (e.keyCode == 80 || e.keyCode == 34) {
      scene.position.z += 10;
    }
    // z minus (n or PageUp)
    if (e.keyCode == 78 || e.keyCode == 33) {
      scene.position.z -= 10;
    }

    // rotation
    // x plus (i)
    if (e.keyCode == 73) {
      if (rotationX > 0) {
        rotationX = 0;
      } else {
        rotationX = 1;
      }
    }
    // x minus (u)
    if (e.keyCode == 85) {
      if (rotationX < 0) {
        rotationX = 0;
      } else {
        rotationX = -1;
      }
    }
    // y plus (o)
    if (e.keyCode == 79) {
      if (rotationY > 0) {
        rotationY = 0;
      } else {
        rotationY = 1;
      }
    }
    // y minus (y)
    if (e.keyCode == 89) {
      if (rotationY < 0) {
        rotationY = 0;
      } else {
        rotationY = -1;
      }
    }
    // z plus (m)
    if (e.keyCode == 77) {
      if (rotationZ > 0) {
        rotationZ = 0;
      } else {
        rotationZ = 1;
      }
    }
    // z minus (b)
    if (e.keyCode == 66) {
      if (rotationZ < 0) {
        rotationZ = 0;
      } else {
        rotationZ = -1;
      }
    }

    // visible
    // blue (z)
    if (e.keyCode == 90) {
      if (visible_blue) {
        visible_blue = false;
      } else {
        visible_blue = true;
      }
    }
    // red (x)
    if (e.keyCode == 88) {
      if (visible_red) {
        visible_red = false;
      } else {
        visible_red = true;
      }
    }
    // yellow (c)
    if (e.keyCode == 67) {
      if (visible_yellow) {
        visible_yellow = false;
      } else {
        visible_yellow = true;
      }
    }
    // axis (v)
    if (e.keyCode == 86) {
      if (visible_axis) {
        visible_axis = false;
      } else {
        visible_axis = true;
      }
    }
  });

  document.getElementById("WebGL-output").appendChild(renderer.domElement);
  render();


  function render() {
    const delta = clock.getDelta();
    controls.update(delta);

    if (rotationX > 0) {
      scene.rotation.x += 0.01;
    } else if (rotationX < 0) {
      scene.rotation.x -= 0.01;
    }
    if (rotationY > 0) {
      scene.rotation.y += 0.01;
    } else if (rotationY < 0) {
      scene.rotation.y -= 0.01;
    }
    if (rotationZ > 0) {
      scene.rotation.z += 0.01;
    } else if (rotationZ < 0) {
      scene.rotation.z -= 0.01;
    }


    groupB.visible = visible_blue;
    groupR.visible = visible_red;
    groupY.visible = visible_yellow;
    axis.visible = visible_axis;

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
