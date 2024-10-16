import React, { useState, useEffect } from "react";
import { HotspotTemplate, Tour, Hotspot } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlusCircle, X } from "lucide-react";

interface AddHotspotProps {
  isAddingHotspot: boolean;
  setIsAddingHotspot: (value: boolean) => void;
  setNewHotspotConfig: (config: Partial<Hotspot>) => void;
  tour: Tour | null;
  currentSceneId: string;
  onHotspotTemplateChange: (hotspotId: string, newTemplate: string) => void;
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
const AddHotspot: React.FC<AddHotspotProps> = ({
  isAddingHotspot,
  setIsAddingHotspot,
  setNewHotspotConfig,
  tour,
  currentSceneId,
}) => {
  const [newHotspotType, setNewHotspotType] = useState<"info" | "link">("info");
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [newHotspotTemplate, setNewHotspotTemplate] =
    useState<HotspotTemplate>("expand");

  useEffect(() => {
    setNewHotspotConfig({
      type: newHotspotType,
      text: newHotspotType === "info" ? "New Info Hotspot" : "New Link Hotspot",
      linkedSceneId:
        newHotspotType === "link" && selectedSceneId !== null
          ? selectedSceneId
          : undefined,
      template: newHotspotTemplate,
    });
  }, [
    newHotspotType,
    selectedSceneId,
    newHotspotTemplate,
    setNewHotspotConfig,
  ]);

  const handleToggleAddHotspot = () => {
    setIsAddingHotspot(!isAddingHotspot);
    if (!isAddingHotspot) {
      setNewHotspotType("info");
      setSelectedSceneId(null);
      setNewHotspotTemplate("expand");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleToggleAddHotspot}
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
                  .filter((s) => s.id !== currentSceneId)
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

export default AddHotspot;
