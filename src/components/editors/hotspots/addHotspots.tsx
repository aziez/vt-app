/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import { Hotspot, Scene, HotspotTemplate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlusCircle, X, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Marzipano from "marzipano";

// Extended Hotspot type to include new fields
interface ExtendedHotspot extends Hotspot {
  title?: string;
  description?: string;
  imageUrl?: string;
  embedUrl?: string;
}

interface HotspotControlsProps {
  scene: Scene;
  tour: any;
  viewerInstance: Marzipano.Viewer | null;
  isAddingHotspot: boolean;
  setIsAddingHotspot: (value: boolean) => void;
  addHotspot: (sceneId: string, hotspot: ExtendedHotspot) => void;
}

const hotspotTemplateOptions: HotspotTemplate[] = [
  "expand",
  "hintspot",
  "info",
  "reveal",
  "rotate",
  "textInfo",
  "tooltip",
  "embed", // Added new template type
];

const HotspotControls: React.FC<HotspotControlsProps> = ({
  scene,
  tour,
  viewerInstance,
  isAddingHotspot,
  setIsAddingHotspot,
  addHotspot,
}) => {
  const [newHotspotType, setNewHotspotType] = useState<
    "info" | "link" | "embed"
  >("info");
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [newHotspotTemplate, setNewHotspotTemplate] =
    useState<HotspotTemplate>("expand");

  // New state for additional fields
  const [hotspotTitle, setHotspotTitle] = useState("");
  const [hotspotText, setHotspotText] = useState("");
  const [hotspotDescription, setHotspotDescription] = useState("");
  const [hotspotImage, setHotspotImage] = useState<File | null>(null);
  const [embedUrl, setEmbedUrl] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const resetHotspotState = useCallback(() => {
    setIsAddingHotspot(false);
    setNewHotspotType("info");
    setSelectedSceneId(null);
    setNewHotspotTemplate("expand");
    setHotspotTitle("");
    setHotspotText("");
    setHotspotDescription("");
    setHotspotImage(null);
    setEmbedUrl("");
    setPreviewImageUrl(null);
  }, [setIsAddingHotspot]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setHotspotImage(file);
      // Create a preview URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      setPreviewImageUrl(imageUrl);
    }
  };

  const handleViewerClick = useCallback(
    (event: MouseEvent) => {
      if (!viewerInstance || !isAddingHotspot) return;

      const viewerElement = viewerInstance.domElement();
      const rect = viewerElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const coords = viewerInstance.view().screenToCoordinates({
        x,
        y,
      });

      const newHotspot: ExtendedHotspot = {
        id: `hotspot-${Date.now()}`,
        yaw: coords.yaw,
        pitch: coords.pitch,
        text: hotspotText || "New Hotspot",
        type: newHotspotType,
        linkedSceneId:
          newHotspotType === "link" ? (selectedSceneId as string) : undefined,
        template: newHotspotTemplate,
        title: hotspotTitle,
        description: hotspotDescription,
        imageUrl: previewImageUrl || undefined,
        embedUrl: newHotspotType === "embed" ? embedUrl : undefined,
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
      hotspotTitle,
      hotspotText,
      hotspotDescription,
      previewImageUrl,
      embedUrl,
      addHotspot,
      scene.id,
      resetHotspotState,
    ]
  );

  const toggleAddHotspotMode = useCallback(() => {
    if (isAddingHotspot) {
      resetHotspotState();
    } else {
      setIsAddingHotspot(true);
    }
  }, [isAddingHotspot, resetHotspotState, setIsAddingHotspot]);

  React.useEffect(() => {
    const viewerElement = viewerInstance?.domElement();
    if (viewerElement && isAddingHotspot) {
      viewerElement.addEventListener("click", handleViewerClick);
      return () => {
        viewerElement.removeEventListener("click", handleViewerClick);
      };
    }
  }, [viewerInstance, isAddingHotspot, handleViewerClick]);

  return (
    <div className="absolute top-4 left-4 bg-white p-4 rounded shadow hotspot max-w-md">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleAddHotspotMode}
              className="w-full flex items-center justify-center mb-4"
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
              setNewHotspotType(value as "info" | "link" | "embed")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select hotspot type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info Hotspot</SelectItem>
              <SelectItem value="link">Link Hotspot</SelectItem>
              <SelectItem value="embed">Embed Hotspot</SelectItem>
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

          <Input
            placeholder="Hotspot Title"
            value={hotspotTitle}
            onChange={(e) => setHotspotTitle(e.target.value)}
          />

          <Input
            placeholder="Hotspot Text"
            value={hotspotText}
            onChange={(e) => setHotspotText(e.target.value)}
          />

          <Textarea
            placeholder="Hotspot Description"
            value={hotspotDescription}
            onChange={(e) => setHotspotDescription(e.target.value)}
            rows={3}
          />

          {newHotspotType === "info" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                {previewImageUrl && (
                  <img
                    src={previewImageUrl}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
              </div>
            </div>
          )}

          {newHotspotType === "embed" && (
            <Input
              placeholder="Embed URL (e.g., website URL)"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
            />
          )}

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
                  .filter((s: Scene) => s.id !== scene.id)
                  .map((s: Scene) => (
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
