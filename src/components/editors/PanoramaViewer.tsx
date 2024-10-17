import React, { useEffect, useRef, useState, useCallback } from "react";
import { Hotspot, Scene, HotspotTemplate } from "@/lib/types";
import { useTourStore } from "@/store/tourStore";
import * as Marzipano from "marzipano";
import { createHotspotElement } from "../templates/HotspotsElement";
import ExportButton from "./exporters/exportButton";
import { Button } from "@/components/ui/button";
import HotspotEditor from "./hotspots/HotspotEditor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { PlusCircle, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PanoramaViewerProps {
  scene: Scene;
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

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ scene }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<Marzipano.Viewer | null>(null);
  const sceneInstanceRef = useRef<Marzipano.Scene | null>(null);
  const hotspotContainerRef = useRef<Marzipano.HotspotContainer | null>(null);

  const { setCurrentScene, tour, addHotspot, updateHotspot, removeHotspot } =
    useTourStore();
  const [isAddingHotspot, setIsAddingHotspot] = useState(false);
  const [newHotspotType, setNewHotspotType] = useState<"info" | "link">("info");
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [newHotspotTemplate, setNewHotspotTemplate] =
    useState<HotspotTemplate>("expand");

  const initializeViewer = useCallback(() => {
    if (!viewerRef.current) return;

    const viewerOpts = {
      controls: { mouseViewMode: "drag" },
    };

    viewerInstanceRef.current = new Marzipano.Viewer(
      viewerRef.current,
      viewerOpts
    );

    const source = Marzipano.ImageUrlSource.fromString(scene.panoramaUrl);
    const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
    const limiter = Marzipano.RectilinearView.limit.traditional(
      4000,
      (100 * Math.PI) / 180
    );
    const view = new Marzipano.RectilinearView(
      scene.initialViewParameters,
      limiter
    );

    sceneInstanceRef.current = viewerInstanceRef.current.createScene({
      source,
      geometry,
      view,
      pinFirstLevel: true,
    });

    hotspotContainerRef.current = sceneInstanceRef.current.hotspotContainer();

    sceneInstanceRef.current.switchTo({
      transitionDuration: 1000,
    });
  }, [scene.panoramaUrl, scene.initialViewParameters]);

  const createHotspots = useCallback(() => {
    if (!viewerInstanceRef.current) return;
    //
    hotspotContainerRef.current.listHotspots().forEach((hotspot: Hotspot) => {
      hotspotContainerRef.current?.destroyHotspot(hotspot);
    });

    scene.hotspots.forEach((hotspot) => {
      const element = createHotspotElement(hotspot);

      const marzipanoHotspot = hotspotContainerRef.current?.createHotspot(
        element,
        {
          yaw: hotspot.yaw,
          pitch: hotspot.pitch,
        }
      );

      if (marzipanoHotspot) {
        marzipanoHotspot.domElement().addEventListener("click", () => {
          if (hotspot.type === "link" && hotspot.linkedSceneId) {
            setCurrentScene(hotspot.linkedSceneId);
          }
        });
      }
    });
  }, [scene.hotspots, setCurrentScene]);

  useEffect(() => {
    initializeViewer();
    return () => {
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.destroy();
      }
    };
  }, [initializeViewer]);

  useEffect(() => {
    createHotspots();
  }, [createHotspots]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!viewerInstanceRef.current || !isAddingHotspot) return;

      const coords = viewerInstanceRef.current.view().screenToCoordinates({
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
      setIsAddingHotspot(false);
      setNewHotspotType("info");
      setSelectedSceneId(null);
    },
    [
      isAddingHotspot,
      newHotspotType,
      selectedSceneId,
      newHotspotTemplate,
      addHotspot,
      scene.id,
    ]
  );

  const handleUpdateHotspot = useCallback(
    (hotspotId: string, updates: Partial<Hotspot>) => {
      updateHotspot(scene.id, hotspotId, updates);
    },
    [updateHotspot, scene.id]
  );

  const handleRemoveHotspot = useCallback(
    (hotspotId: string) => {
      removeHotspot(scene.id, hotspotId);
    },
    [removeHotspot, scene.id]
  );

  return (
    <div className="relative w-full h-full">
      <div ref={viewerRef} className="w-full h-full" onClick={handleClick} />
      <div className="absolute top-4 left-4 bg-white p-4 rounded shadow hotspot">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsAddingHotspot(!isAddingHotspot)}
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
      <ExportButton tour={tour} />
      <HotspotEditor
        scene={scene}
        onUpdateHotspot={handleUpdateHotspot}
        onRemoveHotspot={handleRemoveHotspot}
      />{" "}
    </div>
  );
};

export default PanoramaViewer;
