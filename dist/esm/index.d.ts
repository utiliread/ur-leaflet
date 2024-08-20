import { FrameworkConfiguration } from "aurelia-framework";
import { AreaSelectedEvent } from "./area-selected-event";
import { IMarkerCustomElement } from "./marker-custom-element";
import { LeafletApi } from "./leaflet-api";
import { LeafletMapCustomElement } from "./leaflet-map";
import { MarkerClickEvent } from "./marker-click-event";
export declare function configure(frameworkConfiguration: FrameworkConfiguration): void;
export { MarkerClickEvent, AreaSelectedEvent, LeafletApi, LeafletMapCustomElement, IMarkerCustomElement, };
