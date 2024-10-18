import { Hotspot } from "@/lib/types";
import "tailwindcss/tailwind.css";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import "tippy.js/themes/light.css";

// Enhanced CSS Animations
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

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }

  .hotspot-float {
    animation: float 3s ease-in-out infinite;
  }

  .hotspot-pulse {
    animation: pulse 2s ease-in-out infinite;
  }

  .hotspot-rotate {
    animation: rotate 4s linear infinite;
  }

  .hotspot-bounce {
    animation: bounce 2s ease-in-out infinite;
  }

  .embed-wrapper {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    max-width: 100%;
  }

  .embed-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
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
    if (hotspot.type === "embed" && hotspot.embedUrl) {
      content += `
        <div class="embed-wrapper rounded-lg overflow-hidden" style="width: 400px; height: 300px;">
          <iframe src="${hotspot.embedUrl}" frameborder="0" allowfullscreen></iframe>
        </div>`;
    } else {
      if (hotspot.title) {
        content += `<h3 class="text-lg font-bold mb-2 text-gray-800">${hotspot.title}</h3>`;
      }
      if (hotspot.text) {
        content += `<p class="mb-2 text-gray-700">${hotspot.text}</p>`;
      }
      if (hotspot.imageUrl) {
        content += `
          <div class="relative group">
            <img src="${hotspot.imageUrl}" 
                 class="w-full rounded-lg mb-2 transition-transform duration-300 group-hover:scale-105" 
                 alt="${hotspot.title || "Hotspot image"}" />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
          </div>`;
      }
      if (hotspot.description) {
        content += `<p class="text-sm text-gray-600">${hotspot.description}</p>`;
      }
    }
    return content;
  };

  const createHotspotIcon = () => {
    switch (hotspot.template) {
      case "expand":
        return `
          <div class="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center group hover:scale-110 transition-transform duration-300">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center group-hover:scale-95 transition-transform duration-300">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>`;

      case "hintspot":
        return `
          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg hotspot-float">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>`;

      case "info":
        return `
          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg hotspot-pulse group hover:scale-110 transition-transform duration-300">
            <svg class="w-6 h-6 group-hover:scale-95 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>`;

      case "rotate":
        return `
          <div class="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full flex items-center justify-center shadow-lg group hover:scale-110 transition-transform duration-300">
            <svg class="w-6 h-6 hotspot-rotate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>`;

      case "reveal":
        return `
          <div class="w-16 h-16 relative overflow-hidden rounded-lg shadow-lg group">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-75 group-hover:opacity-90 transition-opacity duration-300"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <svg class="w-8 h-8 text-white transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>`;

      case "textInfo":
        return `
          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 text-white flex items-center justify-center shadow-lg hotspot-float group hover:scale-110 transition-transform duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>`;

      case "embed":
        return `
          <div class="w-12 h-12 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white flex items-center justify-center shadow-lg hotspot-pulse group hover:scale-110 transition-transform duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>`;

      case "tooltip":
        return `
          <div class="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 text-white flex items-center justify-center shadow-lg hotspot-bounce group hover:scale-110 transition-transform duration-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>`;

      default:
        return `
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hotspot-pulse group hover:scale-110 transition-transform duration-300">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>`;
    }
  };

  element.className = `${baseClasses} ${hotspot.type || ""}`;
  element.innerHTML = createHotspotIcon();

  // Initialize Tippy with enhanced options
  tippy(element, {
    content: createContent(),
    allowHTML: true,
    interactive: true,
    animation: "scale",
    theme: "light",
    placement: "auto",
    arrow: true,
    maxWidth: hotspot.type === "embed" ? 800 : 500,
    trigger: "click",
    onShow(instance) {
      instance.popper.querySelector("img")?.addEventListener("load", () => {
        setTimeout(() => {
          instance.popperInstance?.update();
        }, 100); // Delay of 100 milliseconds
      });
    },
    onMount(instance) {
      // Add smooth entrance animation to content
      const content = instance.popper.querySelector(".tippy-content");
      if (content instanceof HTMLElement) {
        content.style.opacity = "0";
        content.style.transform = "translateY(10px)";
        setTimeout(() => {
          content.style.transition = "all 0.3s ease-out";
          content.style.opacity = "1";
          content.style.transform = "translateY(0)";
        }, 0);
      }
    },
  });

  return element;
};
