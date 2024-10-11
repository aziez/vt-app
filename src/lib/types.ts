// /lib/types.ts

export interface Tour {
  id: string;
  title: string;
  scenes: Scene[];
}

export interface Scene {
  id: string;
  title: string;
  name: string;
  panoramaUrl: string;
  hotspots: Hotspot[];
  initialViewParameters: {
    yaw: number;
    pitch: number;
    fov: number;
  };
}
export interface Hotspot {
  id: string;
  type: "info" | "link";
  text: string;
  yaw: number;
  pitch: number;
  linkedSceneId?: string;
}

export interface ViewParameters {
  yaw: number;
  pitch: number;
  fov: number;
}
