export interface IReplaceColor {
   searchString: string;
   color: string;
}

export interface IProject {
   id: number;
   category: string;
   path: string;
   version: number;
   overlay: boolean;
   dialog: boolean;
   apps: Array<string>;
}

export interface IBounds {
   x: number;
   y: number;
   width: number;
   height: number;
}

export interface IOverlayMessage {
   id: number;
   type: string;
   message: string;
   color: string;
}

export interface IRadFiles {
   path: string;
}
