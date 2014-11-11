"use strict";

var DefaultController = require( "./DefaultController" );

module.exports.setup = function( app ) {

    var models = app.get( "models" );
    var Reservation = models.Reservation;

    var ctrl = {};
    ctrl.index = DefaultController.index.bind( null, Reservation );
    ctrl.destroy = DefaultController.destroy.bind( null, Reservation );

    var updateCustomers = function( customers, reservation ) {

        reservation.customers().forEach( function( customer ) {
            reservation.customers().detach( customer );
        } );

        customers.forEach( function( customer ) {
            reservation.customers().attach( customer );
        } );

        return reservation;
    };

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
                    updateCustomers.bind( null, customers )
                );
            }
        } ).catch( function( error ) {
            res.status( 500 ).json( error );
        } );
    };

    ctrl.create = function( req, res ) {
        
        var data = Object.merge( req.body, req.query );
        var customers = data.customers;
        delete data.customers;

        //TODO transaction?
        Reservation.forge( data ).save().then( 
            updateCustomers.bind( null, customers )
        ).then( function( reservation ) {
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

