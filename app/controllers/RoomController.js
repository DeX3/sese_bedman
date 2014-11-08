"use strict";

var DefaultController = require( "./DefaultController" );

module.exports.setup = function( app ) {

    var models = app.get( "models" );
    var Room = models.Room;

    var ctrl = {};
    ctrl.index = DefaultController.index.bind( null, Room );
    ctrl.get = DefaultController.get.bind( null, Room );
    ctrl.create = DefaultController.create.bind( null, Room );
    ctrl.update = DefaultController.update.bind( null, Room );
    ctrl.destroy = DefaultController.destroy.bind( null, Room );

    return ctrl;
};

