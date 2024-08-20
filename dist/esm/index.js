import { PLATFORM } from "aurelia-framework";
import { LeafletMapCustomElement } from "./leaflet-map";
export function configure(frameworkConfiguration) {
    frameworkConfiguration.globalResources([
        PLATFORM.moduleName("./leaflet-map"),
        PLATFORM.moduleName("./circle-marker"),
        PLATFORM.moduleName("./default-marker"),
    ]);
}
export { LeafletMapCustomElement, };
//# sourceMappingURL=index.js.map