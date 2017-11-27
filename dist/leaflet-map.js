var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import 'leaflet-area-select';
import 'leaflet-fullscreen';
import './leaflet-map.css';
import { DOM, autoinject, bindable, bindingMode, children, inlineView } from 'aurelia-framework';
import { control, latLngBounds, map, tileLayer } from 'leaflet';
var LeafletMapCustomElement = /** @class */ (function () {
    function LeafletMapCustomElement(element) {
        this.options = {
            fullscreenControl: true
        };
        this.wasFittedToBounds = false;
        this.element = element;
    }
    LeafletMapCustomElement.prototype.bind = function () {
        this.api = {
            goto: this.goto.bind(this)
        };
    };
    LeafletMapCustomElement.prototype.attached = function () {
        var _this = this;
        this.map = map(this.element, this.options);
        var baseLayers = {
            "Kort": tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map),
            "Satellit": tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; <a href="http://www.esri.com">Esri</a>'
            })
        };
        control.layers(baseLayers).addTo(this.map);
        if (this.bounds) {
            this.map.fitBounds(this.bounds);
            this.wasFittedToBounds = true;
        }
        this.map.on('areaselected', function (event) {
            var bounds = event.bounds;
            var selected = _this.markers.filter(function (x) { return bounds.contains(x.marker.getLatLng()); }).map(function (x) { return x.model; });
            var detail = {
                bounds: bounds,
                selected: selected
            };
            var areaSelectedEvent = DOM.createCustomEvent('area-selected', {
                bubbles: true,
                detail: detail
            });
            _this.element.dispatchEvent(areaSelectedEvent);
        });
    };
    LeafletMapCustomElement.prototype.detached = function () {
        this.map.remove();
        this.map = null;
    };
    LeafletMapCustomElement.prototype.markersChanged = function () {
        this.bounds = latLngBounds(this.markers.map(function (x) { return x.marker.getLatLng(); }));
        if (this.bounds && this.map && !this.wasFittedToBounds) {
            this.map.fitBounds(this.bounds);
            this.wasFittedToBounds = true;
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
        bindable(),
        __metadata("design:type", Object)
    ], LeafletMapCustomElement.prototype, "options", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], LeafletMapCustomElement.prototype, "api", void 0);
    __decorate([
        children('*'),
        __metadata("design:type", Array)
    ], LeafletMapCustomElement.prototype, "markers", void 0);
    LeafletMapCustomElement = __decorate([
        autoinject(),
        inlineView('<template><slot></slot></template>'),
        __metadata("design:paramtypes", [Element])
    ], LeafletMapCustomElement);
    return LeafletMapCustomElement;
}());
export { LeafletMapCustomElement };
