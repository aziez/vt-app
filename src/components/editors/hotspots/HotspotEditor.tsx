import React, { useCallback } from "react";
import { Scene, Hotspot, HotspotTemplate } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Menu, Pencil, Trash2, X } from "lucide-react";

interface HotspotEditorProps {
  scene: Scene;
  onUpdateHotspot: (hotspotId: string, updates: Partial<Hotspot>) => void;
  onRemoveHotspot: (hotspotId: string) => void;
}

const HotspotEditor: React.FC<HotspotEditorProps> = ({
  scene,
  onUpdateHotspot,
  onRemoveHotspot,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleHotspotUpdate = useCallback(
    (hotspot: Hotspot, field: keyof Hotspot, value: string | number) => {
      if (hotspot && hotspot.id) {
        onUpdateHotspot(hotspot.id, { [field]: value });
      }
    },
    [onUpdateHotspot]
  );

  const handleTemplateChange = useCallback(
    (hotspotId: string, template: HotspotTemplate) => {
      if (hotspotId) {
        onUpdateHotspot(hotspotId, { template });
      }
    },
    [onUpdateHotspot]
  );

  const hotspotTemplateOptions: HotspotTemplate[] = [
    "expand",
    "hintspot",
    "info",
    "reveal",
    "rotate",
    "textInfo",
    "tooltip",
  ];

  if (!scene || !scene.hotspots) {
    return null;
  }

  return (
    <>
      <Button
        className="fixed top-4 right-4 z-50"
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      <Card
        className={`fixed top-0 right-0 h-full w-80 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-4">Hotspots</h3>
          <Accordion type="single" collapsible className="w-full">
            {scene.hotspots.map((hotspot) => (
              <AccordionItem
                key={hotspot?.id || "fallback-key"}
                value={hotspot?.id || "fallback-value"}
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <Pencil className="h-4 w-4" />
                    <span>{hotspot.text || "Unnamed Hotspot"}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor={`hotspot-text-${hotspot.id}`}>Text</Label>
                      <Input
                        id={`hotspot-text-${hotspot.id}`}
                        type="text"
                        value={hotspot?.text || ""}
                        onChange={(e) =>
                          handleHotspotUpdate(hotspot, "text", e.target.value)
                        }
                        placeholder="Hotspot Text"
                      />
                    </div>
                    {["yaw", "pitch"].map((field) => (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={`hotspot-${field}-${hotspot.id}`}>
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </Label>
                        <Slider
                          id={`hotspot-${field}-${hotspot.id}`}
                          min={-180}
                          max={180}
                          step={0.1}
                          value={[
                            (hotspot[field as keyof Hotspot] as number) || 0,
                          ]}
                          onValueChange={(value) =>
                            handleHotspotUpdate(
                              hotspot,
                              field as keyof Hotspot,
                              value[0]
                            )
                          }
                        />
                        <Input
                          type="number"
                          value={hotspot[field as keyof Hotspot] || 0}
                          onChange={(e) =>
                            handleHotspotUpdate(
                              hotspot,
                              field as keyof Hotspot,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="mt-1"
                          step="0.1"
                        />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Label htmlFor={`hotspot-template-${hotspot.id}`}>
                        Template
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleTemplateChange(
                            hotspot.id,
                            value as HotspotTemplate
                          )
                        }
                        value={hotspot.template || "default"}
                      >
                        <SelectTrigger
                          id={`hotspot-template-${hotspot.id}`}
                          className="w-full"
                        >
                          <SelectValue placeholder="Select hotspot template" />
                        </SelectTrigger>
                        <SelectContent>
                          {hotspotTemplateOptions.map((template) => (
                            <SelectItem key={template} value={template}>
                              {template.charAt(0).toUpperCase() +
                                template.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={() => onRemoveHotspot(hotspot.id)}
                      variant="destructive"
                      className="w-full"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remove Hotspot
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
};

export default HotspotEditor;
