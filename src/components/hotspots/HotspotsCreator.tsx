// HotspotCreator.tsx
import React from "react";
import { Scene } from "@/lib/types";
import { useTourStore } from "@/store/tourStore";

interface HotspotCreatorProps {
  isAddingHotspot: boolean;
  setIsAddingHotspot: (value: boolean) => void;
  newHotspotType: "info" | "link";
  setNewHotspotType: (value: "info" | "link") => void;
  selectedSceneId: string | null;
  setSelectedSceneId: (value: string | null) => void;
  scene: Scene;
}

const HotspotCreator: React.FC<HotspotCreatorProps> = ({
  isAddingHotspot,
  setIsAddingHotspot,
  newHotspotType,
  setNewHotspotType,
  selectedSceneId,
  setSelectedSceneId,
  scene,
}) => {
  const { tour } = useTourStore();

  return (
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
  );
};

export default HotspotCreator;
