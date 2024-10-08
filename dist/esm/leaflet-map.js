var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import "leaflet-area-select";
import "leaflet-fullscreen";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "./leaflet-map.css";
import { DOM, autoinject, bindable, bindingMode, children, } from "aurelia-framework";
import { control, latLngBounds, map, tileLayer, } from "leaflet";
import { isMarkerCustomElement, } from "./marker-custom-element";
var LeafletMapCustomElement = /** @class */ (function () {
    function LeafletMapCustomElement(element) {
        this.isAttached = false;
        this.hasBounds = false;
        this.options = {
            fullscreenControl: true,
        };
        this.fitBounds = true;
        this.element = element;
    }
    LeafletMapCustomElement.prototype.bind = function () {
        // Create map here so that components that use the api can get the map in their attached() lifecycle hook
        var mapInstance = (this.map = map(this.element, this.options));
        this.api = {
            getMap: function () { return mapInstance; },
            goto: this.goto.bind(this),
        };
    };
    LeafletMapCustomElement.prototype.attached = function () {
        var _this = this;
        var map = this.map;
        if (!map) {
            throw new Error("Element is not bound");
        }
        var baseLayers = {
            Kort: tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map),
            Satellit: tileLayer("//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
                attribution: '&copy; <a href="http://www.esri.com">Esri</a>',
            }),
        };
        control.layers(baseLayers).addTo(map);
        if (this.markers) {
            if (this.fitBounds.toString() === "true") {
                var latlngs = this.markers
                    .filter(isMarkerCustomElement)
                    .map(function (x) { return x.getLatLng(); })
                    .filter(function (x) { return !!x; });
                if (latlngs.length) {
                    var bounds = latLngBounds(latlngs);
                    if (bounds.isValid()) {
                        map.fitBounds(bounds);
                        this.hasBounds = true;
                    }
                }
            }
        }
        map.on("selectarea:selected", function (event) {
            var bounds = event.bounds;
            var selected = _this.getMarkers()
                .filter(function (x) { return bounds.contains(x.getLatLng()); })
                .map(function (x) { return x.model; });
            var detail = {
                bounds: bounds,
                selected: selected,
            };
            var areaSelectedEvent = DOM.createCustomEvent("area-selected", {
                bubbles: true,
                detail: detail,
            });
            _this.element.dispatchEvent(areaSelectedEvent);
        });
        this.isAttached = true;
    };
    LeafletMapCustomElement.prototype.detached = function () {
        if (!this.map) {
            throw new Error("Element is not bound");
        }
        this.map.remove();
        delete this.map;
        delete this.api;
        this.isAttached = false;
    };
    LeafletMapCustomElement.prototype.markersChanged = function () {
        if (this.map && this.isAttached) {
            if (this.fitBounds.toString() === "true") {
                var bounds = latLngBounds(this.getMarkers()
                    .map(function (x) { return x.getLatLng(); })
                    .filter(function (x) { return !!x; }));
                if (bounds.isValid() &&
                    (!this.hasBounds || !this.map.getBounds().equals(bounds))) {
                    this.map.fitBounds(bounds);
                    this.hasBounds = true;
                }
            }
        }
    };
    LeafletMapCustomElement.prototype.getMarkers = function () {
        return this.markers.filter(isMarkerCustomElement);
    };
    LeafletMapCustomElement.prototype.goto = function (center, zoom) {
        if (this.map) {
            if (zoom) {
                this.map.setView(center, zoom, {
                    animate: true,
                    duration: 1,
                });
            }
            else {
                this.map.panTo(center);
            }
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
        bindable(),
        __metadata("design:type", Object)
    ], LeafletMapCustomElement.prototype, "fitBounds", void 0);
    __decorate([
        children("*"),
        __metadata("design:type", Array)
    ], LeafletMapCustomElement.prototype, "markers", void 0);
    LeafletMapCustomElement = __decorate([
        autoinject(),
        __metadata("design:paramtypes", [Element])
    ], LeafletMapCustomElement);
    return LeafletMapCustomElement;
}());
export { LeafletMapCustomElement };
//# sourceMappingURL=leaflet-map.js.map