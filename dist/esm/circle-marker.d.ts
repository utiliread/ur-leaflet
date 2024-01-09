import { CircleMarkerOptions, PopupOptions } from "leaflet";
import { IMarkerCustomElement } from "./marker-custom-element";
import { LeafletMapCustomElement } from "./leaflet-map";
export declare class CircleMarkerCustomElement implements IMarkerCustomElement {
    private element;
    private map;
    private marker?;
    private disposables;
    private isAttached;
    private isAdded;
    lat: number;
    lng: number;
    point?: GeoJSON.Point;
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
    pointChanged(): void;
    positionChanged(): void;
    optionsChanged(): void;
    toGeoJSON(precision?: number | false | undefined): import("geojson").Feature<import("geojson").Point, any>;
    getLatLng(): import("leaflet").LatLng;
}
