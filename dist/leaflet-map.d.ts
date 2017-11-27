import 'leaflet-area-select';
import 'leaflet-fullscreen';
import './leaflet-map.css';
import { LatLngBounds, Map, MapOptions, Marker } from 'leaflet';
import { LatLng } from 'leaflet';
import { LeafletApi } from './leaflet-api';
export declare class LeafletMapCustomElement {
    element: HTMLElement;
    map: Map;
    options: MapOptions;
    api: LeafletApi;
    markers: {
        marker: Marker;
        model: any;
    }[];
    bounds: LatLngBounds;
    constructor(element: Element);
    bind(): void;
    attached(): void;
    detached(): void;
    markersChanged(): void;
    goto(center: LatLng, zoom?: number): void;
}
