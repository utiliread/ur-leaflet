import { LatLng } from "leaflet";
export interface IMarkerCustomElement {
    getLatLng: () => LatLng;
    model: any;
}
