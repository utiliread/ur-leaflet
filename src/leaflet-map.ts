import 'leaflet-area-select';
import 'leaflet-fullscreen';
import 'leaflet/dist/leaflet.css';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import './leaflet-map.css';

import { DOM, autoinject, bindable, bindingMode, children } from 'aurelia-framework';
import { LatLngBounds, Map, MapOptions, control, latLngBounds, map, tileLayer } from 'leaflet';

import { AreaSelectedEventDetail } from './area-selected-event';
import { IMarkerCustomElement } from './marker-custom-element';
import { LatLng } from 'leaflet';
import { LeafletApi } from './leaflet-api';

@autoinject()
export class LeafletMapCustomElement {
    private isAttached = false;
    private hasBounds = false;

    element: HTMLElement;

    @bindable()
    options: MapOptions = {
        fullscreenControl: true
    };

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    api?: LeafletApi;

    @bindable()
    fitBounds: boolean | "true" | "false" = true;

    @children('*')
    markers!: IMarkerCustomElement[];

    map?: Map;

    constructor(element: Element) {
        this.element = element as HTMLElement;
    }

    bind() {
        // Create map here so that components that use the api can get the map in their attached() lifecycle hook
        const mapInstance = this.map = map(this.element, this.options);

        this.api = {
            getMap: () => mapInstance,
            goto: this.goto.bind(this)
        };
    }

    attached() {
        const map = this.map;
        if (!map) {
            throw new Error('Element is not bound');
        }
        const baseLayers = {
            "Kort": tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map),
            "Satellit": tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; <a href="http://www.esri.com">Esri</a>'
            })
        };

        control.layers(baseLayers).addTo(map);

        if (this.markers?.length) {
            if (this.fitBounds.toString() === "true") {
                const bounds = latLngBounds(this.markers.map(x => x.getLatLng()).filter(x => !!x));

                if (bounds.isValid()) {
                    map.fitBounds(bounds);
                    this.hasBounds = true;
                }
            }
        }

        map.on('areaselected', event => {
            const bounds = (<any>event).bounds as LatLngBounds;
            const selected = this.markers.filter(x => bounds.contains(x.getLatLng())).map(x => x.model);

            const detail: AreaSelectedEventDetail = {
                bounds: bounds,
                selected: selected
            };

            const areaSelectedEvent = DOM.createCustomEvent('area-selected', {
                bubbles: true,
                detail: detail
            });

            this.element.dispatchEvent(areaSelectedEvent);
        });

        this.isAttached = true;
    }

    detached() {
        if (!this.map) {
            throw new Error('Element is not bound');
        }

        this.map.remove();
        delete this.map;
        delete this.api;
        this.isAttached = false;
    }

    markersChanged() {
        if (this.map && this.isAttached) {
            if (this.fitBounds.toString() === "true") {
                const bounds = latLngBounds(this.markers.map(x => x.getLatLng()).filter(x => !!x));

                if (bounds.isValid() && (!this.hasBounds || !this.map.getBounds().equals(bounds))) {
                    this.map.fitBounds(bounds);
                    this.hasBounds = true;
                }
            }
        }
    }

    goto(center: LatLng, zoom?: number) {
        if (this.map) {
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
}