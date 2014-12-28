"use strict";

var ControllerBase = require( "./ControllerBase" );
var Bill = require( "../models/Bill" );
var bookshelf = require( "../models/ModelBase" );
var CheckitError = require( "checkit" ).Error;
var BPromise = require( "bluebird" );

module.exports = ControllerBase.extend( {

    Model: Bill,

    pagination: {
        perPage: 10
    },

    get: function( req, res ) {

        var self = this;
        var id = req.params.id;

        Bill.where( {id: id} ).fetch(
            { withRelated: ["customer",
                            "reservations",
                            "reservations.customers"] }
        ).then( function( bill ) {
            if( !bill ) {
                return null;
            } else {
                return self.getBillDetails( bill.id ).then( function(details) {
                    var ret = bill.toJSON();
                    ret.details = details;
                    return ret;
                } );
            }
            
        } ).then( function( bill ) {
            if( bill ) {
                res.json( bill );
            } else {
                res.status( 404 ).send();
            }
        } ).catch( function(error) {
            console.error( error );
            res.status( 500 ).json( error );
        } );
        
    },

    create: function( req, res ) {

        var self = this;
        var data = Object.merge( req.body, req.query );

        var reservations = data.reservations;
        delete data.reservations;

        bookshelf.transaction( function( tx ) {
            return Bill.forge( data ).save().then( function( bill ) {
                return bill.updateReservations( reservations,
                                                { transacting: tx } );
            } ).then( function( bill ) {
                return self.getBillDetails(
                    bill.id,
                    { transacting: tx }
                ).then( function( details ) {
                    console.log( "got details" );
                    return bill.save(
                        { price: details.total },
                        { patch: true, transacting: tx }
                    ).then( function( bill ) {
                        console.log( "saved bill again" );
                        var ret = bill.toJSON();
                        ret.details = details;

                        console.dir( ret );

                        return ret;
                    } );
                } );
            } );
        } ).then( function( bill ) {
            res.status( 201 ).json( bill );
        } ).catch( CheckitError, function( error ) {
            res.status( 400 ).json( error );
        } ).catch( function(error) {
            console.error( error );
            res.status( 500 ).json( error );
        } );
    },

    update: function( req, res ) {

        var self = this;
        var id = req.params.id;
        var data = Object.merge( req.body, req.query );

        var reservations = data.reservations;
        delete data.reservations;

        bookshelf.transaction( function( tx ) {
            return Bill.where( { id: id } ).fetch(
                { transacting: tx }
            ).then( function( bill ) {
                if( bill ) {
                    return bill.save( data ).then( function( savedBill ) {
                        return bill.updateReservations( reservations,
                                                        { transacting: tx } );
                    } ).then( function( bill ) {
                        return self.getBillDetails( bill.id ).then( function( details ) {
                            bill.set( "price", details.total );
                            return bill.save(
                                { price: details.total },
                                { patch: true, transacting: tx }
                            ).then( function( bill ) {
                                var ret = bill.toJSON();
                                ret.details = details;

                                return ret;
                            } );
                        } );
                    } );
                }

                return null;
            } );
        } ).then( function( bill ) {
            if( bill ) {
                res.json( bill );
            } else {
                res.status( 404 ).send();
            }
        } ).catch( CheckitError, function( error ) {
            res.status( 400 ).json( error );
        } ).catch( function(error) {
            console.error( error );
            res.status( 500 ).json( error );
        } );
    },

    getBillDetails: function( billId, options ) {

        var billDetails = {
            reservations: [],
            total: 0.0
        };

        options = options || {};

        return Bill.where( {id: billId} ).fetch(
            {
                withRelated: ["customer",
                            "reservations",
                            "reservations.customers",
                            "reservations.rooms"],
                transacting: options.transacting
            }
        ).then( function( bill ) {

            return BPromise.all( [
                bill,
                bill.related( "reservations" ).fetch(
                    { transacting: options.transacting }
                ),
                bill.related( "customer" ).fetch(
                    { transacting: options.transacting }
                )
            ] );

        } ).then( function( results ) {

            var bill = results[0];
            var reservations = results[1];
            var payer = results[2];

            if( !bill ) {
                return null;
            }

            var promises = reservations.map( function( reservation ) {
                reservation.fixDateOut( "from", reservation );
                reservation.fixDateOut( "to", reservation );

                return reservation.rooms().fetch(
                    { transacting: options.transacting }
                ).then( function( rooms ) {

                    var reservationDetails = {
                        id: reservation.id,
                        rooms: [],
                        from: reservation.get("from"),
                        to: reservation.get("to"),
                        days: reservation.duration(),
                        subtotal: 0.0
                    };

                    rooms.forEach( function( room ) {
                        
                        var config = room.pivot.get( "configuration" );
                        var roomDetails = {
                            name: room.get( "name" ),
                            configuration: config,
                            dailyRate: room.getDailyRate(),
                            rate: room.getDailyRate() * reservationDetails.days
                        };

                        reservationDetails.subtotal += roomDetails.rate;
                        reservationDetails.rooms.push( roomDetails );
                    } );

                    return reservationDetails;

                } ).then( function( reservationDetails ) {

                    return reservation.customers().fetch(
                        { transacting: options.transacting }
                    ).then( function( customers ) {
                        
                        var bestCustomer = payer;

                        customers.forEach( function( customer ) {
                            if( !bestCustomer ||
                               customer.discount < bestCustomer.discount ) {

                                bestCustomer = customer;
                            }
                        } );

                        reservationDetails.discountCustomer = bestCustomer.toJSON();
                        reservationDetails.discountPercent =
                            bestCustomer.get("discount") || 0;

                        reservationDetails.discount = reservationDetails.subtotal * 
                                         (reservationDetails.discountPercent/100.0);

                        reservationDetails.total = reservationDetails.subtotal - 
                                                   reservationDetails.discount;

                        billDetails.reservations.push( reservationDetails );
                        billDetails.total += reservationDetails.total;

                        return reservationDetails;
                    } );
                } );

            } );
            
            return BPromise.all( promises );
        } ).then( function() {

            return billDetails;
        } );
    },

    details: function( req, res ) {
        
        this.getBillDetails(
            req.params.id,
            req.query.customer ).then( function( billDetails ) {
            
            if( billDetails ) {
                res.json( billDetails );
            } else {
                res.status( 404 ).send();
            }
        } ).catch( function(error) {
            console.error( error );
            res.status( 500 ).json( error );
        } );
        
    }

} );

