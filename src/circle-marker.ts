import { CircleMarker, CircleMarkerOptions, LeafletMouseEvent, circleMarker, PopupOptions } from 'leaflet';
import { DOM, Disposable, autoinject, bindable, bindingMode, noView } from 'aurelia-framework';

import { IMarkerCustomElement } from './marker-custom-element';
import { LeafletMapCustomElement } from './leaflet-map';
import { extend } from 'lodash-es';
import { listen } from './utils';

@autoinject()
@noView()
export class CircleMarkerCustomElement implements IMarkerCustomElement {
    private marker?: CircleMarker;
    private disposables!: Disposable[];
    private isAttached = false;
    private isAdded = false;

    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: "positionChanged" })
    lat: number = 0;

    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: "positionChanged" })
    lng: number = 0;

    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: "pointChanged" })
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
    popupOptions?: PopupOptions;

    constructor(private element: Element, private map: LeafletMapCustomElement) {
    }

    bind() {
        this.marker = circleMarker([this.lat, this.lng], this.options);
    }

    attached() {
        const marker = this.marker;
        const map = this.map.map;
        if (!marker || !map) {
            throw new Error('Element is not bound');
        }

        this.disposables = [
            listen(marker, 'click', (event: LeafletMouseEvent) => {
                const customEvent = DOM.createCustomEvent('click', {
                    bubbles: true,
                    detail: this.model
                });

                // Leaflet requires clientX and clientY to be present when dispatching events
                extend(customEvent, {
                    clientX: event.originalEvent.clientX,
                    clientY: event.originalEvent.clientY,
                    ctrlKey: event.originalEvent.ctrlKey,
                    altKey: event.originalEvent.altKey
                });

                this.element.dispatchEvent(customEvent);

                if (this.popup) {
                    map.openPopup(this.popup, marker.getLatLng(), this.popupOptions);
                }
            })
        ];

        if (this.delay !== undefined) {
            this.disposables.push(createTimeout(() => {
                map.addLayer(marker);
                this.isAdded = true;
            }, Number(this.delay)));
        }
        else {
            map.addLayer(marker);
            this.isAdded = true;
        }

        this.isAttached = true;
    }

    detached() {
        if (!this.marker) {
            throw new Error('Element is not bound');
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
            throw new Error('Element is not bound');
        }

        this.marker.remove();
        delete this.marker;
    }

    pointChanged() {
        if (this.point) {
            this.lng = this.point.coordinates[0];
            this.lat = this.point.coordinates[1];
        }
    }

    positionChanged() {
        if (this.marker && this.isAttached) {
            this.marker.setLatLng([this.lat, this.lng]);
        }
    }

    optionsChanged() {
        if (this.marker && this.isAttached && this.options) {
            this.marker.setStyle(this.options);
        }
    }

    getLatLng() {
        if (!this.marker) {
            throw new Error('Element is not bound');
        }
        return this.marker.getLatLng();
    }
}

function createTimeout(handler: Function, timeout: number): Disposable {
    const handle = setTimeout(handler, timeout);

    return {
        dispose: () => clearTimeout(handle)
    };
}