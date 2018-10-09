import 'leaflet-area-select';
import 'leaflet-fullscreen';
import './leaflet-map.css';

import { DOM, autoinject, bindable, bindingMode, children, inlineView } from 'aurelia-framework';
import { LatLngBounds, Map, MapOptions, Marker, control, latLngBounds, map, tileLayer } from 'leaflet';

import { AreaSelectedEventDetail } from './area-selected-event';
import { IMarkerCustomElement } from './marker-custom-element';
import { LatLng } from 'leaflet';
import { LeafletApi } from './leaflet-api';

@autoinject()
export class LeafletMapCustomElement {
    element: HTMLElement;

    @bindable()
    options: MapOptions = {
        fullscreenControl: true
    };

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    api!: LeafletApi;

    @children('*')
    markers!: IMarkerCustomElement[];

    map!: Map;

    constructor(element: Element) {
        this.element = element as HTMLElement;
    }

    bind() {
        this.api = {
            getMap: () => this.map,
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

        if (this.markers) {
            const bounds = latLngBounds(this.markers.map(x => x.getLatLng()).filter(x => !!x));

            if (bounds.isValid()) {
                this.map.fitBounds(bounds);
            }
        }

        this.map.on('areaselected', event => {
            let bounds = (<any>event).bounds as LatLngBounds;
            let selected = this.markers.filter(x => bounds.contains(x.getLatLng())).map(x => x.model);

            let detail: AreaSelectedEventDetail = {
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
        delete this.map;
    }

    markersChanged() {
        const bounds = latLngBounds(this.markers.map(x => x.getLatLng()).filter(x => !!x));

        if (this.map && bounds.isValid() && !this.map.getBounds().equals(bounds)) {
            this.map.fitBounds(bounds);
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