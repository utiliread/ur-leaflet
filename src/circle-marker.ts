import "./circle-marker.css";

import {
  CircleMarker,
  CircleMarkerOptions,
  LeafletMouseEvent,
  PopupOptions,
  Tooltip,
  TooltipOptions,
  circleMarker,
  latLng,
  tooltip,
} from "leaflet";
import {
  DOM,
  Disposable,
  autoinject,
  bindable,
  bindingMode,
  noView,
} from "aurelia-framework";

import { IMarkerCustomElement } from "./marker-custom-element";
import { LeafletMapCustomElement } from "./leaflet-map";
import { extend } from "lodash-es";
import { listen } from "./utils";

@autoinject()
@noView()
export class CircleMarkerCustomElement implements IMarkerCustomElement {
  private marker?: CircleMarker;
  private tooltip?: Tooltip;
  private disposables!: Disposable[];
  private isAttached = false;
  private isAdded = false;

  @bindable({
    defaultBindingMode: bindingMode.twoWay,
    changeHandler: "positionChanged",
  })
  lat: number = 0;

  @bindable({
    defaultBindingMode: bindingMode.twoWay,
    changeHandler: "positionChanged",
  })
  lng: number = 0;

  @bindable({
    defaultBindingMode: bindingMode.twoWay,
    changeHandler: "pointChanged",
  })
  point?: GeoJSON.Point;

  @bindable()
  model: any;

  @bindable()
  options?: CircleMarkerOptions;

  @bindable()
  delay?: number | string;

  @bindable()
  popup?: string;

  @bindable()
  text?: string;

  @bindable()
  popupOptions?: PopupOptions;

  @bindable()
  tooltipOptions?: TooltipOptions;

  constructor(
    private element: Element,
    private map: LeafletMapCustomElement
  ) {}

  bind() {
    if (this.point) {
      this.lng = this.point.coordinates[0];
      this.lat = this.point.coordinates[1];
    }
    this.marker = circleMarker([this.lat, this.lng], this.options);
  }

  attached() {
    const marker = this.marker;
    const map = this.map.map;
    if (!marker || !map) {
      throw new Error("Element is not bound");
    }

    this.disposables = [
      listen(marker, "click", (event: LeafletMouseEvent) => {
        const customEvent = DOM.createCustomEvent("click", {
          bubbles: true,
          detail: this.model,
        });

        // Leaflet requires clientX and clientY to be present when dispatching events
        extend(customEvent, {
          clientX: event.originalEvent.clientX,
          clientY: event.originalEvent.clientY,
          ctrlKey: event.originalEvent.ctrlKey,
          altKey: event.originalEvent.altKey,
        });

        this.element.dispatchEvent(customEvent);

        if (this.popup) {
          map.openPopup(this.popup, marker.getLatLng(), this.popupOptions);
        }
      }),
    ];

    const addMarker = () => {
      map.addLayer(marker);
      if (this.text || this.tooltipOptions) {
        this.tooltip = tooltip(
          this.tooltipOptions ?? {
            permanent: true,
            direction: "center",
            className: "marker-text",
          }
        );

        if (this.text) {
          this.tooltip.setContent(this.text);
        }

        this.tooltip.setLatLng([this.lat, this.lng]).addTo(map);
      }
      this.isAdded = true;
    };

    if (this.delay !== undefined) {
      this.disposables.push(createTimeout(addMarker, Number(this.delay)));
    } else {
      addMarker();
    }

    this.isAttached = true;
  }

  detached() {
    if (!this.marker) {
      throw new Error("Element is not bound");
    }

    if (this.map && this.map.map && this.isAdded) {
      this.map.map.removeLayer(this.marker);
    }

    for (const disposable of this.disposables) {
      disposable.dispose();
    }

    this.isAttached = false;
  }

  unbind() {
    if (!this.marker) {
      throw new Error("Element is not bound");
    }

    this.marker.remove();
    delete this.marker;

    this.tooltip?.remove();
    delete this.tooltip;
  }

  pointChanged() {
    if (this.point) {
      this.lng = this.point.coordinates[0];
      this.lat = this.point.coordinates[1];
    }
  }

  positionChanged() {
    if (this.marker && this.isAttached) {
      const pos = latLng(this.lat, this.lng);
      this.marker.setLatLng(pos);
      this.tooltip?.setLatLng(pos);
    }
  }

  optionsChanged() {
    if (this.marker && this.isAttached && this.options) {
      this.marker.setStyle(this.options);
    }
  }

  textChanged() {
    if (!this.isAttached) {
      return;
    }
    if (this.text) {
      if (this.tooltip) {
        this.tooltip.setContent(this.text);
      } else {
        this.tooltip = tooltip(
          this.tooltipOptions ?? {
            permanent: true,
            direction: "center",
            className: "marker-text",
          }
        )
          .setContent(this.text)
          .setLatLng([this.lat, this.lng])
          .addTo(this.map.map!);
      }
    } else if (this.tooltip) {
      this.tooltip.remove();
      delete this.tooltip;
    }
  }

  tooltipOptionsChanged() {
    if (!this.isAttached || !this.tooltip) {
      return;
    }
    this.tooltip.options.content = this.tooltipOptions?.content;
    this.tooltip.options.className = this.tooltipOptions?.className;
  }

  toGeoJSON(precision?: number | false | undefined) {
    if (!this.marker) {
      throw new Error("Element is not bound");
    }
    return this.marker.toGeoJSON(precision);
  }

  getLatLng() {
    if (!this.marker) {
      throw new Error("Element is not bound");
    }
    return this.marker.getLatLng();
  }
}

function createTimeout(handler: Function, timeout: number): Disposable {
  const handle = setTimeout(handler, timeout);

  return { dispose: () => clearTimeout(handle) };
}
