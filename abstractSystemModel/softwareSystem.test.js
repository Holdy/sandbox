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
            .verbs('create', 'update');

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

        var trinity_createKnowledgeMap = trinity.addA('function').called('createKnowledgeMap');

        var kmdb = sqlServer.addA('database').called('km-db');
        kmdb.addA('database-table').called('knowledgeMap');
        kmdb.encapsulatedBy(trinity);  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        var rainbirdApp = rainbirdServer.addA('code-module').called('rainbirdApp');
        var km_edit_page = rainbirdApp.addA('page').called('km-edit-page');
        var km_list_page = rainbirdApp.addA('page').called('km-list-page');

        ///////////////////////////////////
        // New work.
        ///////////////////////////////////
        var phase2 = model.addPhase(2);


         kmdb.addA('database-table').called('knowledgeMapIdentity');

         // page to list version.
         km_edit_page.addA('button').called('new version');
         km_list_page.addA('button').called('publish')


        model.check(phase2, function(issue) {
            console.log(issue.message + '\n');
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
