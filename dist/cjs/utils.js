"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = listen;
function listen(layer, type, handler) {
    layer.on(type, handler);
    return {
        dispose: function () { return layer.off(type, handler); },
    };
}
//# sourceMappingURL=utils.js.map