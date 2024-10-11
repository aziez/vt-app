import React, { useEffect, useRef, useState } from "react";
import { Hotspot, Scene } from "@/lib/types";
import { useTourStore } from "@/store/tourStore";
import Marzipano from "marzipano";

interface PanoramaViewerProps {
  scene: Scene;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ scene }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const { updateHotspot, setCurrentScene, tour } = useTourStore();
  const [isAddingHotspot, setIsAddingHotspot] = useState(false);
  const [newHotspotType, setNewHotspotType] = useState<"info" | "link">("info");
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);

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

  useEffect(() => {
    if (!viewerInstanceRef.current) return;

    // Clear existing hotspots
    // viewerInstanceRef.current.scene().hotspotContainer().destroyAll();

    scene.hotspots.forEach((hotspot) => {
      const element = document.createElement("div");
      element.className = `hotspot ${hotspot.type}-hotspot`;
      element.style.backgroundColor =
        hotspot.type === "info"
          ? "rgba(0, 0, 255, 0.5)"
          : "rgba(255, 0, 0, 0.5)";
      element.style.color = "white";
      element.style.padding = "10px";
      element.style.borderRadius = "5px";
      element.textContent = hotspot.text;

      const hotspotInstance = viewerInstanceRef.current
        .scene()
        .hotspotContainer()
        .createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });

      // Make hotspot draggable
      dragElement(element, hotspotInstance, hotspot);

      element.addEventListener("click", (e) => {
        e.stopPropagation();
        if (hotspot.type === "info") {
          alert(hotspot.text); // Show info popup
        } else if (hotspot.type === "link" && hotspot.linkedSceneId) {
          setCurrentScene(hotspot.linkedSceneId);
        }
      });
    });
  }, [scene.hotspots, updateHotspot, setCurrentScene]);

  const dragElement = (
    element: HTMLElement,
    hotspotInstance: any,
    hotspot: Hotspot
  ) => {
    let isDragging = false;
    let previousX = 0;
    let previousY = 0;

    const dragMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isDragging = true;
      previousX = e.clientX;
      previousY = e.clientY;
      document.addEventListener("mousemove", elementDrag);
      document.addEventListener("mouseup", closeDragElement);
    };

    const elementDrag = (e: MouseEvent) => {
      e.preventDefault();
      if (!isDragging) return;

      const deltaX = previousX - e.clientX;
      const deltaY = previousY - e.clientY;
      previousX = e.clientX;
      previousY = e.clientY;

      const view = viewerInstanceRef.current.scene().view();
      const fov = view.fov();
      const hfov =
        (fov * viewerInstanceRef.current.stage().width()) /
        viewerInstanceRef.current.stage().height();

      const position = hotspotInstance.position();
      position.yaw -=
        (deltaX * hfov) / viewerInstanceRef.current.stage().width();
      position.pitch +=
        (deltaY * fov) / viewerInstanceRef.current.stage().height();

      hotspotInstance.setPosition(position);
    };

    const closeDragElement = () => {
      isDragging = false;
      document.removeEventListener("mousemove", elementDrag);
      document.removeEventListener("mouseup", closeDragElement);

      const position = hotspotInstance.position();
      updateHotspot(scene.id, hotspot.id, {
        yaw: position.yaw,
        pitch: position.pitch,
      });
    };

    // element.addEventListener("mousedown", dragMouseDown);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!viewerInstanceRef.current || !isAddingHotspot) return;

    const coords = viewerInstanceRef.current.view().screenToCoordinates({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });

    const newHotspot: Hotspot = {
      id: `hotspot-${Date.now()}`,
      yaw: coords.yaw,
      pitch: coords.pitch,
      text: newHotspotType === "info" ? "New Info Hotspot" : "New Link Hotspot",
      type: newHotspotType,
      linkedSceneId: newHotspotType === "link" ? selectedSceneId : undefined,
    };

    useTourStore.getState().addHotspot(scene.id, newHotspot);
    setIsAddingHotspot(false);
    setNewHotspotType("info");
    setSelectedSceneId(null);
  };

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
      </div>
    </div>
  );
};

export default PanoramaViewer;
