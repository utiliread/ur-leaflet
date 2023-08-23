import { LatLng, Map } from "leaflet";

export interface LeafletApi {
  getMap(): Map;
  goto(center: LatLng, zoom?: number): void;
}
