import '@google/model-viewer';

export default function Modelo3D({onClick, src, className, cameraOrbit }) {
  return (
    <model-viewer
      src={src}
      alt="Modelo 3D"
      auto-rotate
      className={className}
      camera-controls
      onClick={onClick}
      camera-orbit={cameraOrbit}
      interaction-prompt="none"
    ></model-viewer>
  );
}
