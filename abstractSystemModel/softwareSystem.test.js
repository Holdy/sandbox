var expect = require('chai').expect;

var systemModel = require('./systemModel');

// TODO
//  When one y 'uses' x - we record the version of x against y's usage.
//  f we then add something to x we can warn that y's usage is old


describe('systemModel should behave as expected for software', function() {

    it('should allow creation of a phase', function(done) {

        var model = systemModel.create();

        model.addTopLevelType('server');

        model.addType('code-module')
            .canBeContainedBy('server');

        model.addType('database')
            .canBeContainedBy('server')
            .requireEncapsulation();

        model.addType('database-table')
            .canBeContainedBy('database')
            .verbs('create','read', 'update');

        model.addActorType('function')
            .canBeContainedBy('code-module')
            .verbs('call');

        model.addType('page')
            .canBeContainedBy('code-module');

        model.addActorType('button')
            .canBeContainedBy('page');

        var phase1 = model.addPhase(1);

        var yolandaServer = model.addA('server').called('Yolanda-Server');
        var sqlServer = model.addA('server').called('SqlServer');
        var rainbirdServer = model.addA('server').called('Rainbird-Server');

        var trinity = yolandaServer.addA('code-module').called('trinity');

        var yolanda = yolandaServer.addA('code-module').called('yolanda');

        var trinity_createKnowledgeMap = trinity.addA('function').called('createKnowledgeMap');

        var kmdb = sqlServer.addA('database').called('km-db');
        kmdb.addA('database-table').called('t:knowledgeMap');
        kmdb.encapsulatedBy(trinity);  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        var rainbirdApp = rainbirdServer.addA('code-module').called('rainbirdApp');
        var km_edit_page = rainbirdApp.addA('page').called('km-edit-page');
        var km_list_page = rainbirdApp.addA('page').called('km-list-page');
        var km_trygoal_page = rainbirdApp.addA('page').called('km-trygoal-page');

        ///////////////////////////////////
        // New work.
        ///////////////////////////////////
        var phase2 = model.addPhase(2);


         kmdb.addA('database-table').called('t:knowledgeMapIdentity');

        // KMIdentity to store latest save and latest publish.
        trinity.addA('function').called('handleNewVersion')
            .perform('create').on('t:knowledgeMap')
            .perform('create').on('t:knowledgeMapIdentity'); // if no publish.


        trinity.addA('function').called('getNewKMList')
            .perform('read').on('t:knowledgeMapIdentity');

        trinity.addA('function').called('handlePublish')
            .perform('update').on('t:knowledgeMapIdentity');

        trinity.addA('function').called('handleGetVersions')
            .perform('read').on('t:knowledgeMap'); //versions

        /// Use loaded version. - yol.
        trinity.addA('function').called('newTryGoal')
            .perform('read').on('t:knowledgeMap'); // dummy

        trinity.addA('function').called('getNewKMList')
            .perform('read').on('t:knowledgeMapIdentity');

        km_edit_page.addA('button').called('show versions')
            .perform('call').on('handleGetVersions'); // actually on verions

         // page to list version.
         km_edit_page.addA('button').called('new version')
             .perform('call').on('handleNewVersion');

        // will we have to version all agents also? otherwise agent may
        // offer newer goals.

        // send currently loaded version.
        km_trygoal_page.addA('button').called('new-trygoal-functionality')
            .perform('call').on('newTryGoal');


        // for goals - only serve up goals whos relationship is valid (first phase)
        // otherwise we will need to fully version agents etc as well.

        // ensure creation timestamp on km (now km-version table).



        km_list_page
            .perform('call').on('getNewKMList');

         km_list_page.addA('button').called('publish')
             .perform('call').on('handlePublish');

        var i = 0;
        model.check(phase2, function(issue) {
            console.log((++i) + ': ' + issue.message + '\n');
        });

        done();
    });


});
/*
 kmdb.addA('database-table').called('knowledgeMapIdentity');

// page to list version.
 km_edit_page.addA('button').called('new version');
 km_list_page.addA('button').called('publish')
 */
