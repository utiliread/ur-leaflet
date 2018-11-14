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
require("leaflet/dist/leaflet.css");
require("leaflet-fullscreen/dist/leaflet.fullscreen.css");
require("./leaflet-map.css");
var aurelia_framework_1 = require("aurelia-framework");
var leaflet_1 = require("leaflet");
var LeafletMapCustomElement = /** @class */ (function () {
    function LeafletMapCustomElement(element) {
        this.isAttached = false;
        this.hasBounds = false;
        this.options = {
            fullscreenControl: true
        };
        this.element = element;
    }
    LeafletMapCustomElement.prototype.bind = function () {
        var _this = this;
        // Create map here so that components that use the api can get the map in their attached() lifecycle hook
        this.map = leaflet_1.map(this.element, this.options);
        this.api = {
            getMap: function () { return _this.map; },
            goto: this.goto.bind(this)
        };
    };
    LeafletMapCustomElement.prototype.attached = function () {
        var _this = this;
        var baseLayers = {
            "Kort": leaflet_1.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map),
            "Satellit": leaflet_1.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; <a href="http://www.esri.com">Esri</a>'
            })
        };
        leaflet_1.control.layers(baseLayers).addTo(this.map);
        if (this.markers) {
            var bounds = leaflet_1.latLngBounds(this.markers.map(function (x) { return x.getLatLng(); }).filter(function (x) { return !!x; }));
            if (bounds.isValid()) {
                this.map.fitBounds(bounds);
                this.hasBounds = true;
            }
        }
        this.map.on('areaselected', function (event) {
            var bounds = event.bounds;
            var selected = _this.markers.filter(function (x) { return bounds.contains(x.getLatLng()); }).map(function (x) { return x.model; });
            var detail = {
                bounds: bounds,
                selected: selected
            };
            var areaSelectedEvent = aurelia_framework_1.DOM.createCustomEvent('area-selected', {
                bubbles: true,
                detail: detail
            });
            _this.element.dispatchEvent(areaSelectedEvent);
        });
        this.isAttached = true;
    };
    LeafletMapCustomElement.prototype.detached = function () {
        this.map.remove();
        delete this.map;
        this.isAttached = false;
    };
    LeafletMapCustomElement.prototype.markersChanged = function () {
        if (this.isAttached) {
            var bounds = leaflet_1.latLngBounds(this.markers.map(function (x) { return x.getLatLng(); }).filter(function (x) { return !!x; }));
            if (bounds.isValid() && (!this.hasBounds || !this.map.getBounds().equals(bounds))) {
                this.map.fitBounds(bounds);
                this.hasBounds = true;
            }
        }
    };
    LeafletMapCustomElement.prototype.goto = function (center, zoom) {
        if (zoom) {
            this.map.setView(center, zoom, {
                animate: true,
                duration: 1
            });
        }
        else {
            this.map.panTo(center);
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
        __metadata("design:paramtypes", [Element])
    ], LeafletMapCustomElement);
    return LeafletMapCustomElement;
}());
exports.LeafletMapCustomElement = LeafletMapCustomElement;
//# sourceMappingURL=leaflet-map.js.map