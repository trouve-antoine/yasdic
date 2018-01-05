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

  inject<ServiceT extends IService>(serviceCreator: ServiceCreator<ServiceT>) : ServiceT {
    const creatorArgumentsNames = getFunctionArgumentsNames(serviceCreator)

    const creatorArgumentsValues = creatorArgumentsNames.map( argName =>
      this.get<IService>(argName)
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
    this._singletonCreator[serviceName] = serviceCreator;

    this._debug("Register singleton: " + serviceName);

    const dependencyServices = getFunctionArgumentsNames(serviceCreator);
    this._dependencyQueue.push(serviceName, dependencyServices);

    this._createAndCacheWaitingSingletons();
  }

  private _createAndCacheWaitingSingletons(): void {
    while(this._dependencyQueue.peekAllWaiting().length!==0) {
      this._dependencyQueue.peekAllWaiting().forEach(resolvedSingletonName => {
        const resolvedSingleton = this.createSingletonAndCache(resolvedSingletonName);

        this._debug("Resolve singleton: " + resolvedSingletonName);

        if (!resolvedSingleton) {
          throw new Error("Unable to instantiate the resolved service with name: " + resolvedSingletonName)
        }
        this._dependencyQueue.resolve(resolvedSingletonName)
      })
    }
  }
}

// https://davidwalsh.name/javascript-arguments
function getFunctionArgumentsNames(func: Function) : string[] {
  // First match everything inside the function argument parens.
  const matchedArgs = func.toString().match(/function\s.*?\(([^)]*)\)/) // match functionn(...)
                  || func.toString().match(/\(([^)]*)\)\s=>/) // match arrow function
                  || [] // fallback

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