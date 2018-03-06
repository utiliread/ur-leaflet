var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import './default-marker.css';
import { DOM, autoinject, bindable, bindingMode, noView } from 'aurelia-framework';
import { Icon, marker } from 'leaflet';
import { LeafletMapCustomElement } from './leaflet-map';
import { extend } from 'lodash';
import { listen } from './utils';
// https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-299044745
var defaultIconPrototype = Icon.Default.prototype;
delete defaultIconPrototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
var DefaultMarkerCustomElement = /** @class */ (function () {
    function DefaultMarkerCustomElement(element, map) {
        this.element = element;
        this.map = map;
        this.lat = 0;
        this.lng = 0;
    }
    DefaultMarkerCustomElement.prototype.bind = function () {
        this.marker = marker([this.lat, this.lng], this.options);
    };
    DefaultMarkerCustomElement.prototype.attached = function () {
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
            }),
            listen(this.marker, 'drag', function (event) {
                if (_this.options && _this.options.draggable) {
                    var position = event.latlng;
                    _this.lat = position.lat;
                    _this.lng = position.lng;
                }
            })
        ];
    };
    DefaultMarkerCustomElement.prototype.detached = function () {
        if (this.map && this.map.map) {
            this.map.map.removeLayer(this.marker);
        }
        for (var _i = 0, _a = this.disposables; _i < _a.length; _i++) {
            var disposable = _a[_i];
            disposable.dispose();
        }
    };
    DefaultMarkerCustomElement.prototype.unbind = function () {
        this.marker.remove();
        delete this.marker;
    };
    DefaultMarkerCustomElement.prototype.positionChanged = function () {
        if (this.marker) {
            this.marker.setLatLng([this.lat, this.lng]);
        }
    };
    DefaultMarkerCustomElement.prototype.optionsChanged = function () {
        if (this.marker && this.marker.dragging && this.options) {
            if (this.options.draggable) {
                this.marker.dragging.enable();
            }
            else {
                this.marker.dragging.disable();
            }
        }
    };
    __decorate([
        bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: 'positionChanged' }),
        __metadata("design:type", Number)
    ], DefaultMarkerCustomElement.prototype, "lat", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: 'positionChanged' }),
        __metadata("design:type", Number)
    ], DefaultMarkerCustomElement.prototype, "lng", void 0);
    __decorate([
        bindable(),
        __metadata("design:type", Object)
    ], DefaultMarkerCustomElement.prototype, "model", void 0);
    __decorate([
        bindable(),
        __metadata("design:type", Object)
    ], DefaultMarkerCustomElement.prototype, "options", void 0);
    DefaultMarkerCustomElement = __decorate([
        autoinject(),
        noView(),
        __metadata("design:paramtypes", [Element, LeafletMapCustomElement])
    ], DefaultMarkerCustomElement);
    return DefaultMarkerCustomElement;
}());
export { DefaultMarkerCustomElement };
//# sourceMappingURL=default-marker.js.map