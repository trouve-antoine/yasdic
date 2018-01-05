import { IService, ServiceCreatorCreator } from '../../src/'

import { IConfig } from './Config'

export interface ITest1Service extends IService {
  test(s: string): string
}

export const Test1ServiceCreator: ServiceCreatorCreator<IConfig, ITest1Service> = config => (prefixString: Function) => ({
  test: (s: string) => prefixString("test1.print", s)
})

export const SingletonServiceCreator = Test1ServiceCreator