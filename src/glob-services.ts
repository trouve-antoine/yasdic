import * as glob from 'glob'
import * as path from 'path'

import { ServiceCreatorCreator } from './IService'
import { IServiceDIContainerRW } from './IServiceDIContainer'
import { IServiceDIConfig } from './IServiceDIConfig';

type stringOrNull = string | null

export function globServices<ConfigT extends IServiceDIConfig>(container: IServiceDIContainerRW<ConfigT>, globPattern: string): void
{
  const filesPaths = glob.sync(globPattern)
  
  const _debug = (...args: any[]) => {
    if (container.config.serviceDIContainer.debug) { console.log("[glob-services] ", ...args) }
  }

  _debug("Files will be tried in this order: ", filesPaths.join(", "));

  filesPaths.forEach(filePath => {
    const serviceName = guessServiceName(filePath)
    if (!serviceName) {
      _debug(`Skip file ${filePath}: cannot guess service name (expect: ServiceXxxYyy.ts for service xxxYyy)`)
      return;
    }

    const singletonServiceCreator: ServiceCreatorCreator<ConfigT, any> = require(filePath).SingletonServiceCreator;
    if (!singletonServiceCreator) {
      _debug(`Skip service ${serviceName} at file ${filePath}: no SingletonServiceCreator exported`)
      return;
    }

    _debug(`Register service ${serviceName} from file ${filePath}`);
    
    container.singleton(serviceName, singletonServiceCreator);
  })
}

export default globServices

function guessServiceName(filePath: string): stringOrNull {
  const fileName = path.basename(filePath);

  const serviceNameCamelCaseMatch = fileName.match(/(.*)Service/) || [];
  const serviceNameCamelCase = serviceNameCamelCaseMatch[1];

  if (!serviceNameCamelCaseMatch) { return null; }

  // return camelCaseToSeparator(serviceNameCamelCase, "-");
  return lowerCaseFirstLetter(serviceNameCamelCase)
}

// function camelCaseToSeparator(s: string, sep: string) {
//   return s.split(/(?=[A-Z])/g).join(sep).toLowerCase();
// }

function lowerCaseFirstLetter(s: string) {
  const firstLetter = s[0]
  const remainingLetters = s.substring(1)
  return firstLetter.toLowerCase() + remainingLetters
}