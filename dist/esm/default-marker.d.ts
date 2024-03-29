import "./default-marker.css";
import { MarkerOptions } from "leaflet";
import { IMarkerCustomElement } from "./marker-custom-element";
import { LeafletMapCustomElement } from "./leaflet-map";
export declare class DefaultMarkerCustomElement implements IMarkerCustomElement {
    private element;
    private map;
    private marker?;
    private disposables;
    private isAttached;
    lat: number;
    lng: number;
    point?: GeoJSON.Point;
    model: any;
    options?: MarkerOptions;
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
