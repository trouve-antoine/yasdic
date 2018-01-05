import { IService, ServiceCreatorCreator } from '../../src/'

import { IConfig } from './Config'

import { ITest1Service } from './Test1Service'
import { ITest2Service } from './Test2Service'

export interface ITest3Service extends IService {
  test(): string
}

export const Test3ServiceCreator: ServiceCreatorCreator<IConfig, ITest3Service> = config => (test1: ITest1Service, test2: ITest2Service) => ({
  test: () => test2.test() + " / " + test1.test("test3")
})

export const SingletonServiceCreator = Test3ServiceCreator