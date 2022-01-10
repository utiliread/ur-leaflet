export function listen(layer, type, handler) {
    layer.on(type, handler);
    return {
        dispose: function () { return layer.off(type, handler); }
    };
}
//# sourceMappingURL=utils.js.map