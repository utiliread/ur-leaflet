import { LatLng } from "leaflet";
export interface IMarkerCustomElement<P = any> {
    toGeoJSON(precision?: number | false): GeoJSON.Feature<GeoJSON.Point, P>;
    getLatLng: () => LatLng;
    model: any;
}
export declare function isMarkerCustomElement(x: any): x is IMarkerCustomElement;
