import { IServiceDIConfig } from "./IServiceDIConfig";

export type IService = any

export type ServiceCreator<ServiceT extends IService> = (...services: IService[]) => ServiceT;
export type ServiceCreatorCreator<ConfigT extends IServiceDIConfig, ServiceT extends IService> = (config: ConfigT) => ServiceCreator<ServiceT> | null;

export default IService