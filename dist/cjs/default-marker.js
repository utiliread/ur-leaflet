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
const aurelia_framework_1 = require("aurelia-framework");
const leaflet_1 = require("leaflet");
const leaflet_map_1 = require("./leaflet-map");
const lodash_1 = require("lodash");
const utils_1 = require("./utils");
// https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-299044745
let defaultIconPrototype = leaflet_1.Icon.Default.prototype;
delete defaultIconPrototype._getIconUrl;
leaflet_1.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
let DefaultMarkerCustomElement = class DefaultMarkerCustomElement {
    constructor(element, map) {
        this.element = element;
        this.map = map;
        this.lat = 0;
        this.lng = 0;
    }
    bind() {
        this.marker = leaflet_1.marker([this.lat, this.lng], this.options);
    }
    attached() {
        this.map.map.addLayer(this.marker);
        this.disposables = [
            utils_1.listen(this.marker, 'click', (event) => {
                let customEvent = aurelia_framework_1.DOM.createCustomEvent('click', {
                    bubbles: true,
                    detail: this.model
                });
                // Leaflet requires clientX and clientY to be present when dispatching events
                lodash_1.extend(customEvent, {
                    clientX: event.originalEvent.clientX,
                    clientY: event.originalEvent.clientY
                });
                this.element.dispatchEvent(customEvent);
            }),
            utils_1.listen(this.marker, 'drag', (event) => {
                if (this.options && this.options.draggable) {
                    let position = event.latlng;
                    this.lat = position.lat;
                    this.lng = position.lng;
                }
            })
        ];
    }
    detached() {
        if (this.map && this.map.map) {
            this.map.map.removeLayer(this.marker);
        }
        for (let disposable of this.disposables) {
            disposable.dispose();
        }
    }
    unbind() {
        this.marker.remove();
        delete this.marker;
    }
    positionChanged() {
        if (this.marker) {
            this.marker.setLatLng([this.lat, this.lng]);
        }
    }
    optionsChanged() {
        if (this.marker && this.marker.dragging && this.options) {
            if (this.options.draggable) {
                this.marker.dragging.enable();
            }
            else {
                this.marker.dragging.disable();
            }
        }
    }
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
exports.DefaultMarkerCustomElement = DefaultMarkerCustomElement;
//# sourceMappingURL=default-marker.js.map