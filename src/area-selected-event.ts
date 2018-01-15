import { LatLngBounds } from 'leaflet';

export interface AreaSelectedEvent extends CustomEvent {
    readonly detail: AreaSelectedEventDetail;
}

export interface AreaSelectedEventDetail {
    bounds: LatLngBounds;
    selected: any[];
}