"use strict";

var DefaultController = require( "./DefaultController" );

module.exports.setup = function( app ) {

    var models = app.get( "models" );
    var Reservation = models.Reservation;

    var ctrl = {};
    ctrl.index = DefaultController.index.bind( null, Reservation );
    ctrl.get = DefaultController.get.bind( null, Reservation );
    ctrl.create = DefaultController.create.bind( null, Reservation );
    ctrl.update = DefaultController.update.bind( null, Reservation );
    ctrl.destroy = DefaultController.destroy.bind( null, Reservation );

    return ctrl;
};

