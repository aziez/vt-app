/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "marzipano" {
  export class Viewer {
    constructor(container: HTMLElement, opts?: any);
    createScene(options: any): any;
    view(): any;
    scene: () => Scene;
    destroy(): void;
  }

  export class ImageUrlSource {
    static fromString(url: string): any;
  }

  export class EquirectGeometry {
    constructor(levels: any[]);
  }

  export class RectilinearView {
    static limit: any;
    constructor(params: any, limiter: any);
  }
}
