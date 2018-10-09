export interface MarkerClickEvent<T = any> extends CustomEvent<T> {
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    altKey: boolean;
}