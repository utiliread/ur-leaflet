"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("leaflet-area-select");
require("leaflet-fullscreen");
require("./leaflet-map.css");
const aurelia_framework_1 = require("aurelia-framework");
const leaflet_1 = require("leaflet");
let LeafletMapCustomElement = class LeafletMapCustomElement {
    constructor(element) {
        this.options = {
            fullscreenControl: true
        };
        this.bounds = undefined;
        this.element = element;
    }
    bind() {
        this.api = {
            goto: this.goto.bind(this)
        };
    }
    attached() {
        this.map = leaflet_1.map(this.element, this.options);
        let baseLayers = {
            "Kort": leaflet_1.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map),
            "Satellit": leaflet_1.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; <a href="http://www.esri.com">Esri</a>'
            })
        };
        leaflet_1.control.layers(baseLayers).addTo(this.map);
        if (this.bounds) {
            this.map.fitBounds(this.bounds);
        }
        this.map.on('areaselected', event => {
            let bounds = event.bounds;
            let selected = this.markers.filter(x => bounds.contains(x.marker.getLatLng())).map(x => x.model);
            let detail = {
                bounds: bounds,
                selected: selected
            };
            let areaSelectedEvent = aurelia_framework_1.DOM.createCustomEvent('area-selected', {
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
        this.bounds = leaflet_1.latLngBounds(this.markers.map(x => x.marker.getLatLng()));
        if (this.bounds && this.map) {
            this.map.fitBounds(this.bounds);
        }
    }
    goto(center, zoom) {
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
};
__decorate([
    aurelia_framework_1.bindable(),
    __metadata("design:type", Object)
], LeafletMapCustomElement.prototype, "options", void 0);
__decorate([
    aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
    __metadata("design:type", Object)
], LeafletMapCustomElement.prototype, "api", void 0);
__decorate([
    aurelia_framework_1.children('*'),
    __metadata("design:type", Array)
], LeafletMapCustomElement.prototype, "markers", void 0);
LeafletMapCustomElement = __decorate([
    aurelia_framework_1.autoinject(),
    aurelia_framework_1.inlineView('<template><slot></slot></template>'),
    __metadata("design:paramtypes", [Element])
], LeafletMapCustomElement);
exports.LeafletMapCustomElement = LeafletMapCustomElement;
//# sourceMappingURL=leaflet-map.js.map