import { useEffect, useRef } from "react";
import * as THREE from "three";


const PaperCupLifecycle = () => {
	const mountRef = useRef(null);

	useEffect(() => {
		// Scene setup
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		camera.position.set(0, 2, 10);

		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		mountRef.current.appendChild(renderer.domElement);

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(5, 10, 7.5);
		scene.add(directionalLight);

		// Tree model
		const treeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 32);
		const treeMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Brown color
		const tree = new THREE.Mesh(treeGeometry, treeMaterial);
		tree.position.set(-3, 2.5, 0);
		scene.add(tree);

		// Paper cup model
		const cupGeometry = new THREE.ConeGeometry(0.5, 1, 32);
		const cupMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }); // White color
		const cup = new THREE.Mesh(cupGeometry, cupMaterial);
		cup.position.set(3, 0.5, 0);
		scene.add(cup);

		// Controls
		

		// Animation variables
		let phase = 0;

		// Animation loop
		const animate = () => {
			requestAnimationFrame(animate);

			// Lifecycle animations
			if (phase === 0) {
				tree.rotation.y += 0.01; // Tree spins
			} else if (phase === 1) {
				cup.position.y += 0.02; // Cup moves up
				if (cup.position.y > 3) phase = 2;
			} else if (phase === 2) {
				cup.position.y -= 0.02; // Cup moves down
				if (cup.position.y < 0.5) phase = 3;
			} else if (phase === 3) {
				cup.rotation.x += 0.05; // Cup spins
			}

			renderer.render(scene, camera);
		};

		// Resize handling
		const handleResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		};

		window.addEventListener("resize", handleResize);

		// Start animation
		animate();

		// Cleanup on component unmount
		return () => {
			window.removeEventListener("resize", handleResize);
			mountRef.current.removeChild(renderer.domElement);
			renderer.dispose();
		};
	}, []);

	return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default PaperCupLifecycle;
