import '@google/model-viewer/dist/model-viewer.min.js';
import { useEffect, useRef } from 'react';

export default function Model3D({ onClick, src, className, cameraOrbit, autoRotate = false }) {
  const modelRef = useRef();

  useEffect(() => {
    if (modelRef.current) {
      // Setear la velocidad de rotación en segundos
      modelRef.current.rotationPerSecond = 100; // más rápido que el default (1)
    }
  }, []);

  return (
    <model-viewer
      ref={modelRef}
      src={src}
      alt="Modelo 3D"
      auto-rotate={autoRotate}
      auto-rotate-delay="0"
      camera-controls
      interaction-prompt="none"
      camera-orbit={cameraOrbit}
      className={className}
      onClick={onClick}
    />
  );
}
