import React, { useState, useCallback } from "react";
import { Scene, Hotspot, HotspotTemplate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Menu, X, Pencil, Trash2, Upload } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// Extended Hotspot type to include new fields
interface ExtendedHotspot extends Hotspot {
  title?: string;
  description?: string;
  imageUrl?: string;
  embedUrl?: string;
}

interface HotspotEditorProps {
  scene: Scene;
  onUpdateHotspot: (
    hotspotId: string,
    updates: Partial<ExtendedHotspot>
  ) => void;
  onRemoveHotspot: (hotspotId: string) => void;
}

const hotspotTemplateOptions: HotspotTemplate[] = [
  "expand",
  "hintspot",
  "info",
  "reveal",
  "rotate",
  "textInfo",
  "tooltip",
  "embed",
];

const HotspotEditor: React.FC<HotspotEditorProps> = ({
  scene,
  onUpdateHotspot,
  onRemoveHotspot,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingHotspotId, setEditingHotspotId] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const handleHotspotUpdate = useCallback(
    (
      hotspotId: string,
      field: keyof ExtendedHotspot,
      value: string | number | File
    ) => {
      if (field === "imageUrl" && value instanceof File) {
        const imageUrl = URL.createObjectURL(value);
        setPreviewImageUrl(imageUrl);
        onUpdateHotspot(hotspotId, { [field]: imageUrl });
      } else {
        onUpdateHotspot(hotspotId, { [field]: value });
      }
    },
    [onUpdateHotspot]
  );

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, hotspotId: string) => {
      const file = event.target.files?.[0];
      if (file) {
        handleHotspotUpdate(hotspotId, "imageUrl", file);
      }
    },
    [handleHotspotUpdate]
  );

  if (!scene || !scene.hotspots) {
    return null;
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="fixed top-4 right-4 z-50"
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isOpen ? "Close Hotspot Editor" : "Open Hotspot Editor"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Card
        className={`fixed top-0 right-0 h-full w-80 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-4">Hotspots</h3>
          <Accordion type="single" collapsible className="w-full">
            {scene.hotspots.map((hotspot: ExtendedHotspot) => (
              <AccordionItem key={hotspot.id} value={hotspot.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <Pencil className="h-4 w-4" />
                    <span>{hotspot.type} Hotspot</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-2">
                    {/* <Select
                      value={hotspot.type}
                      onValueChange={(value) =>
                        handleHotspotUpdate(hotspot.id, "type", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select hotspot type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info Hotspot</SelectItem>
                        <SelectItem value="link">Link Hotspot</SelectItem>
                        <SelectItem value="embed">Embed Hotspot</SelectItem>
                      </SelectContent>
                    </Select> */}

                    <Select
                      value={hotspot.template || "expand"}
                      onValueChange={(value) =>
                        handleHotspotUpdate(
                          hotspot.id,
                          "template",
                          value as HotspotTemplate
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
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

                    <div className="space-y-2">
                      <Label htmlFor={`hotspot-title-${hotspot.id}`}>
                        Title
                      </Label>
                      <Input
                        id={`hotspot-title-${hotspot.id}`}
                        value={hotspot.title || ""}
                        onChange={(e) =>
                          handleHotspotUpdate(
                            hotspot.id,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Hotspot Title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`hotspot-text-${hotspot.id}`}>Text</Label>
                      <Input
                        id={`hotspot-text-${hotspot.id}`}
                        value={hotspot.text || ""}
                        onChange={(e) =>
                          handleHotspotUpdate(
                            hotspot.id,
                            "text",
                            e.target.value
                          )
                        }
                        placeholder="Hotspot Text"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`hotspot-description-${hotspot.id}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`hotspot-description-${hotspot.id}`}
                        value={hotspot.description || ""}
                        onChange={(e) =>
                          handleHotspotUpdate(
                            hotspot.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Hotspot Description"
                        rows={3}
                      />
                    </div>

                    {hotspot.type === "info" && (
                      <div className="space-y-2">
                        <Label htmlFor={`hotspot-image-${hotspot.id}`}>
                          Image
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id={`hotspot-image-${hotspot.id}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, hotspot.id)}
                          />
                          {hotspot.imageUrl && (
                            <img
                              src={hotspot.imageUrl}
                              alt="Preview"
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {hotspot.type === "embed" && (
                      <div className="space-y-2">
                        <Label htmlFor={`hotspot-embed-${hotspot.id}`}>
                          Embed URL
                        </Label>
                        <Input
                          id={`hotspot-embed-${hotspot.id}`}
                          value={hotspot.embedUrl || ""}
                          onChange={(e) =>
                            handleHotspotUpdate(
                              hotspot.id,
                              "embedUrl",
                              e.target.value
                            )
                          }
                          placeholder="Embed URL (e.g., website URL)"
                        />
                      </div>
                    )}

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
                              hotspot.id,
                              field as keyof Hotspot,
                              value[0]
                            )
                          }
                        />
                      </div>
                    ))}

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
