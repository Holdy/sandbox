


function TypeInfo(typeName) {
    this.typeName = typeName;
    this.verbList = [];
}

TypeInfo.prototype.canBeContainedBy = function() {
    for(var i = 0; i < arguments.length; i++) {
        var typeName = arguments[i];
        var typeInfo = this.model.getType(typeName);
        if (!typeInfo) {
            throw new Error('Unknown type:' + typeName);
        }
        this.validContainers.push(typeInfo);
    }
    return this;
};

TypeInfo.prototype.verbs = function() {
    for (var i = 0; i < arguments.length; i++) {
        var verb = arguments[i];
        this.verbList.push(verb);
    }
    return this;
};

TypeInfo.prototype.requireEncapsulation = function () {
    this.isEncapsulationRequired = true;
}

function create(typeName) {
    var t = new TypeInfo(typeName);
    return t;
}


module.exports.create = create;
