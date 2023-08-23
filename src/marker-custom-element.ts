import { LatLng } from "leaflet";

export interface IMarkerCustomElement {
  getLatLng: () => LatLng;
  model: any;
}

export function isMarkerCustomElement(x: any): x is IMarkerCustomElement {
  return x?.getLatLng && typeof x.getLatLng === "function";
}
