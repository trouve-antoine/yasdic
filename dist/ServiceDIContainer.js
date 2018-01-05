"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DependencyQueue_1 = require("./DependencyQueue");
class ServiceDIContainer {
    constructor(config) {
        this._singletons = {};
        this._singletonCreator = {};
        this._dependencyQueue = new DependencyQueue_1.DependencyQueue();
        this.config = config;
    }
    _debug(...args) {
        if (this.config.serviceDIContainer.debug) {
            console.log("[ServiceDIContainer] ", ...args);
        }
    }
    get(serviceName) {
        const service = this._singletons[serviceName];
        if (!service) {
            throw new Error("No service with name: " + serviceName + " (available: " + Object.keys(this._singletons).join(",") + ")");
        }
        return service;
    }
    createSingletonAndCache(serviceName) {
        const serviceCreator = this._singletonCreator[serviceName];
        if (!serviceCreator) {
            return null;
        }
        const service = this.inject(serviceCreator);
        this._singletons[serviceName] = service;
        return service;
    }
    inject(serviceCreator) {
        const creatorArgumentsNames = getFunctionArgumentsNames(serviceCreator);
        const creatorArgumentsValues = creatorArgumentsNames.map(argName => this.get(argName));
        const service = serviceCreator(...creatorArgumentsValues);
        return service;
    }
    value(serviceName, service) {
        this._singletons[serviceName] = service;
        this._debug("Register value: " + serviceName);
        this._dependencyQueue.push(serviceName, []);
        this._dependencyQueue.resolve(serviceName);
        this._createAndCacheWaitingSingletons();
    }
    singleton(serviceName, serviceCreatorCreator) {
        const serviceCreator = serviceCreatorCreator(this.config);
        this._singletonCreator[serviceName] = serviceCreator;
        this._debug("Register singleton: " + serviceName);
        const dependencyServices = getFunctionArgumentsNames(serviceCreator);
        this._dependencyQueue.push(serviceName, dependencyServices);
        this._createAndCacheWaitingSingletons();
    }
    _createAndCacheWaitingSingletons() {
        while (this._dependencyQueue.peekAllWaiting().length !== 0) {
            this._dependencyQueue.peekAllWaiting().forEach(resolvedSingletonName => {
                const resolvedSingleton = this.createSingletonAndCache(resolvedSingletonName);
                this._debug("Resolve singleton: " + resolvedSingletonName);
                if (!resolvedSingleton) {
                    throw new Error("Unable to instantiate the resolved service with name: " + resolvedSingletonName);
                }
                this._dependencyQueue.resolve(resolvedSingletonName);
            });
        }
    }
}
exports.ServiceDIContainer = ServiceDIContainer;
// https://davidwalsh.name/javascript-arguments
function getFunctionArgumentsNames(func) {
    // First match everything inside the function argument parens.
    const matchedArgs = func.toString().match(/function\s.*?\(([^)]*)\)/) // match functionn(...)
        || func.toString().match(/\(([^)]*)\)\s=>/) // match arrow function
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
//# sourceMappingURL=ServiceDIContainer.js.map