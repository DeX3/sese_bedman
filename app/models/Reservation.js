"use strict";
var Checkit = require( "checkit" );
var bookshelf = require( "./base" );
var _ = require( "underscore" );
require( "./Customer" );
require( "./Room" );

var validator = new Checkit( {
    discount:   ["greaterThanEqualTo:0", "lessThanEqualTo:100"],
    to: ["required",
         function( val ) {
             if( val < this.target.from ) {
                 throw new Error( "The to-date must be greater than or equal to" +
                                  " the from-date" );
             }
         }
    ],
    from: "required"
} );

module.exports = bookshelf.model( "Reservation", {
    tableName: "reservation",
    customers: function() {
        return this.belongsToMany( "Customer" );
    },
	rooms: function(){
		return this.belongsToMany("Room").withPivot("configuration");
	},
    validate: function( model, attrs, options ) {
        return validator.run( this.attributes );
    },
    updateCustomers: function( customers, options ) {
        return this.updateRelation( "customers", customers, options );
    },
    updateRooms: function( rooms, options ) {
        var opts = _.extend( { pivots: ["configuration"] }, options );
        return this.updateRelation( "rooms", rooms, opts );
    }
} );
