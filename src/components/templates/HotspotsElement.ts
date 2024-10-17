import { Hotspot } from "@/lib/types";
import "tailwindcss/tailwind.css";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import "tippy.js/themes/light.css";

// CSS Animations
const HOTSPOT_CSS = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }

  .hotspot-float {
    animation: float 3s ease-in-out infinite;
  }

  .hotspot-pulse {
    animation: pulse 2s ease-in-out infinite;
  }
`;

// Add the CSS to the document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = HOTSPOT_CSS;
  document.head.appendChild(style);
}

export const createHotspotElement = (hotspot: Hotspot): HTMLDivElement => {
  const element = document.createElement("div");
  const baseClasses =
    "hotspot cursor-pointer transition-all duration-300 ease-in-out shadow-lg relative";

  const createContent = () => {
    let content = "";
    if (hotspot.title) {
      content += `<h3 class="text-lg font-bold mb-2">${hotspot.title}</h3>`;
    }
    if (hotspot.text) {
      content += `<p class="mb-2">${hotspot.text}</p>`;
    }
    if (hotspot.imageUrl) {
      content += `<img src="${
        hotspot.imageUrl
      }" class="w-full rounded-lg mb-2 transition-transform duration-300 hover:scale-105" alt="${
        hotspot.title || "Hotspot image"
      }" />`;
    }
    if (hotspot.description) {
      content += `<p class="text-sm text-gray-600">${hotspot.description}</p>`;
    }
    return content;
  };

  const createHotspotIcon = () => {
    switch (hotspot.template) {
      case "expand":
        return `<div class="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center">
                    <span class="text-xs font-bold">?</span>
                  </div>
                </div>`;
      case "hintspot":
        return `<img src="/img/hotspot.png" class="w-8 h-8" alt="Hint" />`;
      case "info":
        return `<div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg hotspot-float">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>`;
      case "rotate":
        return `<div class="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center shadow-lg">
                  <span class="text-lg">⟳</span>
                </div>`;
      case "reveal":
        return `<div class="w-16 h-16 relative overflow-hidden rounded-lg shadow-lg">
                  <img src="${
                    hotspot.imageUrl || "/img/photo.png"
                  }" class="w-full h-full object-cover" alt="Reveal" />
                  <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span class="text-white text-lg font-bold">Reveal</span>
                  </div>
                </div>`;
      default:
        return `<div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hotspot-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6 text-white">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>`;
    }
  };

  element.className = `${baseClasses} ${hotspot.type || ""}`;
  element.innerHTML = createHotspotIcon();

  // Initialize Tippy
  tippy(element, {
    content: createContent(),
    allowHTML: true,
    interactive: true,
    animation: "scale",
    theme: "light",
    placement: "auto",
    arrow: true,
    maxWidth: 300,
    trigger: "click",
    onShow(instance) {
      instance.popper.querySelector("img")?.addEventListener("load", () => {
        instance.popperInstance.update();
      });
    },
  });

  return element;
};
