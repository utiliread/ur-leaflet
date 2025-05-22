import { CircleMarkerCustomElement } from "./circle-marker";
import { DefaultMarkerCustomElement } from "./default-marker";
import { FeatureGroupCustomElement } from "./feature-group";
import { FrameworkConfiguration } from "aurelia-framework";
import { LeafletMapCustomElement } from "./leaflet-map";

export type { AreaSelectedEvent } from "./area-selected-event";
export type { MarkerClickEvent } from "./marker-click-event";
export type { ILeafletMarkerCustomElement } from "./element";

export function configure(frameworkConfiguration: FrameworkConfiguration) {
  frameworkConfiguration.globalResources([
    LeafletMapCustomElement,
    CircleMarkerCustomElement,
    DefaultMarkerCustomElement,
    FeatureGroupCustomElement,
  ]);
}

export { LeafletMapCustomElement as LeafletMap };
