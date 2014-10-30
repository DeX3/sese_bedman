"use strict";

var DefaultController = require( "./DefaultController" );

module.exports.setup = function( app ) {

    var models = app.get( "models" );
    var Bill = models.Bill;

    var ctrl = {};
    ctrl.index = DefaultController.index.bind( null, Bill );
    ctrl.get = DefaultController.get.bind( null, Bill );
    ctrl.create = DefaultController.create.bind( null, Bill );
    ctrl.update = DefaultController.update.bind( null, Bill );
    ctrl.destroy = DefaultController.destroy.bind( null, Bill );

    return ctrl;
};

