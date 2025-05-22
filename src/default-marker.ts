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
import {
  Icon,
  Layer,
  LeafletMouseEvent,
  Marker,
  MarkerOptions,
  latLng,
  marker,
} from "leaflet";

import { extend } from "lodash-es";
import { listen } from "./utils";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-299044745
const defaultIconPrototype: any = Icon.Default.prototype;
delete defaultIconPrototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.default ?? iconRetinaUrl,
  iconUrl: iconUrl.default ?? iconUrl,
  shadowUrl: shadowUrl.default ?? shadowUrl,
});

@customElement("deafault-marker")
@view('<template class="leaflet-element leaflet-marker"></template>')
export class DefaultMarkerCustomElement implements ILeafletMarkerCustomElement {
  private parent?: ILeafletCustomElement;
  private marker?: Marker;
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
  options?: MarkerOptions;

  constructor(@inject(Element) private element: ILeafletElement) {}

  bind() {
    if (this.point) {
      this.lng = this.point.coordinates[0];
      this.lat = this.point.coordinates[1];
    }
    this.marker = marker([this.lat, this.lng], this.options);
  }

  unbind() {
    delete this.marker;
  }

  attached() {
    this.parent = this.element.parentElement!.au.controller.viewModel;

    this.parent.addLayer(this.marker!);

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
      }),
      listen(this.marker!, "drag", (event: LeafletMouseEvent) => {
        if (this.options && this.options.draggable) {
          const position = event.latlng;
          this.lat = position.lat;
          this.lng = position.lng;
          this.point = {
            type: "Point",
            coordinates: [this.lng, this.lat],
          };
        }
      }),
    ];
  }

  detached() {
    this.parent!.removeLayer(this.marker!);

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

    this.marker!.setLatLng(latLng(this.lat, this.lng));
  }

  optionsChanged() {
    if (!this.parent) {
      return;
    }

    if (this.marker!.dragging && this.options) {
      if (this.options.draggable) {
        this.marker!.dragging.enable();
      } else {
        this.marker!.dragging.disable();
      }
    }
  }

  toGeoJSON(precision?: number | false | undefined) {
    return this.marker?.toGeoJSON(precision) ?? null;
  }

  getLatLng() {
    return this.marker?.getLatLng() ?? null;
  }
}
