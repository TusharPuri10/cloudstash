import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const Cloud: React.FC = () => {
  const refBody = useRef<HTMLDivElement>(null);
  const [renderer, setRenderer] = useState<any>(null);
  const [_camera, setCamera] = useState<any>(null);
  const [target] = useState(new THREE.Vector3(-0.5, 1.2, 0));
  const [initialCameraPosition] = useState(
    new THREE.Vector3(
      20 * Math.sin(0.2 * Math.PI),
      10,
      20 * Math.cos(0.2 * Math.PI)
    )
  );
  const [scene] = useState(new THREE.Scene());
  const [_controls, setControls] = useState<any>(null);
  

  const easeOutCirc = (x: number) => {
    return Math.sqrt(x - Math.pow(x-1,3));
  }


  useEffect(() => {

    const {current: container} = refBody;
    if (container && !renderer) {

      const newRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      newRenderer.setPixelRatio(window.devicePixelRatio);
      newRenderer.setSize(600,400 );
      newRenderer.outputColorSpace = THREE.SRGBColorSpace;
      newRenderer.setClearColor(0xAEDEFC);
      container.appendChild(newRenderer.domElement);
      setRenderer(newRenderer);

      const camera = new THREE.PerspectiveCamera(15, 600/400);
      camera.position.set(2.5, 0,3);
      camera.lookAt(target);
      setCamera(camera);

      // Adjust ambient light intensity to make it brighter
      const ambientLight = new THREE.AmbientLight(0xffffff, 2);
      ambientLight.position.set(0, 0, -2);

      // Set directional light position outside of the animation loop to keep it fixed
      const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
      directionalLight.position.set(0, 0, 4);
      // Enable shadows for the directional light
      directionalLight.castShadow = true;

      scene.add(directionalLight);
      scene.add(ambientLight);

      const controls = new OrbitControls(camera, newRenderer.domElement);
      controls.autoRotate = true;
      controls.target = target;
      controls.target.set(0, 0, 0);
      // Disable zoom functionality
      controls.enableZoom = false;
      controls.addEventListener('change', () => {
        // Update the camera and lighting positions to match the controls
        camera.position.copy(controls.object.position);
        directionalLight.position.copy(controls.object.position);
        ambientLight.position.copy(controls.object.position);
      });
      setControls(controls);

      const loader = new GLTFLoader();
      loader.load('/cloud.gltf', (gltf) => {
        const cloud = gltf.scene;
        cloud.position.set(0, 0, 0);
        scene.add(cloud);
        animate();
      });


      let req: any = null;
      let frame = 0;

      const animate = () => {
        req = requestAnimationFrame(animate);
        frame = frame <= 100 ? frame + 1 : frame;
        

        if(frame <= 100){
            const  p = initialCameraPosition;
            const rotSpeed = easeOutCirc(frame / 100)*Math.PI*20;

            // Animate light
            const lightRotSpeed = rotSpeed; // You can adjust this value
            directionalLight.position.x = p.x * Math.cos(lightRotSpeed);
            directionalLight.position.z = p.z * Math.sin(lightRotSpeed);
            ambientLight.position.x = p.x * Math.cos(lightRotSpeed);
            ambientLight.position.z = p.z * Math.sin(lightRotSpeed);
            camera.lookAt(target);
        }
        else{
          // Fix the lighting position
            controls.update();
        }
        newRenderer.render(scene, camera);
      };

      const handleWindowResize = () => {
        const maxWidth = 600; // Minimum width
        const newWidth = Math.min(window.innerWidth, maxWidth);
        const newHeight = 400;
        camera.aspect = (newWidth) / newHeight;
        camera.updateProjectionMatrix();
        newRenderer.setSize(newWidth, newHeight);
      };

      handleWindowResize();
      window.addEventListener('resize', handleWindowResize);

    
    return () => {
        console.log('unmount');
        cancelAnimationFrame(req);
        newRenderer.dispose();
        // window.removeEventListener('resize', handleWindowResize);
    };
    }
  }, []);

  return (
    <div ref={refBody} style={{ width: '100%', height: '100vh' }} />
  );
};

export default Cloud;
