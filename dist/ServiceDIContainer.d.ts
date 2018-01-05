import { IService, ServiceCreator, ServiceCreatorCreator } from './IService';
import { IServiceDIContainerRW } from './IServiceDIContainer';
import { IServiceDIConfig } from './IServiceDIConfig';
export declare class ServiceDIContainer<ConfigT extends IServiceDIConfig> implements IServiceDIContainerRW<ConfigT> {
    config: ConfigT;
    private _singletons;
    private _singletonCreator;
    private _dependencyQueue;
    constructor(config: ConfigT);
    private _debug(...args);
    get<ServiceT extends IService>(serviceName: string): ServiceT;
    createSingletonAndCache<ServiceT extends IService>(serviceName: string): (ServiceT | null);
    inject<ServiceT extends IService>(serviceCreator: ServiceCreator<ServiceT>): ServiceT;
    value<ServiceT extends IService>(serviceName: string, service: ServiceT): void;
    singleton<ServiceT extends IService>(serviceName: string, serviceCreatorCreator: ServiceCreatorCreator<ConfigT, ServiceT>): void;
    private _createAndCacheWaitingSingletons();
}
