import './circle-marker.css';
import { CircleMarker, CircleMarkerOptions } from 'leaflet';
import { LeafletMapCustomElement } from './leaflet-map';
export declare class CircleMarkerCustomElement {
    private element;
    private map;
    lat: number;
    lng: number;
    model: any;
    options: CircleMarkerOptions | undefined;
    marker: CircleMarker;
    private disposables;
    constructor(element: Element, map: LeafletMapCustomElement);
    bind(): void;
    attached(): void;
    detached(): void;
    unbind(): void;
    positionChanged(): void;
    optionsChanged(): void;
}
