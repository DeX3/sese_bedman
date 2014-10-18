"use strict";

var DefaultController = require( "./DefaultController" );

module.exports.setup = function( app ) {

    var models = app.get( "models" );
    var Customer = models.Customer;

    var ctrl = {};
    ctrl.index = DefaultController.index.bind( null, Customer );
    ctrl.get = DefaultController.get.bind( null, Customer );
    ctrl.create = DefaultController.create.bind( null, Customer );
    ctrl.update = DefaultController.update.bind( null, Customer );
    ctrl.destroy = DefaultController.destroy.bind( null, Customer );

    return ctrl;
};

