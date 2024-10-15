// src/components/HotspotElement.ts
import { Hotspot } from "@/lib/types";
import "tailwindcss/tailwind.css"; // Make sure Tailwind is included in your project

export const createHotspotElement = (hotspot: Hotspot): HTMLDivElement => {
  const element = document.createElement("div");
  element.className = `hotspot ${hotspot.type}-hotspot ${hotspot.template}-template 
    flex items-center justify-center cursor-pointer transition-transform 
    transform hover:scale-110 hover:opacity-80 text-white border-2 border-white`;

  // Add icon or text inside the hotspot
  const icon = document.createElement("div");
  icon.className = "text-xl"; // Tailwind class for larger text

  if (hotspot.type === "info") {
    icon.innerHTML = "&#9432;"; // Info icon (ℹ)
  } else if (hotspot.type === "link") {
    icon.innerHTML = "&#128279;"; // Link icon (🔗)
  } else {
    icon.textContent = hotspot.text;
  }

  // Switch based on template type
  switch (hotspot.template) {
    case "circular":
      element.classList.add(
        "rounded-full",
        "w-12",
        "h-12",
        "bg-black",
        "bg-opacity-50"
      );
      break;

    case "square":
      element.classList.add("w-12", "h-12", "bg-black", "bg-opacity-50");
      break;

    default:
      element.classList.add(
        "px-4",
        "py-2",
        "rounded-lg",
        "bg-black",
        "bg-opacity-50"
      );
  }

  // Append the icon/text to the element
  element.appendChild(icon);

  return element;
};
