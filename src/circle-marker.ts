import { CircleMarker, CircleMarkerOptions, LeafletMouseEvent, circleMarker } from 'leaflet';
import { DOM, Disposable, autoinject, bindable, bindingMode, noView } from 'aurelia-framework';

import { IMarkerCustomElement } from './marker-custom-element';
import { LeafletMapCustomElement } from './leaflet-map';
import { extend } from 'lodash-es';
import { listen } from './utils';

@autoinject()
@noView()
export class CircleMarkerCustomElement implements IMarkerCustomElement {
    private marker!: CircleMarker;
    private disposables!: Disposable[];
    private isAttached = false;
    private isAdded = false;
    
    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: 'positionChanged' })
    lat: number = 0;

    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: 'positionChanged' })
    lng: number = 0;

    @bindable()
    model: any;

    @bindable()
    options: CircleMarkerOptions | undefined;

    @bindable()
    delay: number | string | undefined = undefined;

    constructor(private element: Element, private map: LeafletMapCustomElement) {
    }

    bind() {
        this.marker = circleMarker([this.lat, this.lng], this.options);
    }

    attached() {
        this.disposables = [
            listen(this.marker, 'click', (event: LeafletMouseEvent) => {
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
            })
        ];

        if (this.delay !== undefined) {
            this.disposables.push(createTimeout(() => {
                this.map.map.addLayer(this.marker);
                this.isAdded = true;
            }, Number(this.delay)));
        }
        else {
            this.map.map.addLayer(this.marker);
            this.isAdded = true;
        }

        this.isAttached = true;
    }

    detached() {
        if (this.map && this.map.map && this.isAdded) {
            this.map.map.removeLayer(this.marker);
        }

        for (const disposable of this.disposables) {
            disposable.dispose();
        }

        this.isAttached = false;
    }

    unbind() {
        this.marker.remove();
        delete this.marker;
    }

    positionChanged() {
        if (this.isAttached) {
            this.marker.setLatLng([this.lat, this.lng]);
        }
    }

    optionsChanged() {
        if (this.isAttached && this.options) {
            this.marker.setStyle(this.options);
        }
    }

    getLatLng() {
        return this.marker.getLatLng();
    }
}

function createTimeout(handler: Function, timeout: number) : Disposable {
    const handle = setTimeout(handler, timeout);

    return {
        dispose: () => clearTimeout(handle)
    };
}