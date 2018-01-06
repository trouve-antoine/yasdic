import { IServiceDIConfig } from "./IServiceDIConfig";
export declare type IService = any;
export declare type ServiceCreator<ServiceT extends IService> = (...services: IService[]) => ServiceT;
export declare type ServiceCreatorCreator<ConfigT extends IServiceDIConfig, ServiceT extends IService> = (config: ConfigT) => ServiceCreator<ServiceT> | null;
export default IService;
