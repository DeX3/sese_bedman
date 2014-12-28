"use strict";
var BPromise = require( "bluebird" );
var Checkit = require( "checkit" );
var bookshelf = require( "./ModelBase" );
var Reservation = require( "./Reservation" );
require("./Customer.js");

var validator = new Checkit( {
    price: ["number"],
    date: "required"
} );

module.exports = bookshelf.model( "Bill", {
    tableName: "bills",
    customer: function(){
        return this.belongsTo("Customer");
    },
    reservations: function() {
        return this.hasMany( "Reservation" );
    },
    validate: function() {
        return validator.run( this.attributes );
    },
    updateReservations: function( reservations, options ) {
        
        var self = this;

        //make sure `reservations` only consists of ids
        reservations = reservations.map( function( res ) {
            return res.id || res;
        } );

        options = options || {};
        var tx = options.transacting;

        return this.fetch( { withRelated: "reservations" },
                           { transacting: tx } ).then( function( bill ) {

            var promises = [];
            //first, free current reservations if they are no longer included
            //in the new set
            bill.related( "reservations" ).forEach( function( res ) {
                if( reservations.indexOf(res.id) < 0 ) {
                    promises.push( 
                        res.save( { "bill_id": null },
                                  { patch: true, transacting: tx } )
                    );
                }
            } );

            return BPromise.all( promises ).then( function() {
                return BPromise.all( reservations.map( function( id ) {
                    return Reservation.where(
                        { id: id }
                    ).fetch( {transacting: tx} ).then( function(res) {
                        return res.save(
                            { "bill_id": self.id },
                            { patch: true, transacting: tx }
                        );
                    } );
                } ) );
            } ).then( function() {
                return self;
            } );

        } );
    }
} );
