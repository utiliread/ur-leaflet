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
exports.CircleMarkerCustomElement = void 0;
var leaflet_1 = require("leaflet");
var aurelia_framework_1 = require("aurelia-framework");
var leaflet_map_1 = require("./leaflet-map");
var lodash_es_1 = require("lodash-es");
var utils_1 = require("./utils");
var CircleMarkerCustomElement = /** @class */ (function () {
    function CircleMarkerCustomElement(element, map) {
        this.element = element;
        this.map = map;
        this.isAttached = false;
        this.isAdded = false;
        this.lat = 0;
        this.lng = 0;
    }
    CircleMarkerCustomElement.prototype.bind = function () {
        this.marker = leaflet_1.circleMarker([this.lat, this.lng], this.options);
    };
    CircleMarkerCustomElement.prototype.attached = function () {
        var _this = this;
        var marker = this.marker;
        var map = this.map.map;
        if (!marker || !map) {
            throw new Error('Element is not bound');
        }
        this.disposables = [
            utils_1.listen(marker, 'click', function (event) {
                var customEvent = aurelia_framework_1.DOM.createCustomEvent('click', {
                    bubbles: true,
                    detail: _this.model
                });
                // Leaflet requires clientX and clientY to be present when dispatching events
                lodash_es_1.extend(customEvent, {
                    clientX: event.originalEvent.clientX,
                    clientY: event.originalEvent.clientY,
                    ctrlKey: event.originalEvent.ctrlKey,
                    altKey: event.originalEvent.altKey
                });
                _this.element.dispatchEvent(customEvent);
                if (_this.popup) {
                    map.openPopup(_this.popup, marker.getLatLng(), _this.popupOptions);
                }
            })
        ];
        if (this.delay !== undefined) {
            this.disposables.push(createTimeout(function () {
                map.addLayer(marker);
                _this.isAdded = true;
            }, Number(this.delay)));
        }
        else {
            map.addLayer(marker);
            this.isAdded = true;
        }
        this.isAttached = true;
    };
    CircleMarkerCustomElement.prototype.detached = function () {
        if (!this.marker) {
            throw new Error('Element is not bound');
        }
        if (this.map && this.map.map && this.isAdded) {
            this.map.map.removeLayer(this.marker);
        }
        for (var _i = 0, _a = this.disposables; _i < _a.length; _i++) {
            var disposable = _a[_i];
            disposable.dispose();
        }
        this.isAttached = false;
    };
    CircleMarkerCustomElement.prototype.unbind = function () {
        if (!this.marker) {
            throw new Error('Element is not bound');
        }
        this.marker.remove();
        delete this.marker;
    };
    CircleMarkerCustomElement.prototype.positionChanged = function () {
        if (this.marker && this.isAttached) {
            this.marker.setLatLng([this.lat, this.lng]);
        }
    };
    CircleMarkerCustomElement.prototype.optionsChanged = function () {
        if (this.marker && this.isAttached && this.options) {
            this.marker.setStyle(this.options);
        }
    };
    CircleMarkerCustomElement.prototype.getLatLng = function () {
        if (!this.marker) {
            throw new Error('Element is not bound');
        }
        return this.marker.getLatLng();
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay, changeHandler: "positionChanged" }),
        __metadata("design:type", Number)
    ], CircleMarkerCustomElement.prototype, "lat", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay, changeHandler: "positionChanged" }),
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
    __decorate([
        aurelia_framework_1.bindable(),
        __metadata("design:type", Object)
    ], CircleMarkerCustomElement.prototype, "delay", void 0);
    __decorate([
        aurelia_framework_1.bindable(),
        __metadata("design:type", String)
    ], CircleMarkerCustomElement.prototype, "popup", void 0);
    __decorate([
        aurelia_framework_1.bindable(),
        __metadata("design:type", Object)
    ], CircleMarkerCustomElement.prototype, "popupOptions", void 0);
    CircleMarkerCustomElement = __decorate([
        aurelia_framework_1.autoinject(),
        aurelia_framework_1.noView(),
        __metadata("design:paramtypes", [Element, leaflet_map_1.LeafletMapCustomElement])
    ], CircleMarkerCustomElement);
    return CircleMarkerCustomElement;
}());
exports.CircleMarkerCustomElement = CircleMarkerCustomElement;
function createTimeout(handler, timeout) {
    var handle = setTimeout(handler, timeout);
    return {
        dispose: function () { return clearTimeout(handle); }
    };
}
//# sourceMappingURL=circle-marker.js.map