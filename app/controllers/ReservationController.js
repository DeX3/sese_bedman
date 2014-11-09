"use strict";

var DefaultController = require( "./DefaultController" );

module.exports.setup = function( app ) {

    var models = app.get( "models" );
    var Reservation = models.Reservation;

    var ctrl = {};
    ctrl.index = DefaultController.index.bind( null, Reservation );
    ctrl.destroy = DefaultController.destroy.bind( null, Reservation );

    ctrl.update = function( req, res ) {

        var id = req.params.id;
        var data = Object.merge( req.body, req.query );

        Reservation.where( { id: id } ).fetch( 
            { withRelated: "customers" }
        ).then( function( reservation ) {
            if( !reservation ) {
                res.status( 404 ).send();
            } else {

                var customers = data.customers;
                delete data.customers;
                //TODO transaction?
                return reservation.save( data, { patch: true } ).then(
                    function(savedReservation) {
                    
                    for( var i=0 ; i < reservation.customers.length ; i++ ) {
                        reservation.customers().detach( reservation.customers[i] );
                    }

                    for( i=0 ; i < customers.length ; i++ ) {
                        reservation.customers().attach( customers[i] );
                    }

                    res.status( 200 ).json( reservation );
                } );
            }
        } ).catch( function( error ) {
            console.dir( error );
            res.status( 500 ).json( error );
        } );
    };

    ctrl.create = function( req, res ) {
        
        var data = Object.merge( req.body, req.query );

        console.dir( data );

        Reservation.forge( data ).save().then( function( reservation ) {
            res.status( 201 ).json( reservation );
        } ).catch( function(error) {
            res.status( 500 ).json( error );
        } );
    };

    ctrl.get = function( req, res ) {
        
        var id = req.params.id;

        Reservation.where( {id: id} ).fetch(
            { withRelated: "customers" }
        ).then( function( result ) {
            if( !result ) {
                res.status( 404 ).send();
            } else {
                res.json( result );
            }
        } ).catch( function(error) {
            res.status( 500 ).json( error );
        } );
    };

    return ctrl;
};

