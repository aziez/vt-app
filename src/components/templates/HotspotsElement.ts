import { Hotspot } from "@/lib/types";
import "tailwindcss/tailwind.css";
import "./HotspotStyle.css";

export const createHotspotElement = (hotspot: Hotspot): HTMLDivElement => {
  const element = document.createElement("div");
  const baseClasses = `
    hotspot ${hotspot.type}-hotspot
    cursor-pointer
    transition-all duration-300
    shadow-lg
    relative
  `;

  switch (hotspot.template) {
    case "hintspot":
      element.className = `${baseClasses} hint--right hint--info hint--bounce`;
      element.setAttribute("data-hint", hotspot.text || "More information");
      const link = document.createElement("a");
      link.href = hotspot.url || "#";
      link.target = "_blank";
      const img = document.createElement("img");
      img.src = "/img/hotspot.png";
      link.appendChild(img);
      element.appendChild(link);
      break;

    case "tooltip":
      element.className = `${baseClasses} tooltip`;
      element.innerHTML = `
        <div class="out">
          <div class="in">
            <div class="image"></div>
          </div>
        </div>
        <div class="tip">
          <p>${hotspot.text || "More information"}</p>
          ${hotspot.imageUrl ? `<img src="${hotspot.imageUrl}">` : ""}
        </div>
      `;
      break;

    case "info":
      element.className = `${baseClasses} info`;
      element.innerHTML = `
        <div class="icon_wrapper">
          <div class="icon">
            <div id="inner_icon" class="inner_icon">
              <div class="icon1"></div>
              <div class="icon2"></div>
            </div>
          </div>
        </div>
        <div class="tip">
          <p>${hotspot.text || "Click for more info"}</p>
        </div>
        <div class="content">
          <div class="image-wrapper">
            ${hotspot.imageUrl ? `<img src="${hotspot.imageUrl}">` : ""}
          </div>
          <div class="content-form">
            <p>${hotspot.description || "Additional information goes here"}</p>
          </div>
          <div class="button_wrapper">
            <button class="close">Close</button>
          </div>
        </div>
      `;
      break;

    case "rotate":
      element.className = `${baseClasses} rotate-hotspot`;
      element.innerHTML = `
        <div class="rotate-img"></div>
        <div class="rotate-content">
          <h1>${hotspot.title || "Title"}</h1>
          <p>${hotspot.text || "Description"}</p>
        </div>
      `;
      break;

    case "reveal":
      element.className = `${baseClasses} reveal`;
      element.innerHTML = `
        <img src="${hotspot.imageUrl || "/img/photo.png"}">
        <div class="reveal-content">
          <img src="${
            hotspot.revealImageUrl || hotspot.imageUrl || "/img/photo.jpg"
          }">
          <p>${hotspot.text || "Description"}</p>
        </div>
      `;
      break;

    default:
      // Default to the original circular style
      element.className = `${baseClasses}
        w-10 h-10 rounded-full
        bg-gradient-to-br from-purple-500 to-pink-500
        hover:from-purple-600 hover:to-pink-600
        transform hover:scale-110
        flex items-center justify-center
      `;
      const iconElement = document.createElement("div");
      iconElement.className = "text-white text-sm font-bold z-10";
      iconElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `;
      element.appendChild(iconElement);
  }

  return element;
};
