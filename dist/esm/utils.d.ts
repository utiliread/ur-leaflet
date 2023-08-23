import { Disposable } from "aurelia-framework";
import { Layer } from "leaflet";
export declare function listen(layer: Layer, type: string, handler: (event: any) => void): Disposable;
