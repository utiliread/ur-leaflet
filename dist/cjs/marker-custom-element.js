"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMarkerCustomElement = void 0;
function isMarkerCustomElement(x) {
    return (x === null || x === void 0 ? void 0 : x.getLatLng) && typeof x.getLatLng === "function";
}
exports.isMarkerCustomElement = isMarkerCustomElement;
//# sourceMappingURL=marker-custom-element.js.map