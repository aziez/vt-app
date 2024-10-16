// store/useTourStore.tsx

import { create } from "zustand";
import { persist, StateStorage } from "zustand/middleware";
import * as idb from "idb-keyval";
import * as LZString from "lz-string";
import {
  Tour,
  Scene,
  Hotspot,
  TourTemplate,
  HotspotTemplate,
  ViewParameters,
} from "@/lib/types";

// Custom storage object
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = localStorage.getItem(name);
      if (value) {
        return LZString.decompressFromUTF16(value);
      }
      const idbValue = await idb.get(name);
      return idbValue !== undefined ? idbValue : null; // Convert undefined to null
    } catch {
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const compressedValue = LZString.compressToUTF16(value);
      localStorage.setItem(name, compressedValue);
    } catch {
      await idb.set(name, value);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      localStorage.removeItem(name);
    } catch {
      await idb.del(name);
    }
  },
};

interface TourState {
  tour: Tour | null;
  currentSceneId: string | null;
  setTour: (tour: Tour) => void;
  addScene: (scene: Scene) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  removeScene: (sceneId: string) => void;
  setCurrentScene: (sceneId: string) => void;
  addHotspot: (sceneId: string, hotspot: Hotspot) => void;
  updateHotspot: (
    sceneId: string,
    hotspotId: string,
    updates: Partial<Hotspot>
  ) => void;
  removeHotspot: (sceneId: string, hotspotId: string) => void;
  setTourTemplate: (template: TourTemplate) => void;
  setHotspotTemplate: (
    sceneId: string,
    hotspotId: string,
    template: HotspotTemplate
  ) => void;
  updateViewParameters: (
    sceneId: string,
    params: Partial<ViewParameters>
  ) => void;
}

export const useTourStore = create<TourState>()(
  persist(
    (set) => ({
      tour: null,
      currentSceneId: null,
      setTour: (tour) => set({ tour }),
      addScene: (scene) =>
        set((state) => ({
          tour: state.tour
            ? { ...state.tour, scenes: [...state.tour.scenes, scene] }
            : null,
        })),
      updateScene: (sceneId, updates) =>
        set((state) => ({
          tour: state.tour
            ? {
                ...state.tour,
                scenes: state.tour.scenes.map((scene) =>
                  scene.id === sceneId ? { ...scene, ...updates } : scene
                ),
              }
            : null,
        })),
      removeScene: (sceneId) =>
        set((state) => ({
          tour: state.tour
            ? {
                ...state.tour,
                scenes: state.tour.scenes.filter(
                  (scene) => scene.id !== sceneId
                ),
              }
            : null,
        })),
      setCurrentScene: (sceneId) => set({ currentSceneId: sceneId }),
      addHotspot: (sceneId, hotspot) =>
        set((state) => ({
          tour: state.tour
            ? {
                ...state.tour,
                scenes: state.tour.scenes.map((scene) =>
                  scene.id === sceneId
                    ? { ...scene, hotspots: [...scene.hotspots, hotspot] }
                    : scene
                ),
              }
            : null,
        })),
      updateHotspot: (sceneId, hotspotId, updates) =>
        set((state) => ({
          tour: state.tour
            ? {
                ...state.tour,
                scenes: state.tour.scenes.map((scene) =>
                  scene.id === sceneId
                    ? {
                        ...scene,
                        hotspots: scene.hotspots.map((hotspot) =>
                          hotspot.id === hotspotId
                            ? { ...hotspot, ...updates }
                            : hotspot
                        ),
                      }
                    : scene
                ),
              }
            : null,
        })),
      removeHotspot: (sceneId, hotspotId) =>
        set((state) => ({
          tour: state.tour
            ? {
                ...state.tour,
                scenes: state.tour.scenes.map((scene) =>
                  scene.id === sceneId
                    ? {
                        ...scene,
                        hotspots: scene.hotspots.filter(
                          (hotspot) => hotspot.id !== hotspotId
                        ),
                      }
                    : scene
                ),
              }
            : null,
        })),
      setTourTemplate: (template) =>
        set((state) => ({
          tour: state.tour ? { ...state.tour, template } : null,
        })),
      setHotspotTemplate: (sceneId, hotspotId, template) =>
        set((state) => ({
          tour: state.tour
            ? {
                ...state.tour,
                scenes: state.tour.scenes.map((scene) =>
                  scene.id === sceneId
                    ? {
                        ...scene,
                        hotspots: scene.hotspots.map((hotspot) =>
                          hotspot.id === hotspotId
                            ? { ...hotspot, template }
                            : hotspot
                        ),
                      }
                    : scene
                ),
              }
            : null,
        })),
      updateViewParameters: (sceneId, params) =>
        set((state) => ({
          tour: state.tour
            ? {
                ...state.tour,
                scenes: state.tour.scenes.map((scene) =>
                  scene.id === sceneId
                    ? { ...scene, viewParameters: params }
                    : scene
                ),
              }
            : null,
        })),
    }),
    { name: "tour", storage }
  )
);
