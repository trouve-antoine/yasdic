import DependencyQueue from '../src/DependencyQueue'
import * as assert from 'assert'
import * as check from 'check-types'
import * as includes from 'array-includes'

describe("DependencyQueue: basic", function() {
  let queue: DependencyQueue;
  it("Init", function() {
    queue = new DependencyQueue();
  })

  it("Add A that depends on M", function(){
    queue.push("A", ["M"]);
    assertArraysContainsSameElements(queue.peekAllWaiting(), []);
  })

  it("Add B that depends on M and N", function () {
    queue.push("B", ["M", "N"]);
    assertArraysContainsSameElements(queue.peekAllWaiting(), []);
  })

  it("Add M with no dependency", function(){
    queue.push("M", []);
    assertArraysContainsSameElements(queue.peekAllWaiting(), ["M"]);
  })

  it("Add N with no dependency", function () {
    queue.push("N", []);
    assertArraysContainsSameElements(queue.peekAllWaiting(), ["M", "N"]);
  })

  it("Resolve M: A should be waiting", function () {
    queue.resolve("M");
    assertArraysContainsSameElements(queue.peekAllWaiting(), ["A", "N"]);
  })

  it("Resolve N: B should be waiting", function () {
    queue.resolve("N");
    assertArraysContainsSameElements(queue.peekAllWaiting(), ["A", "B"]);
  })
})

describe("DependencyQueue: regression 1", function(){
  let queue: DependencyQueue;
  it("Init", function () {
    queue = new DependencyQueue();
  })

  it("Add A that depends on B and C", function () {
    queue.push("A", ["B", "C"]);
    assertArraysContainsSameElements(queue.peekAllWaiting(), []);
  })

  it("Add C that depends on B", function () {
    queue.push("C", ["B"]);
    assertArraysContainsSameElements(queue.peekAllWaiting(), []);
  })

  it("Add B that depends on nobody", function () {
    queue.push("B", []);
    assertArraysContainsSameElements(queue.peekAllWaiting(), [ "B" ]);
  })

  it("Resolve B: C should be waiting", function () {
    queue.resolve("B");
    assertArraysContainsSameElements(queue.peekAllWaiting(), ["C"]);
  })

  it("Resolve C: A should be waiting", function () {
    queue.resolve("C");
    assertArraysContainsSameElements(queue.peekAllWaiting(), ["A"]);
  })

  it("Resolve A: nobody should be waiting", function () {
    queue.resolve("A");
    assertArraysContainsSameElements(queue.peekAllWaiting(), []);
  })
})

function assertArraysContainsSameElements(a1: any[], a2: any[]) {
  assert(a1.length===a2.length, `Arrays have different size: [${a1}] and [${a2}]`)
  a1.forEach( x1 => {
    assert(includes(a2, x1), `${x1} not in array [${a2}] (was in [${a1}])`)
  } )
}