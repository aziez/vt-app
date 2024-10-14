import React, { useState } from "react";
import { useTourStore } from "@/store/tourStore";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Edit, Trash2, Play } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TourTemplate } from "@/lib/types";

const SceneManager: React.FC = () => {
  const {
    tour,
    addScene,
    removeScene,
    setCurrentScene,
    currentSceneId,
    updateScene,
    setTourTemplate,
  } = useTourStore();
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const binaryStr = reader.result as string;
          const thumbnailUrl = binaryStr;

          addScene({
            id: `scene-${Date.now()}`,
            name: file.name,
            panoramaUrl: binaryStr,
            thumbnail: thumbnailUrl,
            hotspots: [],
            initialViewParameters: { yaw: 0, pitch: 0, fov: 90 },
          });
        };
        reader.readAsDataURL(file);
      });
    },
    [addScene]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const handleNameChange = (sceneId: string, newName: string) => {
    updateScene(sceneId, { name: newName });
    setEditingSceneId(null);
  };

  const handleTemplateChange = (template: TourTemplate) => {
    setTourTemplate(template);
  };

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">Tour Settings</h2>
        <Select onValueChange={handleTemplateChange} value={tour?.template}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Select tour template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="vintage">Vintage</SelectItem>
          </SelectContent>
        </Select>

        <h2 className="text-xl font-bold mb-4">Scenes</h2>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-4 mb-4 transition-colors duration-300 ease-in-out ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-center">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Drag and drop panorama images here, or click to select
            </p>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-240px)]">
          <ul className="space-y-2">
            {tour?.scenes.map((scene) => (
              <li
                key={scene?.id}
                className={`rounded-md transition-colors duration-200 ease-in-out ${
                  scene.id === currentSceneId
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={scene?.thumbnail} alt={scene?.name} />
                      {/* <AvatarFallback>{scene?.name[0]}</AvatarFallback> */}
                    </Avatar>
                    {editingSceneId === scene.id ? (
                      <Input
                        value={scene.name}
                        onChange={(e) =>
                          handleNameChange(scene.id, e.target.value)
                        }
                        onBlur={() => setEditingSceneId(null)}
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm font-medium truncate flex-grow mr-2">
                        {scene.name}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2 justify-start">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingSceneId(scene.id)}
                      className="hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCurrentScene(scene.id)}
                      className="hover:bg-gray-100"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeScene(scene.id)}
                      className="hover:bg-gray-100 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SceneManager;
