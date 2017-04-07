"strict on";

var thingLib = require('./lib/Thing');
var TypeInfo = require('./lib/TypeInfo');

function SystemModel() {
    this.typeMap = {};
    this.phases = [];
    this.things = [];
    this.thingMap = {};

    var rootType = TypeInfo.create('root-of-model');
    rootType.model = this;

    this.rootThing = thingLib.create(rootType);
    this.rootThing.isRootThing = true;
    this.rootThing.model = this;
}

SystemModel.prototype.addPhase = function(phaseNumber) {
    var phase = new Phase();
    phase.id = phaseNumber;
    phase.model = this;
    this.activePhase = phase;
    this.phases.push(phase);
    return phase;
}

SystemModel.prototype.addType = function(typeName) {
    var type = TypeInfo.create(typeName);
    type.model = this;
    type.validContainers = [];
    this.typeMap[typeName] = type;
    return type;
}

SystemModel.prototype.addActorType = function(typeName) {
    var type = TypeInfo.create(typeName);
    type.model = this;
    type.validContainers = [];
    type.isActor = true;
    this.typeMap[typeName] = type;
    return type;
}


SystemModel.prototype.addTopLevelType = function(typeName) {
    this.typeMap[typeName] = {'typeName': typeName, 'model': this, isTopLevel:true};
}

SystemModel.prototype.getType = function(typeName) {
    return this.typeMap[typeName];
}

SystemModel.prototype.addA = function(nameOfTypeToAdd) {
    var typeInfo = this.getType(nameOfTypeToAdd);
    if (!typeInfo) {
        throw new Error('No such type:' + nameOfTypeToAdd);
    }

    if(!typeInfo.isTopLevel) {
        throw new Error('' + nameOfTypeToAdd + ' is not a top level item, it can\'t be added to a phase.');
    }

    return this.rootThing.addA(nameOfTypeToAdd);
}

function Phase() {
}

SystemModel.prototype.addError = function(error) {
    if (!this.errors) {
        this.errors = [];
    }

    this.errors.push(error);
}

SystemModel.prototype.getThing = function(thingName ) {
    var result = null;

    for (var i = 0; i < this.things.length; i++) {
        var testThing = this.things[i];
        if (testThing.name == thingName) {
            result = testThing;
            break;
        }
    }
    return result;
}

SystemModel.prototype.resolveThing = function(refOrName) {
    if (refOrName.typeInfo) {
        return refOrName;
    }

    var result = this.getThing(refOrName);

    if (!result) {
        throw new Error('No such item: ' + refOrName);
    }

    return result;
}

/*
Phase.prototype.addA = function(typeToAdd) {
    var typeInfo = this.model.getType(typeToAdd);
    if (!typeInfo) {
        throw new Error('No such type:' + typeToAdd);
    }

    if(!typeInfo.isTopLevel) {
        throw new Error('' + typeToAdd + ' is not a top level item, it can\'t be added to a phase.');
    }

    var thing = thingLib.create(typeInfo);
    this.contents.push(thing);
    return thing;
}
*/

function reportIssue(message, issueCallback) {
    if (issueCallback) {
        var error;
        if (message.message) {
            error = message;
        } else {
            error = new Error(message);
        }
        issueCallback(error);
    } else {
        console.log(message);
    }
}


function listUnusedVerbs (item) {
    var result = [];
    item.typeInfo.verbList.forEach(function(definedVerb) {
        if (item.verbUse) {
            var callCount = item.verbUse[definedVerb];
            if (!callCount || callCount === 0) {
                result.push(definedVerb);
            }
        } else {
            result.push(definedVerb);
        }
    });

    return result;
}

function getDescriptor(thing) {
    return thing.typeInfo.typeName + ' \'' + thing.name + '\'';
}

function quote(name) {
    return '\'' + name + '\'';
}

SystemModel.prototype.check = function (phase, issueCallback) {

    if (!this.activePhase) {
        reportIssue('Can\'t perform a check without an active phase.', issueCallback);
    }

    if (this.errors && this.errors.length > 0) {
        this.errors.forEach(function(error) {
            reportIssue(error, issueCallback);
        });
    }


    var theModel = this;
    theModel.things.forEach(function(thing) {

        if (thing.lastModifiedPhase === theModel.activePhase) {
            if (thing.typeInfo.isActor) {
                if (!thing.actions || thing.actions.length === 0) {
                    var message = 'The ' + thing.typeInfo.typeName + ' \'' + thing.name +'\' must have at least one action.\n' +
                        '    Example: myItem.perform(\'insert\').on(\'myDatabaseTable\');';
                    reportIssue(message, issueCallback);
                }
            }

            if (thing.typeInfo.verbList && thing.typeInfo.verbList.length > 0) {
                var unusedVerbs = listUnusedVerbs(thing);
                if (unusedVerbs && unusedVerbs.length > 0) {
                    var message = null;
                    if (unusedVerbs.length === 1) {
                        message  = '' + unusedVerbs[0] + ' has not been used on ' + getDescriptor(thing);
                    } else {
                        message = '' + unusedVerbs.join(',') + ' have not been used on ' + getDescriptor(thing);
                    }
                    message += '\n    Example: someOtherThing.perform(' + quote(unusedVerbs[0]) + ').on(' + quote(thing.name) + ');';
                    reportIssue(message, issueCallback);
                }
            }
        }
    });
   /*
    for each thing in model
       if lastModifiedPhase == phase {
           if thingdefinition has verbs
                check if all verbs used.

            if thing.isActor
                check it has at least one actor.
       }
*/
}


function  create () {
    return new SystemModel();
}

module.exports.create = create;
