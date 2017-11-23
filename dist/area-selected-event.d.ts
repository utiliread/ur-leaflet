import { LatLngBounds } from 'leaflet';
export interface AreaSelectedEvent {
    detail: {
        bounds: LatLngBounds;
        selected: any[];
    };
}
