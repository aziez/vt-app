import React from "react";
import { useTourStore } from "@/store/tourStore";
import { useDropzone } from "react-dropzone";

const SceneManager: React.FC = () => {
  const { tour, addScene, removeScene, setCurrentScene, currentSceneId } =
    useTourStore();

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const binaryStr = reader.result as string;
          addScene({
            id: `scene-${Date.now()}`,
            name: file.name,
            panoramaUrl: binaryStr,
            hotspots: [],
            initialViewParameters: { yaw: 0, pitch: 0, fov: 90 },
          });
        };
        reader.readAsDataURL(file);
      });
    },
    [addScene]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Scenes</h2>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-4 mb-4 ${
          isDragActive ? "border-blue-500" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some panorama images here, or click to select files</p>
      </div>
      <ul>
        {tour?.scenes.map((scene) => (
          <li
            key={scene.id}
            className={`mb-2 p-2 ${
              scene.id === currentSceneId ? "bg-blue-100" : ""
            }`}
          >
            <span>{scene.name}</span>
            <button
              onClick={() => setCurrentScene(scene.id)}
              className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => removeScene(scene.id)}
              className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SceneManager;
