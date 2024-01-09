import { LatLng } from "leaflet";

export interface IMarkerCustomElement<P = any> {
  toGeoJSON(precision?: number | false): GeoJSON.Feature<GeoJSON.Point, P>;
  getLatLng: () => LatLng;
  model: any;
}

export function isMarkerCustomElement(x: any): x is IMarkerCustomElement {
  return x?.getLatLng && typeof x.getLatLng === "function";
}
