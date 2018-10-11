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
require("./default-marker.css");
var aurelia_framework_1 = require("aurelia-framework");
var leaflet_1 = require("leaflet");
var leaflet_map_1 = require("./leaflet-map");
var lodash_es_1 = require("lodash-es");
var utils_1 = require("./utils");
// https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-299044745
var defaultIconPrototype = leaflet_1.Icon.Default.prototype;
delete defaultIconPrototype._getIconUrl;
leaflet_1.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
var DefaultMarkerCustomElement = /** @class */ (function () {
    function DefaultMarkerCustomElement(element, map) {
        this.element = element;
        this.map = map;
        this.isAttached = false;
        this.lat = 0;
        this.lng = 0;
    }
    DefaultMarkerCustomElement.prototype.bind = function () {
        this.marker = leaflet_1.marker([this.lat, this.lng], this.options);
    };
    DefaultMarkerCustomElement.prototype.attached = function () {
        var _this = this;
        this.map.map.addLayer(this.marker);
        this.disposables = [
            utils_1.listen(this.marker, 'click', function (event) {
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
            }),
            utils_1.listen(this.marker, 'drag', function (event) {
                if (_this.options && _this.options.draggable) {
                    var position = event.latlng;
                    _this.lat = position.lat;
                    _this.lng = position.lng;
                }
            })
        ];
        this.isAttached = true;
    };
    DefaultMarkerCustomElement.prototype.detached = function () {
        if (this.map && this.map.map) {
            this.map.map.removeLayer(this.marker);
        }
        for (var _i = 0, _a = this.disposables; _i < _a.length; _i++) {
            var disposable = _a[_i];
            disposable.dispose();
        }
        this.isAttached = false;
    };
    DefaultMarkerCustomElement.prototype.unbind = function () {
        this.marker.remove();
        delete this.marker;
    };
    DefaultMarkerCustomElement.prototype.positionChanged = function () {
        if (this.isAttached) {
            this.marker.setLatLng([this.lat, this.lng]);
        }
    };
    DefaultMarkerCustomElement.prototype.optionsChanged = function () {
        if (this.isAttached && this.marker.dragging && this.options) {
            if (this.options.draggable) {
                this.marker.dragging.enable();
            }
            else {
                this.marker.dragging.disable();
            }
        }
    };
    DefaultMarkerCustomElement.prototype.getLatLng = function () {
        return this.marker.getLatLng();
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay, changeHandler: 'positionChanged' }),
        __metadata("design:type", Number)
    ], DefaultMarkerCustomElement.prototype, "lat", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay, changeHandler: 'positionChanged' }),
        __metadata("design:type", Number)
    ], DefaultMarkerCustomElement.prototype, "lng", void 0);
    __decorate([
        aurelia_framework_1.bindable(),
        __metadata("design:type", Object)
    ], DefaultMarkerCustomElement.prototype, "model", void 0);
    __decorate([
        aurelia_framework_1.bindable(),
        __metadata("design:type", Object)
    ], DefaultMarkerCustomElement.prototype, "options", void 0);
    DefaultMarkerCustomElement = __decorate([
        aurelia_framework_1.autoinject(),
        aurelia_framework_1.noView(),
        __metadata("design:paramtypes", [Element, leaflet_map_1.LeafletMapCustomElement])
    ], DefaultMarkerCustomElement);
    return DefaultMarkerCustomElement;
}());
exports.DefaultMarkerCustomElement = DefaultMarkerCustomElement;
//# sourceMappingURL=default-marker.js.map