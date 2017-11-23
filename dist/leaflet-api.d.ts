import { LatLng } from 'leaflet';
export interface LeafletApi {
    goto(center: LatLng, zoom?: number): void;
}
