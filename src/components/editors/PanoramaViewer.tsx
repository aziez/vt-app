import React, { useEffect, useRef, useState, useCallback } from "react";
import { Hotspot, Scene, HotspotTemplate } from "@/lib/types";
import { useTourStore } from "@/store/tourStore";
import * as Marzipano from "marzipano";
import { createHotspotElement } from "../templates/HotspotsElement";
import ExportButton from "./exporters/exportButton";

interface PanoramaViewerProps {
  scene: Scene;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ scene }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<Marzipano.Viewer | null>(null);
  const { setCurrentScene, tour, addHotspot } = useTourStore();
  const [isAddingHotspot, setIsAddingHotspot] = useState(false);
  const [newHotspotType, setNewHotspotType] = useState<"info" | "link">("info");
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [newHotspotTemplate] = useState<HotspotTemplate>("default");

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

    const sceneInstance = viewerInstanceRef.current.createScene({
      source,
      geometry,
      view,
      pinFirstLevel: true,
    });

    sceneInstance.switchTo();
  }, [scene.panoramaUrl, scene.initialViewParameters]);

  const createHotspots = useCallback(() => {
    if (!viewerInstanceRef.current) return;

    scene.hotspots.forEach((hotspot) => {
      const element = createHotspotElement(hotspot);

      viewerInstanceRef
        .current!.scene()
        .hotspotContainer()
        .createHotspot(element, {
          yaw: hotspot.yaw,
          pitch: hotspot.pitch,
        });

      element.addEventListener("click", (e) => {
        e.stopPropagation();
        if (hotspot.type === "info") {
          alert(hotspot.text);
        } else if (hotspot.type === "link" && hotspot.linkedSceneId) {
          setCurrentScene(hotspot.linkedSceneId);
        }
      });
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

  return (
    <div className="relative w-full h-full">
      <div ref={viewerRef} className="w-full h-full" onClick={handleClick} />
      <div className="absolute top-4 left-4 bg-white p-4 rounded shadow">
        <button
          onClick={() => setIsAddingHotspot(!isAddingHotspot)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          {isAddingHotspot ? "Cancel" : "Add Hotspot"}
        </button>
        {isAddingHotspot && (
          <>
            <select
              value={newHotspotType}
              onChange={(e) =>
                setNewHotspotType(e.target.value as "info" | "link")
              }
              className="mr-2"
            >
              <option value="info">Info Hotspot</option>
              <option value="link">Link Hotspot</option>
            </select>
            {newHotspotType === "link" && (
              <select
                value={selectedSceneId || ""}
                onChange={(e) => setSelectedSceneId(e.target.value)}
                className="mr-2"
              >
                <option value="">Select a scene</option>
                {tour?.scenes
                  .filter((s) => s.id !== scene.id)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            )}
          </>
        )}
        <ExportButton tour={tour} />
      </div>
    </div>
  );
};

export default PanoramaViewer;
