import { IService, ServiceCreator, ServiceCreatorCreator } from './IService'
import { IServiceDIContainerRW } from './IServiceDIContainer'
import { DependencyQueue } from './DependencyQueue';
import { IServiceDIConfig } from './IServiceDIConfig';

export class ServiceDIContainer<ConfigT extends IServiceDIConfig> implements IServiceDIContainerRW<ConfigT> {
  config: ConfigT;
  private _singletons: { [serviceName: string]: IService } = {};
  private _singletonCreator: { [serviceName: string]: ServiceCreator<IService> } = {};
  private _dependencyQueue: DependencyQueue = new DependencyQueue();
  
  constructor(config: ConfigT) {
    this.config = config
  }

  private _debug(...args: any[]) : void {
    if(this.config.serviceDIContainer.debug) { console.log("[ServiceDIContainer] ", ...args); }
  }

  get<ServiceT extends IService>(serviceName: string) {
    this._debug("Get service " + serviceName);

    const service = this._singletons[serviceName]
    if (!service) {
      throw new Error("No service with name: " + serviceName + " (available: " + Object.keys(this._singletons).join(",") + ")")
    }
    return service as ServiceT;
  }

  createSingletonAndCache<ServiceT extends IService>(serviceName: string) : (ServiceT | null) {
    const serviceCreator = this._singletonCreator[serviceName];
    if (!serviceCreator){ return null; }
    const service = this.inject<ServiceT>(serviceCreator);
    this._singletons[serviceName] = service;
    return service;
  }

  inject<ServiceT extends IService>(
    serviceCreator: ServiceCreator<ServiceT>,
    extraServices = {} as { [serviceName: string]: any }
  ) : ServiceT
  {
    const creatorArgumentsNames = getFunctionArgumentsNames(serviceCreator)

    const creatorArgumentsValues = creatorArgumentsNames.map( argName =>
      extraServices[argName] || this.get<IService>(argName)
    )

    const service = serviceCreator(...creatorArgumentsValues)
    
    return service as ServiceT
  }

  value<ServiceT extends IService>(serviceName: string, service: ServiceT) {
    this._singletons[serviceName] = service

    this._debug("Register value: " + serviceName);
    
    this._dependencyQueue.push(serviceName, [])
    this._dependencyQueue.resolve(serviceName)

    this._createAndCacheWaitingSingletons();
  }

  singleton<ServiceT extends IService>(serviceName: string, serviceCreatorCreator: ServiceCreatorCreator<ConfigT, ServiceT>) {
    const serviceCreator = serviceCreatorCreator(this.config);
    if (serviceCreator === null) {
      this._debug("Do not register servie: " + serviceName + " (the creator creator returned null)");
      return
    }
    this._singletonCreator[serviceName] = serviceCreator;

    const dependencyServices = getFunctionArgumentsNames(serviceCreator);

    this._debug("Register singleton: " + serviceName + " (depends on " + (dependencyServices.join(",") || "nothing") + ")");

    this._dependencyQueue.push(serviceName, dependencyServices);

    this._createAndCacheWaitingSingletons();
  }

  private _createAndCacheWaitingSingletons(): void {
    while(this._dependencyQueue.peekAllWaiting().length!==0) {
      this._dependencyQueue.peekAllWaiting().forEach(resolvedSingletonName => {
        this._debug("Resolve singleton: " + resolvedSingletonName);

        const resolvedSingleton = this.createSingletonAndCache(resolvedSingletonName);

        if (!resolvedSingleton) {
          throw new Error("Unable to instantiate the resolved service with name: " + resolvedSingletonName)
        }
        this._dependencyQueue.resolve(resolvedSingletonName)
      })
    }
  }
}

// https://davidwalsh.name/javascript-arguments
export function getFunctionArgumentsNames(func: Function | string) : string[] {
  // First match everything inside the function argument parens.
  const matchedArgs = func.toString().match(/^\s*function[^(]*\(([^)]*)\)/) // match function(...)
    || func.toString().match(/^\s*\(([^)]*)\)\s*=>/) // match arrow function
    || func.toString().match(/^\s*([^)=>]*)\s*=>/) // match arrow function without ()
    || func.toString().match(/^\s*async\s+function\s.*?\(([^)]*)\)/) // match async function(...)
    || func.toString().match(/^\s*async\s+\(([^)]*)\)\s*=>/) // match async arrow function
    || func.toString().match(/^\s*async\s+([^)=>]*)\s*=>/) // match async arrow function without ()
    || []; // fallback

  const args = matchedArgs[1] || "";

  // Split the arguments string into an array comma delimited.
  return args.split(',').map(function (arg) {
    // Ensure no inline comments are parsed and trim the whitespace.
    return arg.replace(/\/\*.*\*\//, '').trim();
  }).filter(function (arg) {
    // Ensure no undefined values are added.
    return arg;
  });
}