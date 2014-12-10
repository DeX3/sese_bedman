"use strict";

var DefaultController = require( "./DefaultController" );
var CheckitError = require( "checkit" ).Error;

module.exports.setup = function( app ) {

    var models = app.get( "models" );
    var Reservation = models.Reservation;
    var bookshelf = app.get( "bookshelf" );

    var ctrl = {};
    ctrl.index = DefaultController.index.bind( null, Reservation );
    ctrl.destroy = DefaultController.destroy.bind( null, Reservation );

    var updateRelation = function( tx, relationName, data, reservation ) {
        
        if( typeof data !== "undefined" ) {
            return reservation.related(
                relationName
            ).fetch( {transacting: tx} ).then( function( fetchedList ) {

                fetchedList.forEach( function( fetched ) {
                    return reservation[relationName]().detach(
                        fetched,
                        { transacting: tx } 
                    );
                } );

                data.forEach( function( toAttach ) {
                    reservation[relationName]().attach(
                        toAttach,
                        { transacting: tx }
                    );
                } );

                return reservation;
            } );
        }

        return reservation;
    };


    ctrl.update = function( req, res ) {

        var id = req.params.id;
        var data = Object.merge( req.body, req.query );

        bookshelf.transaction( function( tx ) {

            return Reservation.where( { id: id } ).fetch( 
                { transacting: tx, withRelated: ["customers", "rooms"] }
            ).then( function( reservation ) {
                if( !reservation ) {
                    res.status( 404 ).send();
                } else {

                    var customers = data.customers;
                    delete data.customers;
                    var rooms = data.rooms;
                    delete data.rooms;

                    return reservation.save( data, {
                        patch: true,
                        transacting: tx
                    } ).then(
                        updateRelation.bind( null, tx, "customers", customers )
					).then(
						updateRelation.bind( null, tx, "rooms", rooms )
                    ).then( function( reservation ) {
                        res.status( 200 ).json( reservation );
                    } );
                }
            } );

        } ).catch( CheckitError, function( error ) {
            res.status( 400 ).json( error );
        } ).catch( function( error ) {
            console.log( error );
            res.status( 500 ).json( error );
        } );
    };

    ctrl.create = function( req, res ) {
        
        var data = Object.merge( req.body, req.query );
        var customers = data.customers;
        delete data.customers;
		var rooms = data.rooms;
        delete data.rooms;

        bookshelf.transaction( function(tx) {
            return Reservation.forge( data ).save( {transacting: tx} ).then(
                    updateRelation.bind( null, tx, "customers", customers )
				).then(
                    updateRelation.bind( null, tx, "rooms", rooms )
            );
        } ).then( function( reservation ) {
            res.status( 201 ).json( reservation );
        } ).catch( CheckitError, function(error) {
            res.status( 400 ).json( error );
        } ).catch( function(error) {
            console.error( error );
            res.status( 500 ).json( error );
        } );
    };

    ctrl.get = function( req, res ) {
        
        var id = req.params.id;

        Reservation.where( {id: id} ).fetch(
            { withRelated: ["customers","rooms"]}
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

