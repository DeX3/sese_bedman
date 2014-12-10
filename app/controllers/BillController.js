"use strict";

var DefaultController = require( "./DefaultController" );

module.exports.setup = function( app ) {

    var models = app.get( "models" );
    var Bill = models.Bill;

    var ctrl = {};
    ctrl.index = DefaultController.index.bind( null, Bill );
    ctrl.get = function( req, res ) {

        var id = req.params.id;

        Bill.where( {id: id} ).fetch(
            { withRelated: "customer" }
        ).then( function( result ) {
            if( !result ) {
                res.status( 404 ).send();
            } else {
                res.json( result );
            }
        } ).catch( function(error) {
            console.error( error );
            res.status( 500 ).json( error );
        } );
        
    };

    ctrl.create = DefaultController.create.bind( null, Bill );
    ctrl.update = DefaultController.update.bind( null, Bill );
    ctrl.destroy = DefaultController.destroy.bind( null, Bill );

    return ctrl;
};

