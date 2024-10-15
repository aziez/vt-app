// File: utils/tourExporter.ts
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Tour, Scene, Hotspot } from "@/lib/types";

export async function exportTour(tour: Tour) {
  const zip = new JSZip();

  // Add Marzipano library
  zip.file("js/marzipano.js", await fetchMarzipanoLibrary());

  // Generate data.js with the templates included
  const dataJs = generateDataJs(tour);
  zip.file("data.js", dataJs);

  // Generate index.html
  const indexHtml = generateIndexHtml();
  zip.file("index.html", indexHtml);

  // Generate index.js
  const indexJs = generateIndexJs();
  zip.file("index.js", indexJs);

  // Add image files
  for (const scene of tour.scenes) {
    const response = await fetch(scene.panoramaUrl);
    const blob = await response.blob();
    zip.file(`images/${scene.id}.jpg`, blob);
  }

  // Generate and save zip file
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "virtual-tour.zip");
}

async function fetchMarzipanoLibrary() {
  const response = await fetch("https://www.marzipano.net/build/marzipano.js");
  return await response.text();
}

// Generate the data.js with the template attribute included for each hotspot
function generateDataJs(tour: Tour) {
  const scenesData = tour.scenes.map((scene) => ({
    id: scene.id,
    name: scene.name,
    levels: [
      {
        tileSize: 256,
        size: 256,
        fallbackOnly: true,
      },
    ],
    faceSize: 4000,
    initialViewParameters: scene.initialViewParameters,
    linkHotspots: scene.hotspots
      .filter(
        (
          hotspot
        ): hotspot is Hotspot & { type: "link"; linkedSceneId: string } =>
          hotspot.type === "link" && !!hotspot.linkedSceneId
      )
      .map((hotspot) => ({
        yaw: hotspot.yaw,
        pitch: hotspot.pitch,
        rotation: 0,
        target: hotspot.linkedSceneId,
        template: hotspot.template || "default", // Add template to link hotspots
      })),
    infoHotspots: scene.hotspots
      .filter(
        (hotspot): hotspot is Hotspot & { type: "info" } =>
          hotspot.type === "info"
      )
      .map((hotspot) => ({
        yaw: hotspot.yaw,
        pitch: hotspot.pitch,
        title: hotspot.text,
        text: hotspot.text,
        template: hotspot.template || "default", // Add template to info hotspots
      })),
  }));

  return `var APP_DATA = {
    "scenes": ${JSON.stringify(scenesData, null, 2)},
    "name": "${tour.title}",
    "settings": {
      "mouseViewMode": "drag",
      "autorotateEnabled": false,
      "fullscreenButton": true,
      "viewControlButtons": true
    }
  };`;
}

// The HTML with custom styles for the templates
function generateIndexHtml() {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Virtual Tour</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="js/marzipano.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="data.js"></script>
    <style>
        html, body { width: 100%; height: 100%; margin: 0; padding: 0; }
        #pano { width: 100%; height: 100%; }
        .hotspot { background-color: rgba(0, 0, 0, 0.5); color: #fff; border-radius: 5px; padding: 10px; }
        .default-template { background-color: rgba(0, 0, 0, 0.5); }
        .modern-template { background-color: rgba(0, 128, 128, 0.5); border: 2px solid #00ffff; }
        .vintage-template { background-color: rgba(165, 42, 42, 0.7); border: 2px solid #8b4513; }
        .circular-template { border-radius: 50%; width: 50px; height: 50px; }
        .square-template { width: 50px; height: 50px; }
    </style>
</head>
<body>
    <div id="pano"></div>
    <script src="index.js"></script>
</body>
</html>`;
}

// The JS for Marzipano and dynamically adding hotspots with template-specific styles
function generateIndexJs() {
  return `
// Create viewer
var viewer = new Marzipano.Viewer(document.getElementById('pano'));

// Create scenes
var scenes = APP_DATA.scenes.map(function(data) {
  var source = Marzipano.ImageUrlSource.fromString("images/" + data.id + ".jpg");
  var geometry = new Marzipano.EquirectGeometry([{ width: data.faceSize }]);

  var limiter = Marzipano.RectilinearView.limit.traditional(data.faceSize, 100*Math.PI/180);
  var view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);

  var scene = viewer.createScene({
    source: source,
    geometry: geometry,
    view: view,
    pinFirstLevel: true
  });

  // Create link hotspots
  data.linkHotspots.forEach(function(hotspot) {
    var element = createLinkHotspotElement(hotspot);
    scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
  });

  // Create info hotspots
  data.infoHotspots.forEach(function(hotspot) {
    var element = createInfoHotspotElement(hotspot);
    scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
  });

  return {
    data: data,
    scene: scene,
    view: view
  };
});

// Display the initial scene
switchScene(scenes[0]);

// Switch between scenes
function switchScene(scene) {
  scene.view.setParameters(scene.data.initialViewParameters);
  scene.scene.switchTo();
}

// Create link hotspot elements
function createLinkHotspotElement(hotspot) {
  var wrapper = document.createElement('div');
  wrapper.classList.add('hotspot', 'link-hotspot');
  wrapper.classList.add(hotspot.template + '-template'); // Apply template class

  var icon = document.createElement('img');
  icon.src = 'link-icon.png';
  icon.classList.add('link-hotspot-icon');

  wrapper.appendChild(icon);

  var tooltip = document.createElement('div');
  tooltip.classList.add('hotspot-tooltip', 'link-hotspot-tooltip');
  tooltip.innerHTML = findSceneDataById(hotspot.target).name;

  wrapper.appendChild(tooltip);

  wrapper.addEventListener('click', function() {
    switchScene(findSceneById(hotspot.target));
  });

  return wrapper;
}

// Create info hotspot elements
function createInfoHotspotElement(hotspot) {
  var wrapper = document.createElement('div');
  wrapper.classList.add('hotspot', 'info-hotspot');
  wrapper.classList.add(hotspot.template + '-template'); // Apply template class

  var title = document.createElement('div');
  title.classList.add('info-hotspot-title');
  title.innerHTML = hotspot.title;

  var text = document.createElement('div');
  text.classList.add('info-hotspot-text');
  text.innerHTML = hotspot.text;

  wrapper.appendChild(title);
  wrapper.appendChild(text);

  return wrapper;
}

// Helper functions
function findSceneById(id) {
  return scenes.find(scene => scene.data.id === id);
}

function findSceneDataById(id) {
  return APP_DATA.scenes.find(scene => scene.id === id);
}
`;
}
