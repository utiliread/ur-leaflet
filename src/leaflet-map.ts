import "leaflet-area-select";
import "leaflet-fullscreen";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "./leaflet-map.css";

import {
  DOM,
  TaskQueue,
  autoinject,
  bindable,
  inject,
} from "aurelia-framework";
import {
  LatLngBounds,
  Layer,
  Map,
  MapOptions,
  control,
  featureGroup,
  map,
  tileLayer,
} from "leaflet";

import { AreaSelectedEventDetail } from "./area-selected-event";
import {
  ILeafletCustomElement,
  ILeafletElement,
  ILeafetMarkerCustomElement,
} from "./element";
import { LatLng } from "leaflet";

export class LeafletMapCustomElement implements ILeafletCustomElement {
  map?: Map;
  private isAttached = false;

  @bindable()
  options: MapOptions = {
    fullscreenControl: true,
  };

  @bindable()
  fitBounds: boolean | "true" | "false" = true;

  private layers: Layer[] = [];
  private fitBoundsScheduled = false;
  private hasBounds = false;

  constructor(
    @inject(Element) private element: HTMLElement,
    @inject(TaskQueue) private taskQueue: TaskQueue,
  ) {
    this.element = element as HTMLElement;
  }

  // This is the first bind call - all children are bound after this
  bind() {
    // Create map here so that components that use the api can get the map in their attached() lifecycle hook
    this.map = map(this.element, this.options);
  }

  unbind() {
    delete this.map;
  }

  attached() {
    const baseLayers = {
      Kort: tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.map!),
      Satellit: tileLayer(
        "//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: '&copy; <a href="http://www.esri.com">Esri</a>',
        },
      ),
    };

    control.layers(baseLayers).addTo(this.map!);

    this.map!.on("selectarea:selected", (event) => {
      const bounds = (<any>event).bounds as LatLngBounds;

      const selected = this.getMarkers()
        .filter((x) => {
          const ll = x.getLatLng();
          return ll && bounds.contains(ll);
        })
        .map((x) => x.model);

      const detail: AreaSelectedEventDetail = {
        bounds: bounds,
        selected: selected,
      };

      const areaSelectedEvent = DOM.createCustomEvent("area-selected", {
        bubbles: true,
        detail: detail,
      });

      this.element.dispatchEvent(areaSelectedEvent);
    });

    this.isAttached = true;
  }

  detached() {
    this.map!.remove();
    this.isAttached = false;
  }

  addLayer(layer: Layer, defer?: boolean): void {
    if (defer) {
      this.taskQueue.queueMicroTask(() => {
        if (!this.map) {
          return;
        }
        layer.addTo(this.map);
      });
    } else if (this.map) {
      layer.addTo(this.map);
    }
    this.layers.push(layer);

    if (this.fitBounds.toString() === "true" && !this.fitBoundsScheduled) {
      this.taskQueue.queueTask(() => {
        if (this.map && this.isAttached && this.layers.length > 0) {
          const bounds = featureGroup(this.layers).getBounds();
          if (bounds.isValid()) {
            if (!this.hasBounds) {
              this.map.fitBounds(bounds);
              this.hasBounds = true;
            } else if (!this.map.getBounds().equals(bounds)) {
              this.map.flyToBounds(bounds);
            }
          }
        }
        this.fitBoundsScheduled = false;
      });
      this.fitBoundsScheduled = true;
    }
  }

  getMarkers() {
    const elements: ILeafletElement<ILeafetMarkerCustomElement>[] = Array.from(
      this.element.querySelectorAll(".leaflet-element.leaflet-marker"),
    );
    return elements.map((x) => x.au.controller.viewModel);
  }

  removeLayer(layer: Layer): void {
    this.map?.removeLayer(layer);
    const index = this.layers.indexOf(layer);
    if (index > -1) {
      this.layers.splice(index, 1);
    }
  }

  goto(center: LatLng, zoom?: number) {
    if (this.map) {
      if (zoom) {
        this.map.setView(center, zoom, {
          animate: true,
          duration: 1,
        });
      } else {
        this.map.panTo(center);
      }
    }
  }
}
