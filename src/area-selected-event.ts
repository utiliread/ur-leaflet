import { LatLngBounds } from 'leaflet';

export interface AreaSelectedEvent<T = any> extends CustomEvent<AreaSelectedEventDetail<T>> {
}

export interface AreaSelectedEventDetail<T = any> {
    bounds: LatLngBounds;
    selected: T[];
}