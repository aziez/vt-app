import React from "react";
import { useTourStore } from "@/store/tourStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Import card components from shadcn/ui
import JSZip from "jszip";
import { saveAs } from "file-saver";

const TourExporter: React.FC = () => {
  const { tour } = useTourStore();

  const handleJSONExport = () => {
    if (tour) {
      const tourJSON = JSON.stringify(tour, null, 2);
      const blob = new Blob([tourJSON], { type: "application/json" });
      saveAs(blob, `${tour.title.replace(/\s+/g, "_")}_tour_config.json`);
    }
  };

  const generateIndexHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tour?.title || "Virtual Tour"}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="pano"></div>
    <script src="https://www.marzipano.net/releases/latest/marzipano.js"></script>
    <script src="tour-config.js"></script>
    <script src="tour.js"></script>
</body>
</html>
    `;
  };

  const generateCSS = () => {
    return `
body { margin: 0; }
#pano { width: 100%; height: 100vh; }
    `;
  };

  const generateTourConfigJS = () => {
    return `const tourConfig = ${JSON.stringify(tour, null, 2)};`;
  };

  const generateTourJS = () => {
    return `
document.addEventListener('DOMContentLoaded', function() {
    const viewer = new Marzipano.Viewer(document.getElementById('pano'));

    const scenes = tourConfig.scenes.map(scene => {
        const source = Marzipano.ImageUrlSource.fromString(scene.panorama);
        const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
        const limiter = Marzipano.RectilinearView.limit.traditional(4096, 100*Math.PI/180);
        const view = new Marzipano.RectilinearView(null, limiter);
        
        return {
            data: scene,
            scene: viewer.createScene({
                source: source,
                geometry: geometry,
                view: view,
                pinFirstLevel: true
            })
        };
    });

    const initialScene = scenes.find(scene => scene.data.id === tourConfig.initialSceneId);
    if (initialScene) {
        initialScene.scene.switchTo();
    }

    // Add more functionality here (e.g., hotspots, scene transitions)
});
    `;
  };

  const handleZipExport = async () => {
    if (tour) {
      const zip = new JSZip();

      zip.file("index.html", generateIndexHTML());
      zip.file("styles.css", generateCSS());
      zip.file("tour-config.js", generateTourConfigJS());
      zip.file("tour.js", generateTourJS());

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${tour.title.replace(/\s+/g, "_")}_tour_export.zip`);
    }
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <h2 className="text-xl font-bold mb-4">Export Tour</h2>
      </CardHeader>
      <CardContent>
        <div className="space-x-4">
          <Button onClick={handleJSONExport} disabled={!tour}>
            Export Tour Configuration (JSON)
          </Button>
          <Button onClick={handleZipExport} disabled={!tour}>
            Export Tour as Zip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourExporter;
