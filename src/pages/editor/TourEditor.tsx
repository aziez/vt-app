import React, { useEffect, useState } from "react";
import { useTourStore } from "@/store/tourStore";
import { Loader2, Plus, Settings, Eye, Link, Image } from "lucide-react";
import SceneManager from "@/components/editors/SceneManager";
import PanoramaViewer from "@/components/editors/PanoramaViewer";
import HotspotEditor from "@/components/editors/HotspotEditor";
import TourExporter from "@/components/editors/TourExporter";

interface TourEditorProps {
  tourId?: string;
}

const TourEditor: React.FC<TourEditorProps> = ({ tourId }) => {
  const { tour, setTour, currentSceneId, setCurrentScene } = useTourStore();
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState<"view" | "hotspot" | "info">("view");

  useEffect(() => {
    const fetchTour = async () => {
      setIsLoading(true);
      let tourData;

      if (tourId) {
        // Check if tour data is available in local storage
        const storedTour = localStorage.getItem(`tour_${tourId}`);
        if (storedTour) {
          tourData = JSON.parse(storedTour);
        } else {
          tourData = {
            id: tourId,
            title: "Sample Tour",
            scenes: [],
            template: {}, // Add template data if needed
          };
          // Save fetched tour to local storage
          localStorage.setItem(`tour_${tourId}`, JSON.stringify(tourData));
        }
      } else {
        tourData = {
          id: "new-tour",
          title: "New Tour",
          scenes: [],
        };
      }

      setTour(tourData);
      setIsLoading(false);
    };

    fetchTour();
  }, [tourId, setTour]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">No tour data available.</p>
      </div>
    );
  }

  const currentScene = tour.scenes.find((scene) => scene.id === currentSceneId);

  return (
    <div className="flex h-screen">
      <SceneManager />
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
