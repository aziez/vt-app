// HotspotManager.tsx
import React, { useEffect, useCallback } from "react";
import { Scene, Hotspot } from "@/lib/types";
import { useTourStore } from "@/store/tourStore";
import { createHotspotElement, dragElement } from "@/lib/hotspotsUtils";

interface HotspotManagerProps {
  scene: Scene;
  viewerInstance: any;
  setCurrentScene: (sceneId: string) => void;
}

const HotspotManager: React.FC<HotspotManagerProps> = ({
  scene,
  viewerInstance,
  setCurrentScene,
}) => {
  const { updateHotspot } = useTourStore();

  const handleHotspotClick = useCallback(
    (e: Event, hotspot: Hotspot) => {
      e.stopPropagation();
      if (hotspot.type === "info") {
        alert(hotspot.text);
      } else if (hotspot.type === "link" && hotspot.linkedSceneId) {
        setCurrentScene(hotspot.linkedSceneId);
      }
    },
    [setCurrentScene]
  );

  useEffect(() => {
    if (!viewerInstance) return;

    const hotspotContainer = viewerInstance?.scene()?.hotspotContainer();

    const hotspotInstances = scene?.hotspots?.map((hotspot) => {
      const element = createHotspotElement(hotspot);

      const hotspotInstance = hotspotContainer?.createHotspot(element, {
        yaw: hotspot.yaw,
        pitch: hotspot.pitch,
      });

      dragElement(
        element,
        hotspotInstance,
        hotspot,
        viewerInstance,
        (position) => {
          updateHotspot(scene.id, hotspot.id, {
            yaw: position.yaw,
            pitch: position.pitch,
          });
        }
      );

      element.addEventListener("click", (e) => handleHotspotClick(e, hotspot));

      return { element, instance: hotspotInstance };
    });

    return () => {
      // Clean up hotspots when the component unmounts or when the scene changes
      hotspotInstances.forEach(({ element, instance }) => {
        element.removeEventListener("click", (e) =>
          handleHotspotClick(e, {} as Hotspot)
        );
        hotspotContainer?.destroyHotspot(instance);
      });
    };
  }, [
    scene.hotspots,
    updateHotspot,
    setCurrentScene,
    viewerInstance,
    handleHotspotClick,
  ]);

  return null;
};

export default HotspotManager;
