import 'leaflet-area-select';
import 'leaflet-fullscreen';
import './leaflet-map.css';

import { DOM, autoinject, bindable, bindingMode, children, inlineView } from 'aurelia-framework';
import { LatLngBounds, Map, MapOptions, Marker, control, latLngBounds, map, tileLayer } from 'leaflet';

import { LatLng } from 'leaflet';
import { LeafletApi } from './leaflet-api';

@autoinject()
@inlineView('<template><slot></slot></template>')
export class LeafletMapCustomElement {
    element: HTMLElement;
    map: Map;

    @bindable()
    options: MapOptions = {
        fullscreenControl: true
    };

    @bindable({defaultBindingMode: bindingMode.twoWay})
    api: LeafletApi;

    @children('*')
    markers: {marker: Marker, model: any}[];

    bounds: LatLngBounds;

    private wasFittedToBounds = false;

    constructor(element: Element) {
        this.element = element as HTMLElement;
    }

    bind() {
        this.api = {
            goto: this.goto.bind(this)
        };
    }

    attached() {
        this.map = map(this.element, this.options);

        let baseLayers = {
            "Kort": tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map),
            "Satellit": tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; <a href="http://www.esri.com">Esri</a>'
            })
        };

        control.layers(baseLayers).addTo(this.map);

        if (this.bounds) {
            this.map.fitBounds(this.bounds);
            this.wasFittedToBounds = true;
        }

        this.map.on('areaselected', event => {
            let bounds = (<any>event).bounds as LatLngBounds;
            let selected = this.markers.filter(x => bounds.contains(x.marker.getLatLng())).map(x => x.model);

            let detail = {
                bounds: bounds,
                selected: selected
            };

            let areaSelectedEvent = DOM.createCustomEvent('area-selected', {
                bubbles: true,
                detail: detail
            });

            this.element.dispatchEvent(areaSelectedEvent);
        });
    }

    detached() {
        this.map.remove();
        this.map = null;
    }

    markersChanged() {
        this.bounds = latLngBounds(this.markers.map(x => x.marker.getLatLng()));

        if (this.bounds && this.map && !this.wasFittedToBounds) {
            this.map.fitBounds(this.bounds);
            this.wasFittedToBounds = true;
        }
    }

    goto(center: LatLng, zoom?: number) {
        if (zoom) {
            this.map.setView(center, zoom, {
                animate: true,
                duration: 1
            });
        }
        else {
            this.map.panTo(center);
        }
    }
}