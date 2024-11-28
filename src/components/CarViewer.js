import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Car({ modelPath, scale, position, rotation }) {
  const gltf = useLoader(GLTFLoader, modelPath);
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...position);
    }
  });

  return <primitive ref={meshRef} object={gltf.scene} scale={scale} rotation={rotation} />;
}

function Field({ fieldPath }) {
  const gltf = useLoader(GLTFLoader, fieldPath);
  return <primitive object={gltf.scene} scale={[15, 15, 15]} position={[0, -5.5, 0]} />;
}

function CarViewer({ carName, fieldName, color, width = '800px', height = '400px' }) {
  const [carData, setCarData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const modelPath = `/models/${carName}/${color}.gltf`;
  const fieldPath = `/models/field/${fieldName}.glb`;

  useEffect(() => {
    const loadCarData = async () => {
      try {
        const [sizeResponse, positionResponse, rotationResponse] = await Promise.all([
          fetch(`/models/${carName}/size.txt`),
          fetch(`/models/${carName}/position.txt`),
          fetch(`/models/${carName}/rotation.txt`)
        ]);

        const sizeText = await sizeResponse.text();
        const positionText = await positionResponse.text();
        const rotationText = await rotationResponse.text();

        const scale = sizeText.split(',').map(Number);
        const position = positionText.split(',').map(Number);
        const rotation = rotationText.split(',').map(number => number * (Math.PI / 180));

        setCarData({ scale, position, rotation });
      } catch (error) {
        console.error('Error loading car data:', error);
      }
    };

    loadCarData();
  }, [carName]);

  if (!carData) {
    return <div>Loading car data...</div>;
  }

  console.log(carData)

  return (
    <div style={{ width, height, position: 'relative' }}>
      <Canvas
        frameloop="demand"
        camera={{ position: [300, 60, 35], fov: 50 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, 5, -10]} intensity={0.1} />
        <pointLight position={[10, 5, -10]} intensity={0.1} />
        <pointLight position={[-10, 5, 10]} intensity={0.1} />
        <pointLight position={[10, 5, 10]} intensity={0.1} />

        <Suspense fallback={null}>
          <Center>
            <Car 
              modelPath={modelPath} 
              scale={carData.scale}
              position={carData.position}
              rotation={carData.rotation}
            />
          </Center>
          <Field fieldPath={fieldPath} />
        </Suspense>
        <OrbitControls
          enableZoom={true}
          zoomSpeed={0.8}
          minDistance={30}
          maxDistance={55}
          enablePan={false}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
        <Environment preset="city" intensity={1} />
      </Canvas>
      <LoadingScreen isLoading={isLoading} setIsLoading={setIsLoading} />
    </div>
  );
}

function LoadingScreen({ isLoading, setIsLoading }) {
  useEffect(() => {
    // 모든 3D 모델이 로드되면 isLoading을 false로 설정
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // 약간의 지연을 줍니다.

    return () => clearTimeout(timer);
  }, [setIsLoading]);

  if (!isLoading) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: 'white'
    }}>
      Loading...
    </div>
  );
}

export default CarViewer;
