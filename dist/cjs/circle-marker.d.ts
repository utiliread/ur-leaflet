import { CircleMarkerOptions, PopupOptions } from 'leaflet';
import { IMarkerCustomElement } from './marker-custom-element';
import { LeafletMapCustomElement } from './leaflet-map';
export declare class CircleMarkerCustomElement implements IMarkerCustomElement {
    private element;
    private map;
    private marker;
    private disposables;
    private isAttached;
    private isAdded;
    lat: number;
    lng: number;
    model: any;
    options?: CircleMarkerOptions;
    delay?: number | string;
    popup?: string;
    popupOptions?: PopupOptions;
    constructor(element: Element, map: LeafletMapCustomElement);
    bind(): void;
    attached(): void;
    detached(): void;
    unbind(): void;
    positionChanged(): void;
    optionsChanged(): void;
    popupChanged(): void;
    getLatLng(): import("leaflet").LatLng;
}
