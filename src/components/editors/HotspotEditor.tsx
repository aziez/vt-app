import React from "react";
import { Scene, Hotspot } from "@/lib/types";
import { useTourStore } from "@/store/tourStore";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface HotspotEditorProps {
  scene: Scene;
}

const HotspotEditor: React.FC<HotspotEditorProps> = ({ scene }) => {
  const { updateHotspot, removeHotspot } = useTourStore();

  const handleHotspotUpdate = (
    hotspot: Hotspot,
    field: keyof Hotspot,
    value: string | number
  ) => {
    updateHotspot(scene.id, hotspot.id, { [field]: value });
  };

  return (
    <div className="absolute">
      <h3 className="text-lg font-bold mb-2">Hotspots</h3>
      {scene.hotspots.map((hotspot) => (
        <Card key={hotspot.id} className="mb-4 bg-gray-100 rounded">
          <CardHeader>
            <h4 className="text-md font-medium">Hotspot</h4>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              value={hotspot.text}
              onChange={(e) =>
                handleHotspotUpdate(hotspot, "text", e.target.value)
              }
              placeholder="Hotspot Text"
              className="mb-2"
            />
            <div className="flex space-x-2">
              <Input
                type="number"
                value={hotspot.yaw}
                onChange={(e) =>
                  handleHotspotUpdate(
                    hotspot,
                    "yaw",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="Yaw"
                className="w-1/2"
                step="0.01"
              />
              <Input
                type="number"
                value={hotspot.pitch}
                onChange={(e) =>
                  handleHotspotUpdate(
                    hotspot,
                    "pitch",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="Pitch"
                className="w-1/2"
                step="0.01"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={() => removeHotspot(scene.id, hotspot.id)}
              variant="destructive"
              className="mt-2"
            >
              Remove
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default HotspotEditor;
