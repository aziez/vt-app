// store/tourSTore.ts
import { create } from "zustand";
import { Tour, Scene, Hotspot } from "@/lib/types";

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
}

export const useTourStore = create<TourState>((set) => ({
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
            scenes: state.tour.scenes.filter((scene) => scene.id !== sceneId),
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
  
}));
