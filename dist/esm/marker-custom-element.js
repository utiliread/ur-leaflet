export function isMarkerCustomElement(x) {
    return (x === null || x === void 0 ? void 0 : x.getLatLng) && typeof x.getLatLng === "function";
}
//# sourceMappingURL=marker-custom-element.js.map