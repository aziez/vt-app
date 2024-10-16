/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useTourStore } from "@/store/tourStore";
import { Loader2 } from "lucide-react";
import SceneManager from "@/components/editors/SceneManager";
import PanoramaViewer from "@/components/editors/PanoramaViewer";
import TourDialog from "@/components/editors/createModal";
import HotspotEditor from "@/components/editors/hotspots/HotspotEditor";

interface TourEditorProps {
  tourId?: string;
}

const TourEditor: React.FC<TourEditorProps> = ({ tourId }) => {
  const { tour, setTour, currentSceneId } = useTourStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(true); // Use Dialog state
  const [tourTitle, setTourTitle] = useState("");
  const [tourTemplate, setTourTemplate] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchTour = async () => {
      setIsLoading(true);
      let tourData;

      if (tourId) {
        const storedTour = localStorage.getItem(`tour_${tourId}`);
        if (storedTour) {
          tourData = JSON.parse(storedTour);
        } else {
          tourData = {
            id: tourId,
            title: "",
            scenes: [],
            template: {},
          };
          localStorage.setItem(`tour_${tourId}`, JSON.stringify(tourData));
        }
      } else {
        tourData = {
          id: "new-tour",
          title: "",
          scenes: [],
        };
      }

      setTour(tourData);
      setIsLoading(false);

      // Open dialog if required fields are empty
      if (!tourData.title || tourData.scenes.length === 0) {
        setIsDialogOpen(true);
      }
    };

    fetchTour();
  }, [tourId, setTour]);

  const handleDialogSubmit = () => {
    if (!tourTitle) {
      alert("Tour title is required!");
      return;
    }

    const updatedTour: any = {
      ...tour,
      title: tourTitle,
      template: tourTemplate,
    };
    setTour(updatedTour);
    localStorage.setItem(`tour_${tourId}`, JSON.stringify(updatedTour));
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const currentScene = tour
    ? tour.scenes.find((scene) => scene.id === currentSceneId)
    : null;

  return (
    <div className="flex h-screen">
      <SceneManager isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          {currentScene && <PanoramaViewer scene={currentScene} />}
        </div>
      </div>
      <TourDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        tourTitle={tourTitle}
        setTourTitle={setTourTitle}
        tourTemplate={tourTemplate}
        setTourTemplate={setTourTemplate}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
};

export default TourEditor;
