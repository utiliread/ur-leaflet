import './circle-marker.css';

import { CircleMarker, CircleMarkerOptions, Layer, LeafletEvent, LeafletMouseEvent, PathOptions, circleMarker } from 'leaflet';
import { DOM, Disposable, autoinject, bindable, bindingMode, noView } from 'aurelia-framework';

import { LeafletMapCustomElement } from './leaflet-map';
import { extend } from 'lodash';
import { listen } from './utils';

@autoinject()
@noView()
export class CircleMarkerCustomElement {
    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: 'positionChanged' })
    lat: number = 0;

    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: 'positionChanged' })
    lng: number = 0;

    @bindable()
    model: any;

    @bindable()
    options: CircleMarkerOptions | undefined;

    marker!: CircleMarker;
    private disposables!: Disposable[];

    constructor(private element: Element, private map: LeafletMapCustomElement) {
    }

    bind() {
        this.marker = circleMarker([this.lat, this.lng], this.options);
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
        delete this.marker;
    }

    positionChanged() {
        if (this.marker) {
            this.marker.setLatLng([this.lat, this.lng]);
        }
    }

    optionsChanged() {
        if (this.options) {
            this.marker.setStyle(this.options);
        }
    }
}