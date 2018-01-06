"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
const path = require("path");
function globServices(container, globPattern, guessServiceName = defaultGuessServiceName) {
    const filesPaths = glob.sync(globPattern);
    const _debug = (...args) => {
        if (container.config.serviceDIContainer.debug) {
            console.log("[glob-services] ", ...args);
        }
    };
    _debug("Glob patter: " + globPattern);
    _debug("Files will be tried in this order: ", filesPaths.join(", "));
    filesPaths.forEach(filePath => {
        let serviceName = require(filePath).ServiceName;
        if (!serviceName) {
            serviceName = guessServiceName(filePath);
        }
        if (!serviceName) {
            _debug(`Skip file ${filePath}: cannot guess service name (expected file name: XxxYyyService or xxx-yyy-service for service xxxYyy)`);
            return;
        }
        const singletonServiceCreator = require(filePath).SingletonServiceCreator;
        if (!singletonServiceCreator) {
            _debug(`Skip service ${serviceName} at file ${filePath}: no SingletonServiceCreator exported`);
            return;
        }
        _debug(`Register service ${serviceName} from file ${filePath}`);
        container.singleton(serviceName, singletonServiceCreator);
    });
}
exports.globServices = globServices;
exports.default = globServices;
function defaultGuessServiceName(filePath) {
    const fileName = path.basename(filePath);
    const serviceNameCamelCaseMatch = fileName.match(/(.*)(Service|-service)/) || [];
    const serviceNameCamelCase = serviceNameCamelCaseMatch[1];
    if (!serviceNameCamelCaseMatch) {
        return null;
    }
    // return camelCaseToSeparator(serviceNameCamelCase, "-");
    return hypenToCamelCase(lowerCaseFirstLetter(serviceNameCamelCase));
}
// function camelCaseToSeparator(s: string, sep: string) {
//   return s.split(/(?=[A-Z])/g).join(sep).toLowerCase();
// }
function lowerCaseFirstLetter(s) {
    const firstLetter = s[0];
    const remainingLetters = s.substring(1);
    return firstLetter.toLowerCase() + remainingLetters;
}
function hypenToCamelCase(s) {
    return s.replace(/-([a-z])/g, g => g[1].toUpperCase());
}
//# sourceMappingURL=glob-services.js.map