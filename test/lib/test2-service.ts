import { IService, ServiceCreatorCreator } from '../../src/'

import { IConfig } from './Config'

import { ITest1Service } from './Test1Service'

export interface ITest2Service extends IService {
  test(): string
}

export const Test2ServiceCreator: ServiceCreatorCreator<IConfig, ITest2Service> = config => (test1: ITest1Service) => ({
  test: () => test1.test("test2")
})

export const SingletonServiceCreator = Test2ServiceCreator