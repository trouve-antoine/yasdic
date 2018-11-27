import { IServiceDIContainer, ServiceDIContainer } from '../src'
import { globServices } from '../src/glob-services'
import { IConfig, Config } from './lib/Config'

import * as assert from 'assert'
import * as path from 'path'

import { PrefixStringFunction, prefixString } from './lib/prefix-string'

import * as test1 from './lib/Test1Service'
import * as test2 from './lib/test2-service'
import * as test3 from './lib/Test3Service'
import { ITest1Service } from './lib/Test1Service';

describe("DI Container", function() {
  var container: ServiceDIContainer<IConfig>;
  it("Creates the container", function() {
    container = new ServiceDIContainer<IConfig>(Config);
  })
  it("Makes sure the config is as defined", function() {
    assert.equal(container.config.someConfigString, "SOME CONFIG STRING");
  })
  it("Register test module 1", function() {
    container.singleton("test1", test1.SingletonServiceCreator);
  })
  it("Make sure we cannot access test module 1 (waiting for prefixString)", function(){
    assert.throws( () => {
      container.get<test1.ITest1Service>("test1")
    })
  })
  it("Register value prefixString", function () {
    container.value("prefixString", prefixString);
  })
  it("Can get prefixString", function () {
    assert.equal(
      container.get<PrefixStringFunction>("prefixString")("prefix", "string"),
      "[prefix] string"
    );
  })
  it("Can get test1", function () {
    assert.equal(
      container.get<ITest1Service>("test1").test("toto1"),
      "[test1.print] toto1"
    );
  })
  it("Register test module 3", function () {
    container.singleton("test3", test3.SingletonServiceCreator);
  })
  it("Make sure we cannot access test module 3 (waiting for test module 2)", function () {
    assert.throws(() => {
      container.get<test1.ITest1Service>("test3")
    })
  })
  it("Register test module 2", function () {
    container.singleton("test2", test2.SingletonServiceCreator);
  })
  it("Can get test3", function () {
    assert.equal(
      container.get<test3.ITest3Service>("test3").test(),
      "[test1.print] test2 / [test1.print] test3"
    );
  })
  it("Can get test2", function () {
    assert.equal(
      container.get<test2.ITest2Service>("test2").test(),
      "[test1.print] test2"
    );
  })
  it("Test can fail", function () {
    assert.notEqual(
      container.get<test2.ITest2Service>("test2").test(),
      "wtf"
    );
  })
})

describe("Glob", function () {
  var container: ServiceDIContainer<IConfig>;
  it("Creates the container", function () {
    container = new ServiceDIContainer<IConfig>(Config);
  })
  it("Glob the lib folder", function() {
    globServices(container, __dirname + path.sep + "lib" + path.sep + "*ervice.ts")
  })
  it("Make sure we cannot access test module 1 (waiting for prefixString)", function () {
    assert.throws(() => {
      container.get<test1.ITest1Service>("test1")
    })
  })
  it("Register value prefixString", function () {
    container.value("prefixString", prefixString);
  })
  it("Can get prefixString", function () {
    assert.equal(
      container.get<PrefixStringFunction>("prefixString")("prefix", "string"),
      "[prefix] string"
    );
  })
  it("Can get test3", function () {
    assert.equal(
      container.get<test3.ITest3Service>("test3").test(),
      "[test1.print] test2 / [test1.print] test3"
    );
  })
})

describe("Inject", function() {
  var container: ServiceDIContainer<IConfig>;
  it("Creates the container and init services", function () {
    container = new ServiceDIContainer<IConfig>(Config);
    globServices(container, __dirname + path.sep + "lib" + path.sep + "*ervice.ts")
    container.value("prefixString", prefixString);
  })
  it("Inject", function () {
    const someFunctionCreator = (test3: test3.ITest3Service) => () =>
      `[some-function] ${test3.test()}`
    const someFunction = container.inject(someFunctionCreator);
    assert.equal(
      someFunction(),
      "[some-function] [test1.print] test2 / [test1.print] test3"
    )
  })
  it("Inject extra services", function () {
    const someFunctionCreator = (test3: test3.ITest3Service, addPrefix: (s: string) => string) => () =>
      addPrefix(`[some-function] ${test3.test()}`)
    const addPrefix = (s: string) => `[prefix] ${s}`
    const someFunction = container.inject(someFunctionCreator, { addPrefix });
    assert.equal(
      someFunction(),
      "[prefix] [some-function] [test1.print] test2 / [test1.print] test3"
    )
  })
  it("Make sure extra injection overwrites services", function () {
    const someFunctionCreator = (test3: test3.ITest3Service) => () =>
      `[some-function] ${test3.test()}`
    const test3Stub = {
      test: () => "I'M A STUB"
    }
    const someFunction = container.inject(someFunctionCreator, { test3: test3Stub });
    assert.equal(
      someFunction(),
      "[some-function] I'M A STUB"
    )
  })
})

describe("Glob with alternate service", function () {
  var container: ServiceDIContainer<IConfig>;
  const AlternateConfig = { ...Config };
  AlternateConfig.alternate = true;
  AlternateConfig.serviceDIContainer.debug = false;
  it("Creates the container", function () {
    container = new ServiceDIContainer<IConfig>(AlternateConfig);
  })
  it("Glob the lib folder", function () {
    globServices(container, __dirname + path.sep + "lib" + path.sep + "*ervice.ts")
  })
  it("Make sure we cannot access test module 1 (waiting for prefixString)", function () {
    assert.throws(() => {
      container.get<test1.ITest1Service>("test1")
    })
  })
  it("Register value prefixString", function () {
    container.value("prefixString", prefixString);
  })
  it("Can get prefixString", function () {
    assert.equal(
      container.get<PrefixStringFunction>("prefixString")("prefix", "string"),
      "[prefix] string"
    );
  })
  it("Can get test3", function () {
    assert.equal(
      container.get<test3.ITest3Service>("test3").test(),
      "[test1.print] test2 / [test1.print] alternate test3"
    );
  })
})