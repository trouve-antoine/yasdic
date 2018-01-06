import { IServiceDIContainerRW } from './IServiceDIContainer';
import { IServiceDIConfig } from './IServiceDIConfig';
export declare function globServices<ConfigT extends IServiceDIConfig>(container: IServiceDIContainerRW<ConfigT>, globPattern: string, guessServiceName?: (filePath: string) => string | null): void;
export default globServices;
