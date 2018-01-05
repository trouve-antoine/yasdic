"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResourceInfos {
    constructor(resourceName, dependencies) {
        this.name = resourceName;
        this.dependencies = new Set(dependencies);
        this.resolved = new Set();
    }
    isResolved() {
        return this.resolved.size === this.dependencies.size;
    }
    dependsOn(dependency) {
        return this.dependencies.has(dependency.name);
    }
    resolve(dependency) {
        if (!this.dependsOn(dependency)) {
            return false;
        }
        this.resolved.add(dependency.name);
        return true;
    }
}
class DependencyQueue {
    constructor() {
        this._allByName = {};
        this._resolvedByName = {};
        this._waitingByName = {};
    }
    push(resourceName, dependencies) {
        const resource = new ResourceInfos(resourceName, dependencies);
        if (this._isThereAnyCyclesFromResource(resource)) {
            throw new Error("Dependency cycle from " + resourceName);
        }
        this._initializeDependenciesForResource(resource);
        if (resource.isResolved()) {
            this._waitingByName[resourceName] = resource;
        }
        this._allByName[resourceName] = resource;
    }
    _resolveAllDependenciesToResource(resource) {
        for (var dependeeName in this._allByName) {
            const dependee = this._allByName[dependeeName];
            const wasDependent = dependee.resolve(resource);
            const justResolved = wasDependent && dependee.isResolved();
            if (justResolved) {
                this._waitingByName[dependeeName] = dependee;
            }
        }
    }
    peekAllWaiting() {
        return Object.keys(this._waitingByName);
    }
    resolve(resourceName) {
        if (resourceName in this._resolvedByName) {
            return false;
        }
        if (!(resourceName in this._waitingByName)) {
            throw new Error("The resource is not waiting: " + resourceName);
        }
        const resource = this._allByName[resourceName];
        if (!resource) {
            throw new Error("No resource with name: " + resourceName);
        }
        if (!resource.isResolved()) {
            throw new Error("The resource is not resolved: " + resourceName);
        }
        this._resolvedByName[resourceName] = resource;
        delete this._waitingByName[resourceName];
        this._resolveAllDependenciesToResource(resource);
        return true;
    }
    _isThereAnyCyclesFromResource(resource) {
        return false; /* TODO */
    }
    _initializeDependenciesForResource(resource) {
        resource.dependencies.forEach(dependency => {
            if (dependency in this._resolvedByName) {
                resource.resolved.add(dependency);
            }
        });
    }
}
exports.DependencyQueue = DependencyQueue;
exports.default = DependencyQueue;
//# sourceMappingURL=DependencyQueue.js.map