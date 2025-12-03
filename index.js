import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();

function createDawnGradient() {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, "#ffdfcc");  
  gradient.addColorStop(0.5, "#ffcf9e");
  gradient.addColorStop(1, "#a7c7e7");   

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2, 512);

  return new THREE.CanvasTexture(canvas);
}

scene.background = createDawnGradient();

scene.fog = new THREE.Fog("#a7c7e7", 250, 2000);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);
camera.position.set(0.01, 19.83, 264.67);
camera.rotation.set(-4.3, 0.0, 0.00);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.getElementById("container3D").appendChild(renderer.domElement);
document.body.appendChild(Object.assign(document.createElement("div"), {style:"position:fixed;bottom:10px;left:10px;padding:4px 8px;background:rgba(0,0,0,0.6);color:#fff;font-family:monospace;font-size:12px;border-radius:4px;z-index:1000;", id:"cameraInfo"})) && (function f(){document.getElementById("cameraInfo").innerHTML=`Pos: x:${camera.position.x.toFixed(2)}, y:${camera.position.y.toFixed(2)}, z:${camera.position.z.toFixed(2)}<br>Rot: x:${THREE.MathUtils.radToDeg(camera.rotation.x).toFixed(1)}, y:${THREE.MathUtils.radToDeg(camera.rotation.y).toFixed(1)}, z:${THREE.MathUtils.radToDeg(camera.rotation.z).toFixed(1)}`; requestAnimationFrame(f)})();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 20;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2.1;

scene.add(new THREE.AmbientLight(0xfff3d9, 0.8)); 

const sun = new THREE.DirectionalLight(0xffe2b0, 1);
sun.position.set(-80, 120, -40); 
sun.castShadow = true;
scene.add(sun);

const hemiLight = new THREE.HemisphereLight(0xffe9d2, 0x7fa0b7, 0.5);
scene.add(hemiLight);

function createCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  const grd = ctx.createRadialGradient(256, 128, 30, 256, 128, 220);
  grd.addColorStop(0, "rgba(255,255,255,0.75)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 512, 256);

  return new THREE.CanvasTexture(canvas);
}

const cloudTexture = createCloudTexture();
cloudTexture.needsUpdate = true;

const clouds = new THREE.Group();
scene.add(clouds);

for (let i = 0; i < 8; i++) {
  const cloud = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 200),
    new THREE.MeshBasicMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    })
  );

  cloud.position.set(
    (Math.random() - 0.5) * 2000,
    120 + Math.random() * 50,
    -400 - Math.random() * 400
  );

  cloud.rotation.y = Math.random() * Math.PI;
  cloud.userData.speed = 0.03 + Math.random() * 0.05;
  clouds.add(cloud);
}

const loader = new GLTFLoader();
const clickableBuildings = [];
const treeLeaves = [];
const floatingTexts = [];
const cityOffset = 10;

const buildingDescriptions = {
  "buildingA": `<div class="tooltip-title">Arduino IDE</div><div class="tooltip-body">In this course on interaction and physical computing, I learned to use the Arduino microcontroller to create both functional and creative projects.
   Click on the building to explore my Arduino projects.</div>`,
  "buildingB": `<div class="tooltip-title">Processing IDE</div><div class="tooltip-body">In a computer graphics course, I explored Processing to transform math, functions, and data into visual elements through creative coding.
   Click on the building to explore my Processing projects.</div>`,
  "buildingC": `<div class="tooltip-title">Web Design</div><div class="tooltip-body">In multimedia web design, I learned HTML, CSS, and JavaScript, along with tools like p5.js and Twine for interactive websites. I also explored Three.js, which helped me create the 3D environment for this site.
   Click on the building to explore my web design projects.</div>`,
  "buildingD": `<div class="tooltip-title">Digital Design</div><div class="tooltip-body">This course introduced me to design principles (Papnek’s function complex, Dieter Rams’ 10 principles, and design ethics) and creative methods like brainstorming and bisociation. I focused on solving real-world problems through research and thoughtful design.
   Click on the building to explore my digital design projects.</div>`,
  "buildingE": `<div class="tooltip-title">Blender</div><div class="tooltip-body">Through a 3D modeling and animation course, I gained skills in modeling, lighting, cameras, materials, textures, physics, particles, compositing, and sculpting. I applied these skills to create 3D environments, including the city featured in this portfolio.
   Click on the building to explore my Blender projects.</div>`,
  "buildingF": `<div class="tooltip-title">Data Visualization</div><div class="tooltip-body">In Data Visualisation and Aesthetics, I learned to rethink graphs and charts, applying color theory, typography, hierarchy, and chart design principles. I also used Python and R to create clear and effective data visualisations.
   Click on the building to explore my data visualisation projects.</div>`,
};

const buildingURLs = {
  "buildingA": "buildingA.html",
  "buildingB": "buildingB.html",
  "buildingC": "buildingC.html",
  "buildingD": "buildingD.html",
  "buildingE": "buildingE.html",
  "buildingF": "buildingF.html"
};

function addClickable(obj, prefix) {
  if (obj.isMesh) {
    obj.userData.originalScale = obj.scale.clone();
    clickableBuildings.push({
      mesh: obj,
      url: buildingURLs[prefix],
      desc: buildingDescriptions[prefix]
    });
  }
  obj.children.forEach(child => addClickable(child, prefix));
}

loader.load("assets/city12.glb", (gltf) => {
  const city = gltf.scene;
  city.scale.set(5, 5, 5);

  const box = new THREE.Box3().setFromObject(city);
  const height = box.max.y - box.min.y;
  city.position.y = -height / 2 - cityOffset;

  scene.add(city);

  city.traverse(child => {
    for (let prefix in buildingURLs) {
      if (child.name && child.name.startsWith(prefix)) addClickable(child, prefix);
    }

    if (child.name && /^Text[A-G]$/.test(child.name)) {
      child.userData.baseY = child.position.y;
      floatingTexts.push(child);
    }

    if (child.name && /^tree(1[0-4]|[1-9])$/.test(child.name)) {
      child.userData.baseRotation = child.rotation.clone();
      child.userData.swayPhase = Math.random() * Math.PI * 2;
      child.userData.swayAmplitude = 0.03 + Math.random() * 0.02;
      child.userData.swaySpeed = 1.0 + Math.random() * 0.5;
      treeLeaves.push(child);
    }
  });
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoBox = document.getElementById("infoBox");

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableBuildings.map(b => b.mesh));

  if (intersects.length > 0) {
    const mesh = intersects[0].object;
    const building = clickableBuildings.find(b => b.mesh === mesh);
    document.body.style.cursor = "pointer";

    infoBox.style.display = "block";
    infoBox.style.left = event.clientX + 15 + "px";
    infoBox.style.top = event.clientY + 15 + "px";
    infoBox.innerHTML = building.desc;
  } else {
    document.body.style.cursor = "default";
    infoBox.style.display = "none";
  }
}

function onClick() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableBuildings.map(b => b.mesh));
  if (intersects.length > 0) {
    const mesh = intersects[0].object;
    const building = clickableBuildings.find(b => b.mesh === mesh);
    if (building) window.location.href = building.url;
  }
}

window.addEventListener("mousemove", onMouseMove);
window.addEventListener("click", onClick);

const minDistance = 50;
const maxDistance = 400;

window.addEventListener("wheel", (event) => {
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  camera.position.addScaledVector(direction, event.deltaY * 0.02);

  const referencePoint = new THREE.Vector3(0, 0, 0);
  const distance = camera.position.distanceTo(referencePoint);

  if (distance < minDistance) {
    camera.position.copy(direction.clone().multiplyScalar(minDistance).add(referencePoint));
  }
  if (distance > maxDistance) {
    camera.position.copy(direction.clone().multiplyScalar(maxDistance).add(referencePoint));
  }
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  const t = performance.now() * 0.001;

  floatingTexts.forEach((txt, i) => {
    const speed = 1.0;
    const amplitude = 0.5;
    const baseY = txt.userData.baseY;
    txt.position.y = baseY + Math.sin(t * speed + i * 0.7) * amplitude;
  });

  treeLeaves.forEach((leaf) => {
    leaf.rotation.y = leaf.userData.baseRotation.y + Math.sin(t * leaf.userData.swaySpeed + leaf.userData.swayPhase) * leaf.userData.swayAmplitude;
    leaf.rotation.x = leaf.userData.baseRotation.x + Math.sin(t * leaf.userData.swaySpeed * 1.3 + leaf.userData.swayPhase) * leaf.userData.swayAmplitude;
  });

  clouds.children.forEach(cloud => {
    cloud.position.x += cloud.userData.speed;

    if (cloud.position.x > 1200) {
      cloud.position.x = -1200;
    }
  });

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
