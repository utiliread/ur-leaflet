import './default-marker.css';
import { Marker, MarkerOptions } from 'leaflet';
import { LeafletMapCustomElement } from './leaflet-map';
export declare class DefaultMarkerCustomElement {
    private element;
    private map;
    lat: number;
    lng: number;
    model: any;
    options: MarkerOptions | undefined;
    marker: Marker;
    private disposables;
    constructor(element: Element, map: LeafletMapCustomElement);
    bind(): void;
    attached(): void;
    detached(): void;
    unbind(): void;
    positionChanged(): void;
    optionsChanged(): void;
}