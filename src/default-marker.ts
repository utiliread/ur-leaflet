import './default-marker.css';

import { DOM, Disposable, autoinject, bindable, bindingMode, noView } from 'aurelia-framework';
import { Icon, Layer, LeafletEvent, LeafletMouseEvent, Marker, MarkerOptions, PathOptions, marker } from 'leaflet';

import { IMarkerCustomElement } from './marker-custom-element';
import { LeafletMapCustomElement } from './leaflet-map';
import { extend } from 'lodash';
import { listen } from './utils';

// https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-299044745
let defaultIconPrototype: any = Icon.Default.prototype;
delete defaultIconPrototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

@autoinject()
@noView()
export class DefaultMarkerCustomElement implements IMarkerCustomElement {
    private marker!: Marker;
    private disposables!: Disposable[];
    private isAttached = false;

    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: 'positionChanged' })
    lat: number = 0;

    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: 'positionChanged' })
    lng: number = 0;

    @bindable()
    model: any;

    @bindable()
    options: MarkerOptions | undefined;

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

        this.isAttached = true;
    }

    detached() {
        if (this.map && this.map.map) {
            this.map.map.removeLayer(this.marker);
        }

        for (let disposable of this.disposables) {
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
        if (this.isAttached && this.marker.dragging && this.options) {
            if (this.options.draggable) {
                this.marker.dragging.enable();
            }
            else {
                this.marker.dragging.disable();
            }
        }
    }

    getLatLng() {
        return this.marker.getLatLng();
    }
}