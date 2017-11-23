import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export function configure(frameworkConfiguration: FrameworkConfiguration) {
    frameworkConfiguration.globalResources([
        PLATFORM.moduleName('./leaflet-map'),
        PLATFORM.moduleName('./circle-marker'),
        PLATFORM.moduleName('./default-marker')
    ]);
}

export { AreaSelectedEvent } from './area-selected-event';
export { LeafletApi } from './leaflet-api';