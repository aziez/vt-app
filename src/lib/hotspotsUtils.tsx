/* eslint-disable @typescript-eslint/no-explicit-any */
// / hotspotUtils.ts
import { Hotspot } from "@/lib/types";

export const createHotspotElement = (hotspot: Hotspot) => {
  const element = document.createElement("div");
  element.className = `hotspot ${hotspot.type}-hotspot ${hotspot.template}-template`;

  switch (hotspot.template) {
    case "circular":
      element.style.borderRadius = "50%";
      element.style.width = "40px";
      element.style.height = "40px";
      break;
    case "square":
      element.style.width = "40px";
      element.style.height = "40px";
      break;
    default:
      element.style.padding = "10px";
      element.style.borderRadius = "5px";
  }

  element.style.backgroundColor =
    hotspot.type === "info" ? "rgba(0, 0, 255, 0.5)" : "rgba(255, 0, 0, 0.5)";
  element.style.color = "white";
  element.textContent = hotspot.text;

  return element;
};

export const dragElement = (
  element: HTMLElement,
  hotspotInstance: any,
  hotspot: Hotspot,
  viewerInstance: any,
  onDragEnd: (position: { yaw: number; pitch: number }) => void
) => {
  let isDragging = false;
  let previousX = 0;
  let previousY = 0;

  const dragMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    isDragging = true;
    previousX = e.clientX;
    previousY = e.clientY;
    document.addEventListener("mousemove", elementDrag);
    document.addEventListener("mouseup", closeDragElement);
  };

  const elementDrag = (e: MouseEvent) => {
    e.preventDefault();
    if (!isDragging) return;

    const deltaX = previousX - e.clientX;
    const deltaY = previousY - e.clientY;
    previousX = e.clientX;
    previousY = e.clientY;

    const view = viewerInstance.scene().view();
    const fov = view.fov();
    const hfov =
      (fov * viewerInstance.stage().width()) / viewerInstance.stage().height();

    const position = hotspotInstance.position();
    position.yaw -= (deltaX * hfov) / viewerInstance.stage().width();
    position.pitch += (deltaY * fov) / viewerInstance.stage().height();

    hotspotInstance.setPosition(position);
  };

  const closeDragElement = () => {
    isDragging = false;
    document.removeEventListener("mousemove", elementDrag);
    document.removeEventListener("mouseup", closeDragElement);

    const position = hotspotInstance.position();
    onDragEnd(position);
  };

  element.addEventListener("mousedown", dragMouseDown);
};
