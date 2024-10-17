import React, { useCallback, useState } from "react";
import { Hotspot, Scene, HotspotTemplate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlusCircle, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HotspotControlsProps {
  scene: Scene;
  tour: any; // Replace 'any' with your actual Tour type
  viewerInstance: Marzipano.Viewer | null;
  isAddingHotspot: boolean;
  setIsAddingHotspot: (value: boolean) => void;
  addHotspot: (sceneId: string, hotspot: Hotspot) => void;
}

const hotspotTemplateOptions: HotspotTemplate[] = [
  "expand",
  "hintspot",
  "info",
  "reveal",
  "rotate",
  "textInfo",
  "tooltip",
];

const HotspotControls: React.FC<HotspotControlsProps> = ({
  scene,
  tour,
  viewerInstance,
  isAddingHotspot,
  setIsAddingHotspot,
  addHotspot,
}) => {
  const [newHotspotType, setNewHotspotType] = useState<"info" | "link">("info");
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [newHotspotTemplate, setNewHotspotTemplate] =
    useState<HotspotTemplate>("expand");

  const handleAddHotspot = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!viewerInstance || !isAddingHotspot) return;

      const coords = viewerInstance.view().screenToCoordinates({
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      });

      const newHotspot: Hotspot = {
        id: `hotspot-${Date.now()}`,
        yaw: coords.yaw,
        pitch: coords.pitch,
        text:
          newHotspotType === "info" ? "New Info Hotspot" : "New Link Hotspot",
        type: newHotspotType,
        linkedSceneId:
          newHotspotType === "link" ? selectedSceneId ?? undefined : undefined,
        template: newHotspotTemplate,
      };

      addHotspot(scene.id, newHotspot);
      resetHotspotState();
    },
    [
      viewerInstance,
      isAddingHotspot,
      newHotspotType,
      selectedSceneId,
      newHotspotTemplate,
      scene.id,
      addHotspot,
    ]
  );

  const resetHotspotState = useCallback(() => {
    setIsAddingHotspot(false);
    setNewHotspotType("info");
    setSelectedSceneId(null);
    setNewHotspotTemplate("expand");
  }, [setIsAddingHotspot]);

  const toggleAddHotspotMode = useCallback(() => {
    if (isAddingHotspot) {
      resetHotspotState();
    } else {
      setIsAddingHotspot(true);
    }
  }, [isAddingHotspot, resetHotspotState, setIsAddingHotspot]);

  return (
    <div className="absolute top-4 left-4 bg-white p-4 rounded shadow hotspot">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleAddHotspotMode}
              className="w-full flex items-center justify-center"
              variant={isAddingHotspot ? "destructive" : "default"}
            >
              {isAddingHotspot ? (
                <>
                  <X className="w-4 h-4 mr-2" /> Cancel
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Hotspot
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isAddingHotspot
                ? "Cancel adding hotspot"
                : "Add a new hotspot to the scene"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isAddingHotspot && (
        <div className="space-y-3">
          <Select
            value={newHotspotType}
            onValueChange={(value) =>
              setNewHotspotType(value as "info" | "link")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select hotspot type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info Hotspot</SelectItem>
              <SelectItem value="link">Link Hotspot</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={newHotspotTemplate}
            onValueChange={(value) =>
              setNewHotspotTemplate(value as HotspotTemplate)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select hotspot template" />
            </SelectTrigger>
            <SelectContent>
              {hotspotTemplateOptions.map((template) => (
                <SelectItem key={template} value={template}>
                  {template.charAt(0).toUpperCase() + template.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {newHotspotType === "link" && (
            <Select
              value={selectedSceneId || ""}
              onValueChange={(value) => setSelectedSceneId(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a scene" />
              </SelectTrigger>
              <SelectContent>
                {tour?.scenes
                  .filter((s) => s.id !== scene.id)
                  .map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}

          <p className="text-sm text-gray-600">
            Click on the panorama to place the hotspot
          </p>
        </div>
      )}
    </div>
  );
};

export default HotspotControls;
