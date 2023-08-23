import { PLATFORM } from "aurelia-framework";
export function configure(frameworkConfiguration) {
    frameworkConfiguration.globalResources([
        PLATFORM.moduleName("./leaflet-map"),
        PLATFORM.moduleName("./circle-marker"),
        PLATFORM.moduleName("./default-marker"),
    ]);
}
//# sourceMappingURL=index.js.map