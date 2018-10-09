import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

import { AreaSelectedEvent } from './area-selected-event';
import { LeafletApi } from './leaflet-api';
import { MarkerClickEvent } from './marker-click-event';

export function configure(frameworkConfiguration: FrameworkConfiguration) {
    frameworkConfiguration.globalResources([
        PLATFORM.moduleName('./leaflet-map'),
        PLATFORM.moduleName('./circle-marker'),
        PLATFORM.moduleName('./default-marker')
    ]);
}

export { MarkerClickEvent, AreaSelectedEvent, LeafletApi };