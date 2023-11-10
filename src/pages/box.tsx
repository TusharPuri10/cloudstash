import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    // Set up renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

    // Create a simple box
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const box = new THREE.Mesh(geometry, material);
    box.position.x = -1; // Position the box to the left
    scene.add(box);

    // Create edges geometry for the box
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Set border color
    const border = new THREE.LineSegments(edges, lineMaterial);
    box.add(border);

    // Create a second simple box
    const material2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const geometry2 = new THREE.BoxGeometry(1, 1, 1);
    const box2 = new THREE.Mesh(geometry2, material2);
    box2.position.x = 1; // Position the second box to the right
    scene.add(box2);

    // Create edges geometry for the second box
    const edges2 = new THREE.EdgesGeometry(geometry2);
    const lineMaterial2 = new THREE.LineBasicMaterial({ color: 0x000000 }); // Set border color
    const border2 = new THREE.LineSegments(edges2, lineMaterial2);
    box2.add(border2);

    // Position the camera
    camera.position.x = 0;
    camera.position.y = 1;
    camera.position.z = 3;


    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the box
    //   box.rotation.x += 0.01;
      box.rotation.y += 0.01;
      box2.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div ref={sceneRef} style={{ width: '100%', height: '100vh' }} />;
};

export default ThreeScene;
