import { LatLng, Layer } from "leaflet";

export interface ILeafletElement<VM = ILeafletCustomElement>
  extends HTMLElement {
  parentElement: ILeafletElement | null;
  au: { controller: { viewModel: VM } };
}

export interface ILeafletCustomElement {
  addLayer(layer: Layer, defer?: boolean): void;
  removeLayer(layer: Layer): void;
}

export interface ILeafletMarkerCustomElement<P = any>
  extends ILeafletCustomElement {
  toGeoJSON(
    precision?: number | false,
  ): GeoJSON.Feature<GeoJSON.Point, P> | null;
  getLatLng: () => LatLng | null;
  model: any;
}
