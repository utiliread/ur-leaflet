import 'leaflet-area-select';
import 'leaflet-fullscreen';
import './leaflet-map.css';
import { Map, MapOptions } from 'leaflet';
import { IMarkerCustomElement } from './marker-custom-element';
import { LatLng } from 'leaflet';
import { LeafletApi } from './leaflet-api';
export declare class LeafletMapCustomElement {
    private isAttached;
    private hasBounds;
    element: HTMLElement;
    options: MapOptions;
    api: LeafletApi;
    markers: IMarkerCustomElement[];
    map: Map;
    constructor(element: Element);
    bind(): void;
    attached(): void;
    detached(): void;
    markersChanged(): void;
    goto(center: LatLng, zoom?: number): void;
}
