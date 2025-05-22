import { FeatureGroup, Layer, featureGroup } from "leaflet";
import { ILeafletCustomElement, ILeafletElement } from "./element";
import {
  bindable,
  children,
  customElement,
  inject,
  view,
} from "aurelia-framework";

@customElement("feature-group")
@view('<template class="leaflet-element"><slot></slot></template>')
export class FeatureGroupCustomElement implements ILeafletCustomElement {
  private parent?: ILeafletCustomElement;
  private featureGroup?: FeatureGroup;
  private added = false;

  @bindable()
  name?: string;

  @bindable()
  defer: boolean | "true" | "false" = true;

  @children("*")
  private children?: ILeafletCustomElement[];
  constructor(@inject(Element) private element: ILeafletElement) {}

  bind() {
    this.featureGroup = featureGroup();
  }

  unbind() {
    delete this.featureGroup;
  }

  attached() {
    this.parent = this.element.parentElement!.au.controller.viewModel;

    if (this.hidden.toString() === "false") {
      const defer = this.defer.toString() === "true";
      this.parent.addLayer(this.featureGroup!, defer);
      this.added = true;
    }
  }

  detached() {
    if (this.added) {
      this.parent!.removeLayer(this.featureGroup!);
      this.added = false;
    }
  }

  hiddenChanged() {
    if (!this.parent) {
      return;
    }
    if (this.hidden.toString() === "false") {
      this.parent.addLayer(this.featureGroup!);
      this.added = true;
    } else if (this.added) {
      this.parent.removeLayer(this.featureGroup!);
      this.added = false;
    }
  }

  addLayer(layer: Layer): void {
    this.featureGroup?.addLayer(layer);
  }

  removeLayer(layer: Layer): void {
    this.featureGroup?.removeLayer(layer);
  }

  getMarkers() {
    if (!this.children || this.hidden) {
      return [];
    }
    return this.children.map((x) => x.getMarkers()).flat();
  }
}
