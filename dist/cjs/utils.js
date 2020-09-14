"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = void 0;
function listen(layer, type, handler) {
    layer.on(type, handler);
    return {
        dispose: function () { return layer.off(type, handler); }
    };
}
exports.listen = listen;
//# sourceMappingURL=utils.js.map