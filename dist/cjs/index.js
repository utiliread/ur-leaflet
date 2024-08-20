"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeafletMapCustomElement = void 0;
exports.configure = configure;
var aurelia_framework_1 = require("aurelia-framework");
var leaflet_map_1 = require("./leaflet-map");
Object.defineProperty(exports, "LeafletMapCustomElement", { enumerable: true, get: function () { return leaflet_map_1.LeafletMapCustomElement; } });
function configure(frameworkConfiguration) {
    frameworkConfiguration.globalResources([
        aurelia_framework_1.PLATFORM.moduleName("./leaflet-map"),
        aurelia_framework_1.PLATFORM.moduleName("./circle-marker"),
        aurelia_framework_1.PLATFORM.moduleName("./default-marker"),
    ]);
}
//# sourceMappingURL=index.js.map