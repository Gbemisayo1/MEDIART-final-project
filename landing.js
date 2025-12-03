import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const lines = document.querySelectorAll('.text.typewriter h1 span');
const button = document.getElementById('btn');

let lineIndex = 0;

function typeLine(line, callback) {
    const text = line.textContent;
    line.textContent = '';
    line.style.opacity = 1;
    let charIndex = 0;

    function typeChar() {
        if (charIndex < text.length) {
            line.textContent += text[charIndex];
            charIndex++;
            setTimeout(typeChar, 45);
        } else if (callback) {
            setTimeout(callback, 600);
        }
    }
    typeChar();
}

function typeNextLine() {
    if (lineIndex < lines.length) {
        typeLine(lines[lineIndex], typeNextLine);
        lineIndex++;
    } else {
        setTimeout(() => fadeOutLines(), 2000);
    }
}

function fadeOutLines() {
    lines.forEach((line, i) => {
        line.style.animation = `fadeOut 1s forwards`;
        line.style.animationDelay = `${i * 0.15}s`;
    });

    setTimeout(() => {
        initFloatingScene();
    }, 1300);
}

window.addEventListener('load', () => {
    typeNextLine();
});

function initFloatingScene() {
    const container = document.getElementById('scene-container');

    container.style.opacity = 0;
    container.style.transition = 'opacity 2s ease';

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        500
    );
    camera.position.set(0, 10, 30);
    camera.rotation.set(-0.2, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const camInfo = document.createElement('div');
    camInfo.style.position = 'fixed';
    camInfo.style.top = '10px';
    camInfo.style.left = '10px';
    camInfo.style.color = 'white';
    camInfo.style.fontFamily = 'monospace';
    camInfo.style.zIndex = '100';
    camInfo.style.backgroundColor = 'rgba(0,0,0,0.3)';
    camInfo.style.padding = '5px';
    camInfo.style.borderRadius = '5px';
    document.body.appendChild(camInfo);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(0, 50, 50);
    scene.add(dirLight);

    const mouse = { x: 0, y: 0 };
    document.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        if (mouse.y > 0.5) mouse.y = 0.5;
        if (mouse.y < -0.5) mouse.y = -0.5;
    });

    const loader = new GLTFLoader();
    let cars = [];
    let birds = [];
    let road;

    loader.load('assets/street4.glb', (gltf) => {
        scene.add(gltf.scene);

        road = gltf.scene.getObjectByName('road');

        ['car1', 'car4'].forEach(name => {
            const car = gltf.scene.getObjectByName(name);
            if (car) {
                cars.push({
                    mesh: car,
                    baseY: car.position.y,
                    amplitude: 0.02 + Math.random() * 0.02, 
                    offset: Math.random() * Math.PI*2
                });
            }
        });

        let i = 1;
        while(true){
            const bird = gltf.scene.getObjectByName('bird'+i);
            if(!bird) break;
            birds.push({
                mesh: bird,
                baseY: bird.position.y,
                amplitude: 0.5 + Math.random(),
                offset: Math.random() * Math.PI*2
            });
            i++;
        }

        container.style.opacity = 1;

        setTimeout(() => button.classList.add('show'), 1000);

    }, undefined, (err) => console.error('Error loading GLB:', err));

    function animate(time) {
        requestAnimationFrame(animate);

        camera.position.x += (mouse.x * 10 - camera.position.x) * 0.05;
        camera.position.y += (mouse.y * 5 + 10 - camera.position.y) * 0.05;

        camInfo.innerHTML = `
            Camera Position: x=${camera.position.x.toFixed(2)}, y=${camera.position.y.toFixed(2)}, z=${camera.position.z.toFixed(2)}<br>
            Camera Rotation: x=${camera.rotation.x.toFixed(2)}, y=${camera.rotation.y.toFixed(2)}, z=${camera.rotation.z.toFixed(2)}
        `;

        cars.forEach(c => {
            c.mesh.position.y = c.baseY + Math.sin(time * 0.001 + c.offset) * c.amplitude;
        });

        birds.forEach(b => {
            b.mesh.position.y = b.baseY + Math.sin(time * 0.002 + b.offset) * b.amplitude;
        });

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}
