"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMarkerCustomElement = isMarkerCustomElement;
function isMarkerCustomElement(x) {
    return (x === null || x === void 0 ? void 0 : x.getLatLng) && typeof x.getLatLng === "function";
}
//# sourceMappingURL=marker-custom-element.js.map