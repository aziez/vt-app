import React, { useEffect } from "react";
import { useTourStore } from "@/store/tourStore";
import SceneManager from "./SceneManager";
import PanoramaViewer from "./PanoramaViewer";
import HotspotEditor from "./HotspotEditor";
import TourExporter from "./TourExporter";

interface TourEditorProps {
  tourId?: string;
}

const TourEditor: React.FC<TourEditorProps> = ({ tourId }) => {
  const { tour, setTour, currentSceneId, setCurrentScene } = useTourStore();

  useEffect(() => {
    if (tourId) {
      // In a real application, you would fetch the tour data from an API
      setTour({
        id: tourId,
        title: "Sample Tour",
        scenes: [],
      });
    } else {
      setTour({
        id: "new-tour",
        title: "New Tour",
        scenes: [],
      });
    }
  }, [tourId, setTour]);

  if (!tour) return <div>Loading...</div>;

  const currentScene = tour.scenes.find((scene) => scene.id === currentSceneId);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <SceneManager />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          {currentScene && <PanoramaViewer scene={currentScene} />}
        </div>
        <div className="h-1/3 bg-gray-200 p-4 overflow-y-auto">
          {currentScene && <HotspotEditor scene={currentScene} />}
        </div>
      </div>
      <div className="w-1/4 bg-gray-100 p-4">
        <TourExporter />
      </div>
    </div>
  );
};

export default TourEditor;
