// / lib/epsty.ts

export interface Tour {
  id: string;
  title: string;
  scenes: Scene[];
  initialSceneId: string;
  template: TourTemplate;
}

export interface Scene {
  id: string;
  name: string;
  panoramaUrl: string;
  thumbnail: string;
  hotspots: Hotspot[];
  initialViewParameters: ViewParameters;
}

export interface Hotspot {
  id: string;
  type: "info" | "link";
  text: string;
  yaw: number;
  pitch: number;
  linkedSceneId?: string;
  template: HotspotTemplate;
}

export interface ViewParameters {
  yaw: number;
  pitch: number;
  fov: number;
}

export type TourTemplate = "default" | "modern" | "vintage";
export type HotspotTemplate = "default" | "circular" | "square";
