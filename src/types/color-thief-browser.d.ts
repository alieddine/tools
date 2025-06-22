declare module 'color-thief-browser' {
    export default class ColorThief {
      static getPalette(image: HTMLImageElement, colorCount?: number): Promise<number[][]>;
      static getColor(image: HTMLImageElement): Promise<number[]>;
    }
  }
  