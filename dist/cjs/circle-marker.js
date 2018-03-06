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
require("./circle-marker.css");
var leaflet_1 = require("leaflet");
var aurelia_framework_1 = require("aurelia-framework");
var leaflet_map_1 = require("./leaflet-map");
var lodash_1 = require("lodash");
var utils_1 = require("./utils");
var CircleMarkerCustomElement = /** @class */ (function () {
    function CircleMarkerCustomElement(element, map) {
        this.element = element;
        this.map = map;
        this.lat = 0;
        this.lng = 0;
    }
    CircleMarkerCustomElement.prototype.bind = function () {
        this.marker = leaflet_1.circleMarker([this.lat, this.lng], this.options);
    };
    CircleMarkerCustomElement.prototype.attached = function () {
        var _this = this;
        this.map.map.addLayer(this.marker);
        this.disposables = [
            utils_1.listen(this.marker, 'click', function (event) {
                var customEvent = aurelia_framework_1.DOM.createCustomEvent('click', {
                    bubbles: true,
                    detail: _this.model
                });
                // Leaflet requires clientX and clientY to be present when dispatching events
                lodash_1.extend(customEvent, {
                    clientX: event.originalEvent.clientX,
                    clientY: event.originalEvent.clientY
                });
                _this.element.dispatchEvent(customEvent);
            })
        ];
    };
    CircleMarkerCustomElement.prototype.detached = function () {
        if (this.map && this.map.map) {
            this.map.map.removeLayer(this.marker);
        }
        for (var _i = 0, _a = this.disposables; _i < _a.length; _i++) {
            var disposable = _a[_i];
            disposable.dispose();
        }
    };
    CircleMarkerCustomElement.prototype.unbind = function () {
        this.marker.remove();
        delete this.marker;
    };
    CircleMarkerCustomElement.prototype.positionChanged = function () {
        if (this.marker) {
            this.marker.setLatLng([this.lat, this.lng]);
        }
    };
    CircleMarkerCustomElement.prototype.optionsChanged = function () {
        if (this.options) {
            this.marker.setStyle(this.options);
        }
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay, changeHandler: 'positionChanged' }),
        __metadata("design:type", Number)
    ], CircleMarkerCustomElement.prototype, "lat", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay, changeHandler: 'positionChanged' }),
        __metadata("design:type", Number)
    ], CircleMarkerCustomElement.prototype, "lng", void 0);
    __decorate([
        aurelia_framework_1.bindable(),
        __metadata("design:type", Object)
    ], CircleMarkerCustomElement.prototype, "model", void 0);
    __decorate([
        aurelia_framework_1.bindable(),
        __metadata("design:type", Object)
    ], CircleMarkerCustomElement.prototype, "options", void 0);
    CircleMarkerCustomElement = __decorate([
        aurelia_framework_1.autoinject(),
        aurelia_framework_1.noView(),
        __metadata("design:paramtypes", [Element, leaflet_map_1.LeafletMapCustomElement])
    ], CircleMarkerCustomElement);
    return CircleMarkerCustomElement;
}());
exports.CircleMarkerCustomElement = CircleMarkerCustomElement;
//# sourceMappingURL=circle-marker.js.map