import React, { useCallback, useMemo } from "react";
import { Scene, Hotspot, HotspotTemplate } from "@/lib/types";
import { useTourStore } from "@/store/tourStore";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HotspotEditorProps {
  scene: Scene;
}

const HotspotEditor: React.FC<HotspotEditorProps> = ({ scene }) => {
  const { updateHotspot, removeHotspot, setHotspotTemplate } = useTourStore();

  const handleHotspotUpdate = useCallback(
    (hotspot: Hotspot, field: keyof Hotspot, value: string | number) => {
      if (hotspot && hotspot.id) {
        updateHotspot(scene.id, hotspot.id, { [field]: value });
      }
    },
    [updateHotspot, scene.id]
  );

  const handleTemplateChange = useCallback(
    (hotspotId: string, template: HotspotTemplate) => {
      if (hotspotId) {
        setHotspotTemplate(scene.id, hotspotId, template);
      }
    },
    [setHotspotTemplate, scene.id]
  );

  const handleRemoveHotspot = useCallback(
    (hotspotId: string) => {
      if (hotspotId) {
        removeHotspot(scene.id, hotspotId);
      }
    },
    [removeHotspot, scene.id]
  );

  const templateOptions = useMemo(
    () => [
      { value: "default", label: "Default" },
      { value: "circular", label: "Circular" },
      { value: "square", label: "Square" },
    ],
    []
  );

  if (!scene || !scene.hotspots) {
    return <div>No hotspots available</div>;
  }

  return (
    <div className="absolute">
      <h3 className="text-lg font-bold mb-2">Hotspots</h3>
      {scene.hotspots.map((hotspot) => (
        <Card
          key={hotspot?.id || "fallback-key"}
          className="mb-4 bg-gray-100 rounded"
        >
          <CardHeader>
            <h4 className="text-md font-medium">Hotspot</h4>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              value={hotspot?.text || ""}
              onChange={(e) =>
                handleHotspotUpdate(hotspot, "text", e.target.value)
              }
              placeholder="Hotspot Text"
              className="mb-2"
            />
            <div className="flex space-x-2 mb-2">
              {["yaw", "pitch"].map((field) => (
                <Input
                  key={field}
                  type="number"
                  value={hotspot[field as keyof Hotspot] || 0}
                  onChange={(e) =>
                    handleHotspotUpdate(
                      hotspot,
                      field as keyof Hotspot,
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-1/2"
                  step="0.01"
                />
              ))}
            </div>
            <Select
              onValueChange={(value) =>
                handleTemplateChange(hotspot.id, value as HotspotTemplate)
              }
              value={hotspot.template || "default"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select hotspot template" />
              </SelectTrigger>
              <SelectContent>
                {templateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={() => handleRemoveHotspot(hotspot.id)}
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
