class ResourceInfos {
  name: string
  dependencies: Set<string>
  resolved: Set<string>
  constructor(resourceName: string, dependencies: string[]) {
    this.name = resourceName;
    this.dependencies = new Set(dependencies);
    this.resolved = new Set();
  }
  isResolved(): boolean {
    return this.resolved.size === this.dependencies.size;
  }
  dependsOn(dependency: ResourceInfos): boolean {
    return this.dependencies.has(dependency.name);
  }
  resolve(dependency: ResourceInfos): boolean {
    if(!this.dependsOn(dependency)) { return false; }
    this.resolved.add(dependency.name);
    return true;
  }
}

type ResourceInfoDictionary = { [resourceName: string]: ResourceInfos }

export class DependencyQueue {
  constructor() {}

  private _allByName: ResourceInfoDictionary = {};
  private _resolvedByName: ResourceInfoDictionary = {};
  private _waitingByName: ResourceInfoDictionary = {};

  push(resourceName: string, dependencies: string[]): void {
    const resource = new ResourceInfos(resourceName, dependencies);
    
    if(this._isThereAnyCyclesFromResource(resource)) {
      throw new Error("Dependency cycle from " + resourceName)
    }
    
    this._initializeDependenciesForResource(resource);
    
    if (resource.isResolved()) { this._waitingByName[resourceName] = resource; }

    this._allByName[resourceName] = resource;
  }

  private _resolveAllDependenciesToResource(resource: ResourceInfos): void {
    for (var dependeeName in this._allByName) {
      const dependee = this._allByName[dependeeName];
      const wasDependent = dependee.resolve(resource);
      const justResolved = wasDependent && dependee.isResolved();

      if (justResolved){ this._waitingByName[dependeeName] = dependee; }
    }
  }

  peekAllWaiting(): string[] {
    return Object.keys(this._waitingByName)
  }

  resolve(resourceName: string): boolean {
    if(resourceName in this._resolvedByName) { return false; }

    if (!(resourceName in this._waitingByName)) { throw new Error("The resource is not waiting: " + resourceName); }
    
    const resource = this._allByName[resourceName];
    if(!resource) { throw new Error("No resource with name: " + resourceName); }
    
    if (!resource.isResolved()) { throw new Error("The resource is not resolved: " + resourceName); }

    this._resolvedByName[resourceName] = resource;
    delete this._waitingByName[resourceName];

    this._resolveAllDependenciesToResource(resource);

    return true;
  }

  private _isThereAnyCyclesFromResource(resource: ResourceInfos): boolean {
    return false; /* TODO */
  }

  private _initializeDependenciesForResource(resource: ResourceInfos): void {
    resource.dependencies.forEach(dependency => {
      if (dependency in this._resolvedByName) { resource.resolved.add(dependency) }
    })
  }
}

export default DependencyQueue