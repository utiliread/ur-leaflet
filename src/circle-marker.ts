import "./circle-marker.css";

import {
  CircleMarker,
  CircleMarkerOptions,
  Layer,
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
  bindable,
  bindingMode,
  customElement,
  inject,
  view,
} from "aurelia-framework";
import {
  ILeafletCustomElement,
  ILeafletElement,
  ILeafletMarkerCustomElement,
} from "./element";

import { LeafletMapCustomElement } from "./leaflet-map";
import { extend } from "lodash-es";
import { listen } from "./utils";

@customElement("circle-marker")
@view('<template class="leaflet-element leaflet-marker"></template>')
export class CircleMarkerCustomElement implements ILeafletMarkerCustomElement {
  private parent?: ILeafletCustomElement;
  private marker?: CircleMarker;
  private tooltip?: Tooltip;
  private disposables!: Disposable[];

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
  popup?: string;

  @bindable()
  popupOptions?: PopupOptions;

  @bindable()
  text?: string;

  @bindable()
  tooltipOptions?: TooltipOptions;

  constructor(
    @inject(Element) private element: ILeafletElement,
    @inject(LeafletMapCustomElement) private map: LeafletMapCustomElement,
  ) {}

  bind() {
    if (this.point) {
      this.lng = this.point.coordinates[0];
      this.lat = this.point.coordinates[1];
    }
    this.marker = circleMarker([this.lat, this.lng], this.options);
  }

  unbind() {
    delete this.marker;
    delete this.tooltip;
  }

  attached() {
    this.parent = this.element.parentElement!.au.controller.viewModel;

    this.parent.addLayer(this.marker!);
    if (this.text || this.tooltipOptions) {
      this.tooltip = tooltip(
        this.tooltipOptions ?? {
          permanent: true,
          direction: "center",
          className: "marker-text",
        },
      );

      if (this.text) {
        this.tooltip.setContent(this.text);
      }

      this.tooltip.setLatLng([this.lat, this.lng]); //.addTo(map);
      this.parent.addLayer(this.tooltip);
    }

    this.disposables = [
      listen(this.marker!, "click", (event: LeafletMouseEvent) => {
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

        if (this.map.map && this.marker && this.popup) {
          this.map.map.openPopup(
            this.popup,
            this.marker.getLatLng(),
            this.popupOptions,
          );
        }
      }),
    ];
  }

  detached() {
    this.parent!.removeLayer(this.marker!);
    if (this.tooltip) {
      this.parent!.removeLayer(this.tooltip);
    }

    for (const disposable of this.disposables) {
      disposable.dispose();
    }

    delete this.parent;
  }

  addLayer(layer: Layer): void {
    throw new Error("Invalid operation");
  }

  removeLayer(layer: Layer): void {
    throw new Error("Invalid operation");
  }

  getMarkers(): ILeafletMarkerCustomElement[] {
    return [this];
  }

  pointChanged() {
    if (this.point) {
      this.lng = this.point.coordinates[0];
      this.lat = this.point.coordinates[1];
    }
  }

  positionChanged() {
    if (!this.parent) {
      return;
    }

    const pos = latLng(this.lat, this.lng);
    this.marker!.setLatLng(pos);
    this.tooltip?.setLatLng(pos);
  }

  optionsChanged() {
    if (!this.parent) {
      return;
    }

    if (this.options) {
      this.marker!.setStyle(this.options);
    }
  }

  textChanged() {
    if (!this.parent) {
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
          },
        )
          .setContent(this.text)
          .setLatLng([this.lat, this.lng])
          .addTo(this.map.map!);
      }
    } else if (this.tooltip) {
      this.parent.removeLayer(this.tooltip);
      delete this.tooltip;
    }
  }

  tooltipOptionsChanged() {
    if (!this.parent) {
      return;
    }

    if (this.tooltip) {
      this.tooltip.options.content = this.tooltipOptions?.content;
      this.tooltip.options.className = this.tooltipOptions?.className;
    }
  }

  toGeoJSON(precision?: number | false | undefined) {
    return this.marker?.toGeoJSON(precision) ?? null;
  }

  getLatLng() {
    return this.marker?.getLatLng() ?? null;
  }
}
