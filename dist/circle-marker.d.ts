import './circle-marker.css';
import { CircleMarker, CircleMarkerOptions } from 'leaflet';
import { LeafletMapCustomElement } from './leaflet-map';
export declare class CircleMarkerCustomElement {
    private element;
    private map;
    lat: number;
    lng: number;
    model: any;
    options: CircleMarkerOptions;
    click: any;
    marker: CircleMarker;
    private disposables;
    constructor(element: Element, map: LeafletMapCustomElement);
    bind(): void;
    attached(): void;
    detached(): void;
    unbind(): void;
    optionsChanged(): void;
}
