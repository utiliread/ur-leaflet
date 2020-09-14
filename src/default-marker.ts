import './default-marker.css';

import { DOM, Disposable, autoinject, bindable, bindingMode, noView } from 'aurelia-framework';
import { Icon, LeafletMouseEvent, Marker, MarkerOptions, marker } from 'leaflet';

import { IMarkerCustomElement } from './marker-custom-element';
import { LeafletMapCustomElement } from './leaflet-map';
import { extend } from 'lodash-es';
import { listen } from './utils';

// https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-299044745
const defaultIconPrototype: any = Icon.Default.prototype;
delete defaultIconPrototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png')?.default,
    iconUrl: require('leaflet/dist/images/marker-icon.png')?.default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')?.default,
});

@autoinject()
@noView()
export class DefaultMarkerCustomElement implements IMarkerCustomElement {
    private marker?: Marker;
    private disposables!: Disposable[];
    private isAttached = false;

    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: "positionChanged" })
    lat: number = 0;

    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: "positionChanged" })
    lng: number = 0;

    @bindable()
    model: any;

    @bindable()
    options?: MarkerOptions;

    constructor(private element: Element, private map: LeafletMapCustomElement) {
    }

    bind() {
        this.marker = marker([this.lat, this.lng], this.options);
    }

    attached() {
        const marker = this.marker;
        const map = this.map.map;
        if (!marker || !map) {
            throw new Error('Element is not bound');
        }

        map.addLayer(marker);

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
            }),
            listen(marker, 'drag', (event: LeafletMouseEvent) => {
                if (this.options && this.options.draggable) {
                    const position = event.latlng;
                    this.lat = position.lat;
                    this.lng = position.lng;
                }
            })
        ];

        this.isAttached = true;
    }

    detached() {
        if (!this.marker) {
            throw new Error('Element is not bound');
        }

        if (this.map && this.map.map) {
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

    positionChanged() {
        if (this.marker && this.isAttached) {
            this.marker.setLatLng([this.lat, this.lng]);
        }
    }

    optionsChanged() {
        if (this.marker && this.isAttached && this.marker.dragging && this.options) {
            if (this.options.draggable) {
                this.marker.dragging.enable();
            }
            else {
                this.marker.dragging.disable();
            }
        }
    }

    getLatLng() {
        if (!this.marker) {
            throw new Error('Element is not bound');
        }
        return this.marker.getLatLng();
    }
}