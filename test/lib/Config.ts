import { IServiceDIConfig } from "../../src/IServiceDIConfig";

export interface IConfig extends IServiceDIConfig {
  someConfigString: string
}

export const Config: IConfig = {
  someConfigString: "SOME CONFIG STRING",
  serviceDIContainer: { debug: false }
}

export default Config