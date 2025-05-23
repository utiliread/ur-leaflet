import "leaflet-area-select";
import "leaflet-fullscreen";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "./leaflet-map.css";

import template from "./leaflet-map.html";
import {
  DOM,
  TaskQueue,
  bindable,
  children,
  customElement,
  inject,
  view,
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
  ILeafletMarkerCustomElement,
} from "./element";
import { LatLng } from "leaflet";

@customElement("leaflet-map")
@view(template)
export class LeafletMapCustomElement implements ILeafletCustomElement {
  map?: Map;

  @bindable()
  options: MapOptions = {
    fullscreenControl: true,
  };

  @bindable()
  fitBounds: boolean | "true" | "false" = true;

  private layers?: Layer[];
  private fitBoundsScheduled = false;
  private hasBounds = false;

  @children(".leaflet-element")
  private children?: ILeafletCustomElement[];

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

  // This is the first unbind call - all children are unbound after this
  unbind() {
    delete this.map;
  }

  // This is the first attached call - all children are attached after this
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

    this.layers = [];
  }

  // This is the first detached call - all children are detached after this
  detached() {
    this.map!.remove();

    // Delete layers now, before all children are detached,
    // allows us to have a "fast path" for removing layers
    // when the entire map is removed
    delete this.layers;
  }

  addLayer(layer: Layer, defer?: boolean): void {
    if (!this.layers) {
      return; // Ignore; not attached anymore
    }

    if (defer) {
      this.taskQueue.queueMicroTask(() => {
        if (!this.map) {
          return;
        }
        layer.addTo(this.map);
      });
    } else {
      layer.addTo(this.map!);
    }

    this.layers.push(layer);

    if (this.fitBounds.toString() === "true" && !this.fitBoundsScheduled) {
      this.taskQueue.queueTask(() => {
        if (this.map && this.layers && this.layers.length > 0) {
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

  removeLayer(layer: Layer): void {
    if (!this.layers) {
      return; // Ignore; not attached anymore
    }

    this.map?.removeLayer(layer);
    const index = this.layers.indexOf(layer);
    if (index > -1) {
      this.layers.splice(index, 1);
    }
  }

  getMarkers() {
    if (!this.children) {
      return [];
    }
    return this.children.map((x) => x.getMarkers()).flat();
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
