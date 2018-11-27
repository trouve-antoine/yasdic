/** Test the function parameter extraction */

import { getFunctionArgumentsNames } from '../src/ServiceDIContainer';
import 'mocha';

import * as assert from 'assert';

describe("Extract parameters of function", () => {
  it("function xx()", () => {
    const args = getFunctionArgumentsNames(faa);
    assert.equal(args.length, 2);
  })
  it("function xx ()", () => {
    const args = getFunctionArgumentsNames(fab);
    assert.equal(args.length, 2);
  })
  it("function()", () => {
    const args = getFunctionArgumentsNames(fba);
    assert.equal(args.length, 2);
  })
  it("function ()", () => {
    const args = getFunctionArgumentsNames(fbb);
    assert.equal(args.length, 2);
  })
  it("() =>", () => {
    const args = getFunctionArgumentsNames(fca);
    assert.equal(args.length, 2);
  })
  it("()=>", () => {
    const args = getFunctionArgumentsNames(fcb);
    assert.equal(args.length, 2);
  })
  it("a=>", () => {
    const args = getFunctionArgumentsNames(fda);
    assert.equal(args.length, 1);
  })
  it("a =>", () => {
    const args = getFunctionArgumentsNames(fdb);
    assert.equal(args.length, 1);
  })
})

describe("Function paramater regression", () => {
  it("regression 1", () => {
    const args = getFunctionArgumentsNames(reg1);
    assert.equal(args.length, 1);
  })
  it("regression 2", () => {
    const args = getFunctionArgumentsNames(reg2);
    assert.equal(args.length, 3);
  })
  it("regression 3", () => {
    const args = getFunctionArgumentsNames(reg3);
    assert.equal(args.length, 1);
  })
  it("regression 4", () => {
    const args = getFunctionArgumentsNames(reg4);
    assert.equal(args.length, 1);
  })
  it("regression 5", () => {
    const args = getFunctionArgumentsNames(reg5);
    assert.equal(args.length, 1);
  })
  it("regression 6", () => {
    const args = getFunctionArgumentsNames(reg6);
    assert.equal(args.length, 1);
  })
})

function faa(a, b) { /** test only */}
function fab (a, b) { /** test only */}

const fba = function(a, b) { /** test only */}
const fbb = function (a, b) { /** test only */}

const fca = (a, b) => { /** test only */}
const fcb = (a, b)=>{ /** test only */}

const fda = a=>{ /** test only */}
const fdb = a =>{ /** test only */}

const reg1 = 'lokidb=>{const rcolPromise=lokidb.ensureCollection("resources",{unique:["id"],indices:["id0","id1","id2","id3"]});return new class{constructor(){this.onUpsertCallbacks=[],this.onDeleteCallbacks=[]}waitForSetup(){return __awaiter(this,void 0,void 0,function*(){yield lokidb.waitForSetup()})}upsert(resource,contents){return __awaiter(this,void 0,void 0,function*(){if(!resource.id.startsWith(resource.type+"::"))throw new custom_errors_1.InvalidDataError(`Invalid resource id: ${resource.id} (expected: start with ${resource.type})`);/** Comment out the limitation of unique identidier, in order to allow files with same contentId */ // if(!await this.areAllIdentifiersAvailable(resource)) throw new InvalidDataError(`Invalid resource identifiers: ${resource.identifiers} (already taken)`); const rcol=yield rcolPromise,oldDoc=rcol.findOne({id:resource.id}),oldResource=lokiDocOrNullToResource(oldDoc),insertedDoc=oldResource?rcol.update(resourceToLokiDoc(resource,oldDoc)):rcol.insertOne(resourceToLokiDoc(resource));if(!insertedDoc)throw new Error(`Unable to insert the resource ${JSON.stringify(resource)}`);const insertedResource=lokiDocToResource(insertedDoc);for(const cb of this.onUpsertCallbacks)yield cb(insertedResource,oldResource,contents);return insertedResource})}delete(resource){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,doc=rcol.findOne({id:resource.id});if(!doc)return null;const deletedResource=lokiDocToResource(doc);return rcol.remove(doc),yield Promise.all(this.onDeleteCallbacks.map(cb=>cb(resource))),deletedResource})}get(resourceIdOrIdentifier){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,doc=rcol.findOne({$or:[{id:resourceIdOrIdentifier},{id0:resourceIdOrIdentifier},{id1:resourceIdOrIdentifier},{id2:resourceIdOrIdentifier},{id3:resourceIdOrIdentifier}]});return doc?lokiDocToResource(doc):null})}getFromId(resourceId){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,doc=rcol.findOne({id:resourceId});return doc?lokiDocToResource(doc):null})}search(searchCriteria){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,query={};if("string"==typeof searchCriteria.type&&(query.type=searchCriteria.type),searchCriteria.type instanceof Array&&(query.type={$in:searchCriteria.type}),searchCriteria.properties)for(const key in searchCriteria.properties)query["properties."+key]=isArray(searchCriteria.properties[key])?{$in:searchCriteria.properties[key]}:searchCriteria.properties[key];const docs=rcol.find(query);return docs.map(doc=>lokiDocToResource(doc))})}countResourceWithType(type){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise;return rcol.find({type}).length})}onUpserted(cb){this.onUpsertCallbacks.push(cb)}onDeleted(cb){this.onDeleteCallbacks.push(cb)}/** Custom */areAllIdentifiersAvailable(resource){return __awaiter(this,void 0,void 0,function*(){for(const identifier of resource.identifiers){const resourceOfIdentifier=yield this.get(identifier);if(resourceOfIdentifier&&resourceOfIdentifier.id!==resource.id)return!1}return!0})}}}'
const reg2 = 'function(filesManager,activitiesPersistence,loggerToolkit){filesManager.onUpserted((file,previousFile)=>__awaiter(this,void 0,void 0,function*(){const fileResourceId=files_manager_1.makeFileResourceId(file),fileDesc=getFileDesc(file);if(!previousFile)loggerToolkit.debug(`INSERT CREATE FILE ACTIVITY ${fileDesc} created at ${file.creationTimestamp} modified at ${file.lastUpdateTimestamp}`),activitiesPersistence.register({resourceIds:[fileResourceId],contentIds:[],type:CreateFileActivity.Type,date:file.creationTimestamp,params:{}});else if(file.lastUpdateTimestamp<=previousFile.lastUpdateTimestamp)return;loggerToolkit.debug(`INSERT MODIFY FILE ACTIVITY ${fileDesc} created at ${file.creationTimestamp} modified at ${file.lastUpdateTimestamp}`),activitiesPersistence.register({resourceIds:[fileResourceId],contentIds:[],type:ModifyFileActivity.Type,date:file.lastUpdateTimestamp,params:{}})}))}'
const reg3 = 'lokidb => {const rcolPromise=lokidb.ensureCollection("resources",{unique:["id"],indices:["id0","id1","id2","id3"]});return new class{constructor(){this.onUpsertCallbacks=[],this.onDeleteCallbacks=[]}waitForSetup(){return __awaiter(this,void 0,void 0,function*(){yield lokidb.waitForSetup()})}upsert(resource,contents){return __awaiter(this,void 0,void 0,function*(){if(!resource.id.startsWith(resource.type+"::"))throw new custom_errors_1.InvalidDataError(`Invalid resource id: ${resource.id} (expected: start with ${resource.type})`);/** Comment out the limitation of unique identidier, in order to allow files with same contentId */ // if(!await this.areAllIdentifiersAvailable(resource)) throw new InvalidDataError(`Invalid resource identifiers: ${resource.identifiers} (already taken)`); const rcol=yield rcolPromise,oldDoc=rcol.findOne({id:resource.id}),oldResource=lokiDocOrNullToResource(oldDoc),insertedDoc=oldResource?rcol.update(resourceToLokiDoc(resource,oldDoc)):rcol.insertOne(resourceToLokiDoc(resource));if(!insertedDoc)throw new Error(`Unable to insert the resource ${JSON.stringify(resource)}`);const insertedResource=lokiDocToResource(insertedDoc);for(const cb of this.onUpsertCallbacks)yield cb(insertedResource,oldResource,contents);return insertedResource})}delete(resource){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,doc=rcol.findOne({id:resource.id});if(!doc)return null;const deletedResource=lokiDocToResource(doc);return rcol.remove(doc),yield Promise.all(this.onDeleteCallbacks.map(cb=>cb(resource))),deletedResource})}get(resourceIdOrIdentifier){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,doc=rcol.findOne({$or:[{id:resourceIdOrIdentifier},{id0:resourceIdOrIdentifier},{id1:resourceIdOrIdentifier},{id2:resourceIdOrIdentifier},{id3:resourceIdOrIdentifier}]});return doc?lokiDocToResource(doc):null})}getFromId(resourceId){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,doc=rcol.findOne({id:resourceId});return doc?lokiDocToResource(doc):null})}search(searchCriteria){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,query={};if("string"==typeof searchCriteria.type&&(query.type=searchCriteria.type),searchCriteria.type instanceof Array&&(query.type={$in:searchCriteria.type}),searchCriteria.properties)for(const key in searchCriteria.properties)query["properties."+key]=isArray(searchCriteria.properties[key])?{$in:searchCriteria.properties[key]}:searchCriteria.properties[key];const docs=rcol.find(query);return docs.map(doc=>lokiDocToResource(doc))})}countResourceWithType(type){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise;return rcol.find({type}).length})}onUpserted(cb){this.onUpsertCallbacks.push(cb)}onDeleted(cb){this.onDeleteCallbacks.push(cb)}/** Custom */areAllIdentifiersAvailable(resource){return __awaiter(this,void 0,void 0,function*(){for(const identifier of resource.identifiers){const resourceOfIdentifier=yield this.get(identifier);if(resourceOfIdentifier&&resourceOfIdentifier.id!==resource.id)return!1}return!0})}}}'
const reg4 = '(lokidb) =>{const rcolPromise=lokidb.ensureCollection("resources",{unique:["id"],indices:["id0","id1","id2","id3"]});return new class{constructor(){this.onUpsertCallbacks=[],this.onDeleteCallbacks=[]}waitForSetup(){return __awaiter(this,void 0,void 0,function*(){yield lokidb.waitForSetup()})}upsert(resource,contents){return __awaiter(this,void 0,void 0,function*(){if(!resource.id.startsWith(resource.type+"::"))throw new custom_errors_1.InvalidDataError(`Invalid resource id: ${resource.id} (expected: start with ${resource.type})`);/** Comment out the limitation of unique identidier, in order to allow files with same contentId */ // if(!await this.areAllIdentifiersAvailable(resource)) throw new InvalidDataError(`Invalid resource identifiers: ${resource.identifiers} (already taken)`); const rcol=yield rcolPromise,oldDoc=rcol.findOne({id:resource.id}),oldResource=lokiDocOrNullToResource(oldDoc),insertedDoc=oldResource?rcol.update(resourceToLokiDoc(resource,oldDoc)):rcol.insertOne(resourceToLokiDoc(resource));if(!insertedDoc)throw new Error(`Unable to insert the resource ${JSON.stringify(resource)}`);const insertedResource=lokiDocToResource(insertedDoc);for(const cb of this.onUpsertCallbacks)yield cb(insertedResource,oldResource,contents);return insertedResource})}delete(resource){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,doc=rcol.findOne({id:resource.id});if(!doc)return null;const deletedResource=lokiDocToResource(doc);return rcol.remove(doc),yield Promise.all(this.onDeleteCallbacks.map(cb=>cb(resource))),deletedResource})}get(resourceIdOrIdentifier){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,doc=rcol.findOne({$or:[{id:resourceIdOrIdentifier},{id0:resourceIdOrIdentifier},{id1:resourceIdOrIdentifier},{id2:resourceIdOrIdentifier},{id3:resourceIdOrIdentifier}]});return doc?lokiDocToResource(doc):null})}getFromId(resourceId){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,doc=rcol.findOne({id:resourceId});return doc?lokiDocToResource(doc):null})}search(searchCriteria){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,query={};if("string"==typeof searchCriteria.type&&(query.type=searchCriteria.type),searchCriteria.type instanceof Array&&(query.type={$in:searchCriteria.type}),searchCriteria.properties)for(const key in searchCriteria.properties)query["properties."+key]=isArray(searchCriteria.properties[key])?{$in:searchCriteria.properties[key]}:searchCriteria.properties[key];const docs=rcol.find(query);return docs.map(doc=>lokiDocToResource(doc))})}countResourceWithType(type){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise;return rcol.find({type}).length})}onUpserted(cb){this.onUpsertCallbacks.push(cb)}onDeleted(cb){this.onDeleteCallbacks.push(cb)}/** Custom */areAllIdentifiersAvailable(resource){return __awaiter(this,void 0,void 0,function*(){for(const identifier of resource.identifiers){const resourceOfIdentifier=yield this.get(identifier);if(resourceOfIdentifier&&resourceOfIdentifier.id!==resource.id)return!1}return!0})}}}'
const reg5 = '(lokidb)=>{const rcolPromise=lokidb.ensureCollection("resources",{unique:["id"],indices:["id0","id1","id2","id3"]});return new class{constructor(){this.onUpsertCallbacks=[],this.onDeleteCallbacks=[]}waitForSetup(){return __awaiter(this,void 0,void 0,function*(){yield lokidb.waitForSetup()})}upsert(resource,contents){return __awaiter(this,void 0,void 0,function*(){if(!resource.id.startsWith(resource.type+"::"))throw new custom_errors_1.InvalidDataError(`Invalid resource id: ${resource.id} (expected: start with ${resource.type})`);/** Comment out the limitation of unique identidier, in order to allow files with same contentId */ // if(!await this.areAllIdentifiersAvailable(resource)) throw new InvalidDataError(`Invalid resource identifiers: ${resource.identifiers} (already taken)`); const rcol=yield rcolPromise,oldDoc=rcol.findOne({id:resource.id}),oldResource=lokiDocOrNullToResource(oldDoc),insertedDoc=oldResource?rcol.update(resourceToLokiDoc(resource,oldDoc)):rcol.insertOne(resourceToLokiDoc(resource));if(!insertedDoc)throw new Error(`Unable to insert the resource ${JSON.stringify(resource)}`);const insertedResource=lokiDocToResource(insertedDoc);for(const cb of this.onUpsertCallbacks)yield cb(insertedResource,oldResource,contents);return insertedResource})}delete(resource){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,doc=rcol.findOne({id:resource.id});if(!doc)return null;const deletedResource=lokiDocToResource(doc);return rcol.remove(doc),yield Promise.all(this.onDeleteCallbacks.map(cb=>cb(resource))),deletedResource})}get(resourceIdOrIdentifier){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,doc=rcol.findOne({$or:[{id:resourceIdOrIdentifier},{id0:resourceIdOrIdentifier},{id1:resourceIdOrIdentifier},{id2:resourceIdOrIdentifier},{id3:resourceIdOrIdentifier}]});return doc?lokiDocToResource(doc):null})}getFromId(resourceId){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,doc=rcol.findOne({id:resourceId});return doc?lokiDocToResource(doc):null})}search(searchCriteria){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise,query={};if("string"==typeof searchCriteria.type&&(query.type=searchCriteria.type),searchCriteria.type instanceof Array&&(query.type={$in:searchCriteria.type}),searchCriteria.properties)for(const key in searchCriteria.properties)query["properties."+key]=isArray(searchCriteria.properties[key])?{$in:searchCriteria.properties[key]}:searchCriteria.properties[key];const docs=rcol.find(query);return docs.map(doc=>lokiDocToResource(doc))})}countResourceWithType(type){return __awaiter(this,void 0,void 0,function*(){const rcol=yield rcolPromise;return rcol.find({type}).length})}onUpserted(cb){this.onUpsertCallbacks.push(cb)}onDeleted(cb){this.onDeleteCallbacks.push(cb)}/** Custom */areAllIdentifiersAvailable(resource){return __awaiter(this,void 0,void 0,function*(){for(const identifier of resource.identifiers){const resourceOfIdentifier=yield this.get(identifier);if(resourceOfIdentifier&&resourceOfIdentifier.id!==resource.id)return!1}return!0})}}}'
const reg6 = 'loggerToolkit=>{function checkIfTheDbPathFolderExists(dbPath){dbPath=path.resolve(dbPath);const dbDirPath=path.dirname(dbPath);if(!fs.existsSync(dbDirPath))throw new Error(`Cannot make the DB file in the folder ${dbDirPath}: it does not exist (got path${dbPath})`);loggerToolkit.info(`I will serialize the DB in path ${dbPath}`)}const dbPromise=new Promise(resolve=>{config.lokidb.dbpath&&checkIfTheDbPathFolderExists(config.lokidb.dbpath);const inMemory=!!!config.lokidb.dbpath,db=new lokijs(config.lokidb.dbpath||"",{autoload:!0,autoloadCallback:()=>resolve(db),autosave:!inMemory,autosaveInterval:100})});return new class{waitForSetup(){return __awaiter(this,void 0,void 0,function*(){yield dbPromise})}db(){return __awaiter(this,void 0,void 0,function*(){return yield dbPromise})}ensureCollection(collectionName,options){return __awaiter(this,void 0,void 0,function*(){const db=yield dbPromise,collection=db.getCollection(collectionName);return collection?collection:db.addCollection(collectionName,options)})}close(){return __awaiter(this,void 0,void 0,function*(){const db=yield dbPromise;yield new Promise(resolve=>db.save(()=>db.close(()=>resolve())))})}}}';