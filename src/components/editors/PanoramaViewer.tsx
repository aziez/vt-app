/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Hotspot, Scene } from "@/lib/types";
import { useTourStore } from "@/store/tourStore";
import * as Marzipano from "marzipano";
import { createHotspotElement } from "../templates/HotspotsElement";
import ExportButton from "./exporters/exportButton";
import HotspotEditor from "./hotspots/HotspotEditor";
import HotspotControls from "./hotspots/addHotspots";

interface PanoramaViewerProps {
  scene: Scene;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ scene }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<Marzipano.Viewer | null>(null);
  const sceneInstanceRef = useRef<Marzipano.Scene | null>(null);
  const hotspotContainerRef = useRef<Marzipano.HotspotContainer | null>(null);

  const { setCurrentScene, tour, addHotspot, updateHotspot, removeHotspot } =
    useTourStore();
  const [isAddingHotspot, setIsAddingHotspot] = useState(false);

  const initializeViewer = useCallback(() => {
    if (!viewerRef.current) return;

    // Create viewer
    // Reference: https://www.marzipano.net/reference/Viewer.html
    const viewerOpts = {
      controls: {
        mouseViewMode: "qtvr",
      },
    };

    viewerInstanceRef.current = new Marzipano.Viewer(
      viewerRef.current,
      viewerOpts
    );

    // Create source
    // Reference: https://www.marzipano.net/reference/Source.html
    const source = Marzipano.ImageUrlSource.fromString(scene.panoramaUrl);

    // Create geometry
    // Reference: https://www.marzipano.net/reference/geometries.html
    const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

    // Create view limiter
    // Reference: https://www.marzipano.net/reference/RectilinearViewLimiter.html
    const limiter = Marzipano.RectilinearView.limit.traditional(
      4000,
      (100 * Math.PI) / 180
    );

    // Create view
    // Reference: https://www.marzipano.net/reference/RectilinearView.html
    const view = new Marzipano.RectilinearView(
      scene.initialViewParameters,
      limiter
    );

    // Create scene
    // Reference: https://www.marzipano.net/reference/Scene.html
    sceneInstanceRef.current = viewerInstanceRef.current.createScene({
      source,
      geometry,
      view,
      pinFirstLevel: true,
    });

    // Get the hotspot container for the scene
    // Reference: https://www.marzipano.net/reference/HotspotContainer.html
    hotspotContainerRef.current = sceneInstanceRef.current.hotspotContainer();

    // Switch to the scene
    sceneInstanceRef.current.switchTo();
  }, [scene.panoramaUrl, scene.initialViewParameters]);

  const createHotspots = useCallback(() => {
    if (!hotspotContainerRef.current) return;

    // Remove existing hotspots
    // Reference: https://www.marzipano.net/reference/HotspotContainer.html#destroyHotspot
    hotspotContainerRef.current.listHotspots().forEach((hotspot: any) => {
      hotspotContainerRef.current?.destroyHotspot(hotspot);
    });

    // Create new hotspots
    scene.hotspots.forEach((hotspot) => {
      const element = createHotspotElement(hotspot);

      // Create hotspot with position
      // Reference: https://www.marzipano.net/reference/HotspotContainer.html#createHotspot
      const marzipanoHotspot = hotspotContainerRef.current?.createHotspot(
        element,
        { yaw: hotspot.yaw, pitch: hotspot.pitch }
      );

      if (marzipanoHotspot) {
        // Add click handler for link hotspots
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
      <div ref={viewerRef} className="w-full h-full" />
      <HotspotControls
        scene={scene}
        tour={tour}
        viewerInstance={viewerInstanceRef.current}
        isAddingHotspot={isAddingHotspot}
        setIsAddingHotspot={setIsAddingHotspot}
        addHotspot={addHotspot}
      />
      <ExportButton tour={tour} />
      <HotspotEditor
        scene={scene}
        onUpdateHotspot={handleUpdateHotspot}
        onRemoveHotspot={handleRemoveHotspot}
      />
    </div>
  );
};

export default PanoramaViewer;
