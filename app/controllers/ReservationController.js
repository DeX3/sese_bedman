"use strict";

var ControllerBase = require( "./ControllerBase" );
var Reservation = require( "../models/Reservation" );
var bookshelf = require( "../models/ModelBase" );
var CheckitError = require( "checkit" ).Error;
var _ = require( "underscore" );

module.exports = ControllerBase.extend( {

    Model: Reservation,

    pagination: {
        perPage: 10
    },

    index: function( req, res ) {
        var query = Reservation.query();

        //check if a search query is specified
        query.select( "reservation.*" );

        query.leftJoin( "customers_reservation",
                         "reservation.id",
                         "customers_reservation.reservation_id" );

        query.leftJoin( "customers",
                         "customers_reservation.customer_id",
                         "customers.id" );

        query.distinct();

        if( req.query.billed === 'false' ) {
            query = query.whereNull( "bill_id" );
        } else if( req.query.billed === true ) {
            query = query.whereNotNull( "bill_id" );
        }


        if( req.query.s ) {
            var terms = req.query.s.split( /\s/ );

            var searchable = [ "customers.firstName",
                               "customers.lastName",
                               "customers.company" ];
            
            query = query.andWhere( function() {
                var self = this;
                _.each( terms, function( term ) {
                    _.each( searchable, function( columnName ) {
                        self.orWhere( columnName,
                                                 "LIKE",
                                                 "%" + term + "%" );
                    } );
                } );
            } );

        }

        var p;
        // if pagination is specified
        // if pagination is set to "auto", only paginate if "page" is present
        if( this.pagination &&
            (this.pagination.type !== "auto" || req.query.page) ) {

            p = this.paginate(
                query,
                req.query
            ).then( function(results) {
                return results.items.load(
                    ["customers", "rooms"]
                ).then( function() {
                    return results;
                } );
            } );
        } else {
            p = query.select().then( function( results ) {
                return Reservation.collection( results );
            } );
        }
        
        p.then( function( results ) {
            res.json( results );
        } ).catch( function(error) {
            console.error( error );
            res.status( 500 ).json( error );
        } );
        
    },

    update: function( req, res ) {

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
                    } ).then( function() {
                        return reservation.updateCustomers( customers,
                                                            {transacting: tx} );
                    } ).then( function() {
                        return reservation.updateRooms( rooms,
                                                        {transacting: tx} );
                    } ).then( function( reservation ) {
                        res.status( 200 ).json( reservation );
                    } );
                }
            } );

        } ).catch( CheckitError, function( error ) {
            res.status( 400 ).json( error );
        } ).catch( function( error ) {
            console.error( error );
            res.status( 500 ).json( error );
        } );
    },

    create: function( req, res ) {
        
        var data = Object.merge( req.body, req.query );
        var customers = data.customers;
        delete data.customers;
        var rooms = data.rooms;
        delete data.rooms;

        bookshelf.transaction( function(tx) {
            return Reservation.forge( data ).save(
                {transacting: tx}
            ).then( function( reservation ) {
                return reservation.updateCustomers( customers,
                                                    {transacting: tx} );
            } ).then( function( reservation ) {
                return reservation.updateRooms( rooms, {transacting: tx} );
            } );
        } ).then( function( reservation ) {
            res.status( 201 ).json( reservation );
        } ).catch( CheckitError, function(error) {
            res.status( 400 ).json( error );
        } ).catch( function(error) {
            console.error( error );
            res.status( 500 ).json( error );
        } );
    },

    get: function( req, res ) {
        
        var id = req.params.id;

        Reservation.where( {id: id} ).fetch(
            { withRelated: ["customers","rooms"] }
        ).then( function( result ) {
            if( !result ) {
                res.status( 404 ).send();
            } else {
                var resp = result.toJSON();
                resp.rooms = resp.rooms.map( function( room ) {
                    room.configuration = room._pivot_configuration;
                    delete room._pivot_configuration;
                    return room;
                } );
                res.json( resp );
            }
        } ).catch( function(error) {
            console.error( error );
            res.status( 500 ).json( error );
        } );
    }

} );

