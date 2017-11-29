import './default-marker.css';

import { DOM, Disposable, autoinject, bindable, bindingMode, noView } from 'aurelia-framework';
import { Layer, LeafletEvent, LeafletMouseEvent, Marker, MarkerOptions, PathOptions, marker } from 'leaflet';

import { LeafletMapCustomElement } from './leaflet-map';
import { extend } from 'lodash';
import { listen } from './utils';

@autoinject()
@noView()
export class DefaultMarkerCustomElement {
    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: 'positionChanged' })
    lat: number;

    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: 'positionChanged' })
    lng: number;

    @bindable()
    model: any;

    @bindable()
    options: MarkerOptions;

    @bindable()
    click: any

    marker: Marker;
    private disposables: Disposable[];

    constructor(private element: Element, private map: LeafletMapCustomElement) {
    }

    bind() {
        this.marker = marker([this.lat, this.lng], this.options);
    }

    attached() {
        this.map.map.addLayer(this.marker);

        this.disposables = [
            listen(this.marker, 'click', (event: LeafletMouseEvent) => {
                let customEvent = DOM.createCustomEvent('click', {
                    bubbles: true,
                    detail: this.model
                });

                // Leaflet requires clientX and clientY to be present when dispatching events
                extend(customEvent, {
                    clientX: event.originalEvent.clientX,
                    clientY: event.originalEvent.clientY
                });

                this.element.dispatchEvent(customEvent);
            }),
            listen(this.marker, 'drag', (event: LeafletMouseEvent) => {
                if (this.options && this.options.draggable) {
                    let position = event.latlng;
                    this.lat = position.lat;
                    this.lng = position.lng;
                }
            })
        ];
    }

    detached() {
        if (this.map && this.map.map) {
            this.map.map.removeLayer(this.marker);
        }

        for (let disposable of this.disposables) {
            disposable.dispose();
        }
    }

    unbind() {
        this.marker.remove();
        this.marker = null;
    }

    positionChanged() {
        if (this.marker) {
            this.marker.setLatLng([this.lat, this.lng]);
        }
    }

    optionsChanged() {
        if (this.options) {
            if (this.options.draggable) {
                this.marker.dragging.enable();
            }
            else {
                this.marker.dragging.disable();
            }
        }
    }
}