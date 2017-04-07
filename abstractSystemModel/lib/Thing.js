


function Thing(typeInfo) {
    this.typeInfo = typeInfo;
    this.contents = [];
    this.actions = [];
    this.verbUse = {};
}

Thing.prototype.called = function(name) {
    this.name = name;
    return this;
}

function Action() {

}

Action.prototype.on = function (targetThing) {
    // ensure target thing exist
    var model = this.performer.model;
    var target = model.resolveThing(targetThing);
    if (!target) {
         throw new Error('No such thing: ' + targetThing);
    }

    // Check not encapsulated.
    var encapsulationInfo = target.getEncapsulationInfo();
    if (encapsulationInfo.encapsulated) {

        if (!encapsulationInfo.encapsulator) {
            throw new Error('The item ' + target.name + ' cannot be accessed until ' + encapsulationInfo.encapsulatee.name + ' has been encapsulated.');
        }

        if (this.performer.parent != encapsulationInfo.encapsulator) {
            this.performer.model.addError(
            new Error('The ' + this.performer.typeInfo.typeName + ' \'' + this.performer.name + '\' cannot access ' + target.name + ' as it is encapsulated, and can only be affected by ' + encapsulationInfo.encapsulator.name));
            return this.performer;
        }
    }

    // ensure target thing has verb.
    // TODO example how to add verbs.
    if (!target.typeInfo.verbList || target.typeInfo.verbList.length === 0) {
        throw new Error('The ' + target.typeInfo.typeName + ' \'' + target.name + '\' has no verbs. Cannot perform:' + this.verb);
    }

    var index = target.typeInfo.verbList.indexOf(this.verb);
    if (index == -1) {
        throw new Error('The ' + target.typeInfo.typeName + ' \'' + target.name + '\' does not have a verb ' + this.verb + ' only - ' + target.typeInfo.verbList.join(','))
    }

    var verbUseCount = target.verbUse[this.verb];
    if (!verbUseCount) {
        verbUseCount = 0;
    }
    target.verbUse[this.verb] = verbUseCount + 1;

    this.performer.actions.push(this);
    return this.performer;
}

Thing.prototype.perform = function(verbName) {
    var result = new Action();
    result.verb = verbName;
    result.performer = this;

    return result;
}

Thing.prototype.encapsulatedBy = function(encapsulatorRef) {
    var encapsulatorThing = this.model.resolveThing(encapsulatorRef);

    if (encapsulatorThing) {
        this.encapsulator = encapsulatorThing;
    }
}

Thing.prototype.getEncapsulationInfo = function () {
    if (this.typeInfo.isEncapsulationRequired) {
        return {encapsulated: true,
                encapsulatee: this,
                encapsulator: this.encapsulator};
    } else if(this.parent != null) {
        return this.parent.getEncapsulationInfo()
    } else {
        return {encapsulated:false};
    }
}

Thing.prototype.addA = function(typeName) {
    var typeToAdd = this.typeInfo.model.getType(typeName)
    if (!typeToAdd) {
        throw new Error('No such type:' + typeName);
    }

    if (typeToAdd.isTopLevel) {
        if (!this.isRootThing) {
            throw new Error('' + typeName + ' is a top level Thing, it can not be added to a ' + this.typeInfo.typeName);
        }
    }
    else if (typeToAdd.validContainers.length === 0) {
        throw new Error('You have not specified what the type \'' + typeToAdd.typeName + '\' can be contained by.');
    } else {
        var x = typeToAdd.validContainers.indexOf(this.typeInfo);
        if (x === -1) {
            throw new Error('' + typeName + ' cannot be added to a ' + this.typeInfo.typeName);
        }
    }

    var newThing = new Thing(typeToAdd);
    newThing.model = this.model;
    this.model.things.push(newThing);
    setLastModifiedPhase(newThing, this.model.activePhase);
    this.contents.push[newThing];
    newThing.parent = this;

    return newThing;
}

function setLastModifiedPhase(thing, phase) {
    thing.lastModifiedPhase = phase;
}

function create(typeInfo) {
    return new Thing(typeInfo);
}

module.exports.create = create;
