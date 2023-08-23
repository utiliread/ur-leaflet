"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configure = void 0;
var aurelia_framework_1 = require("aurelia-framework");
function configure(frameworkConfiguration) {
    frameworkConfiguration.globalResources([
        aurelia_framework_1.PLATFORM.moduleName("./leaflet-map"),
        aurelia_framework_1.PLATFORM.moduleName("./circle-marker"),
        aurelia_framework_1.PLATFORM.moduleName("./default-marker"),
    ]);
}
exports.configure = configure;
//# sourceMappingURL=index.js.map