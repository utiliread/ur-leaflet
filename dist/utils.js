export function listen(layer, type, handler) {
    layer.on(type, handler);
    return {
        dispose: () => layer.off(type, handler)
    };
}
