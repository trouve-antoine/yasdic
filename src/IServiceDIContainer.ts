import { IService, ServiceCreator, ServiceCreatorCreator } from './IService'
import { IServiceDIConfig } from './IServiceDIConfig';

export interface IServiceDIContainer {
  get<ServiceT extends IService>(name: string): ServiceT
  inject<ServiceT extends IService>(serviceCreator: ServiceCreator<ServiceT>, extraServices?: { [serviceName: string]: any } ): ServiceT
}

export interface IServiceDIContainerRW<ConfigT extends IServiceDIConfig> extends IServiceDIContainer {
  config: ConfigT
  singleton<ServiceT extends IService>(serviceName: string, serviceCreatorCreator: ServiceCreatorCreator<ConfigT, ServiceT>): void
  value<ServiceT extends IService>(name: string, service: ServiceT): void
}