// hooks/usePanoramaViewer.ts
import { useEffect, useRef } from "react";
import { Scene } from "@/lib/types";
import Marzipano from "marzipano";
import { useTourStore } from "@/store/tourStore";

export const usePanoramaViewer = (scene: Scene) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const { setCurrentScene } = useTourStore();

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewerOpts = {
      controls: {
        mouseViewMode: "drag",
      },
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
      {
        yaw: scene.initialViewParameters.yaw,
        pitch: scene.initialViewParameters.pitch,
        fov: scene.initialViewParameters.fov,
      },
      limiter
    );

    const sceneInstance = viewerInstanceRef.current.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true,
    });

    sceneInstance.switchTo();

    return () => {
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.destroy();
      }
    };
  }, [scene]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!viewerInstanceRef.current) return;

    const coords = viewerInstanceRef.current.view().screenToCoordinates({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });

    // ... (rest of the handleClick logic)
  };

  return { viewerRef, handleClick };
};
