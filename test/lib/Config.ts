import { IServiceDIConfig } from "../../src/IServiceDIConfig";

export interface IConfig extends IServiceDIConfig {
  someConfigString: string,
  alternate: boolean
}

export const Config: IConfig = {
  someConfigString: "SOME CONFIG STRING",
  serviceDIContainer: { debug: false },
  alternate: false
}

export default Config