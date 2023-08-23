import { LatLng } from "leaflet";
export interface IMarkerCustomElement {
    getLatLng: () => LatLng;
    model: any;
}
export declare function isMarkerCustomElement(x: any): x is IMarkerCustomElement;
