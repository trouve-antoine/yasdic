export declare class DependencyQueue {
    constructor();
    private _allByName;
    private _resolvedByName;
    private _waitingByName;
    push(resourceName: string, dependencies: string[]): void;
    private _resolveAllDependenciesToResource(resource);
    peekAllWaiting(): string[];
    resolve(resourceName: string): boolean;
    private _isThereAnyCyclesFromResource(resource);
    private _initializeDependenciesForResource(resource);
}
export default DependencyQueue;
