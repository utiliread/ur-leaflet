import './default-marker.css';
import { MarkerOptions } from 'leaflet';
import { IMarkerCustomElement } from './marker-custom-element';
import { LeafletMapCustomElement } from './leaflet-map';
export declare class DefaultMarkerCustomElement implements IMarkerCustomElement {
    private element;
    private map;
    private marker?;
    private disposables;
    private isAttached;
    lat: number;
    lng: number;
    model: any;
    options?: MarkerOptions;
    constructor(element: Element, map: LeafletMapCustomElement);
    bind(): void;
    attached(): void;
    detached(): void;
    unbind(): void;
    positionChanged(): void;
    optionsChanged(): void;
    getLatLng(): import("leaflet").LatLng;
}
