import { Disposable } from "aurelia-framework";
import { Layer } from "leaflet";

export function listen(
  layer: Layer,
  type: string,
  handler: (event: any) => void,
): Disposable {
  layer.on(type, handler);

  return {
    dispose: () => layer.off(type, handler),
  };
}
