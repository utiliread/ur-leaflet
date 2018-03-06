var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import './circle-marker.css';
import { circleMarker } from 'leaflet';
import { DOM, autoinject, bindable, bindingMode, noView } from 'aurelia-framework';
import { LeafletMapCustomElement } from './leaflet-map';
import { extend } from 'lodash';
import { listen } from './utils';
var CircleMarkerCustomElement = /** @class */ (function () {
    function CircleMarkerCustomElement(element, map) {
        this.element = element;
        this.map = map;
        this.lat = 0;
        this.lng = 0;
    }
    CircleMarkerCustomElement.prototype.bind = function () {
        this.marker = circleMarker([this.lat, this.lng], this.options);
    };
    CircleMarkerCustomElement.prototype.attached = function () {
        var _this = this;
        this.map.map.addLayer(this.marker);
        this.disposables = [
            listen(this.marker, 'click', function (event) {
                var customEvent = DOM.createCustomEvent('click', {
                    bubbles: true,
                    detail: _this.model
                });
                // Leaflet requires clientX and clientY to be present when dispatching events
                extend(customEvent, {
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
        bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: 'positionChanged' }),
        __metadata("design:type", Number)
    ], CircleMarkerCustomElement.prototype, "lat", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: 'positionChanged' }),
        __metadata("design:type", Number)
    ], CircleMarkerCustomElement.prototype, "lng", void 0);
    __decorate([
        bindable(),
        __metadata("design:type", Object)
    ], CircleMarkerCustomElement.prototype, "model", void 0);
    __decorate([
        bindable(),
        __metadata("design:type", Object)
    ], CircleMarkerCustomElement.prototype, "options", void 0);
    CircleMarkerCustomElement = __decorate([
        autoinject(),
        noView(),
        __metadata("design:paramtypes", [Element, LeafletMapCustomElement])
    ], CircleMarkerCustomElement);
    return CircleMarkerCustomElement;
}());
export { CircleMarkerCustomElement };
//# sourceMappingURL=circle-marker.js.map