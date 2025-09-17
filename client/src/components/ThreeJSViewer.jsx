import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function Controls({ enableRotate = true }) {
  const controls = useRef();
  
  useFrame(() => {
    if (controls.current && enableRotate) {
      controls.current.autoRotate = true;
      controls.current.autoRotateSpeed = 0.5;
    }
  });

  return (
    <OrbitControls
      ref={controls}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      autoRotate={enableRotate}
      autoRotateSpeed={0.5}
    />
  );
}

const ThreeJSViewer = ({ modelUrl, carDetails }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleModelLoaded = () => {
    setIsLoading(false);
  };

  const handleModelError = (err) => {
    setError('Failed to load 3D model');
    setIsLoading(false);
    console.error('3D Model loading error:', err);
  };

  return (
    <div className="relative w-full h-96 md:h-[500px] bg-gray-900 rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
          <div className="text-white">Loading 3D model...</div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
          <div className="text-white text-center">
            <p>{error}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      )}
      
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          
          {modelUrl && (
            <Model 
              url={modelUrl} 
              onLoad={handleModelLoaded}
              onError={handleModelError}
            />
          )}
          
          <Environment preset="city" />
          <Controls enableRotate={!isLoading} />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded text-sm">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

export default ThreeJSViewer;