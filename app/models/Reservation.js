"use strict";
var Checkit = require( "checkit" );
var bookshelf = require( "./base" );
require( "./Customer" );
require( "./Room" );

var validator = new Checkit( {
    discount:   ["greaterThanEqualTo:0", "lessThanEqualTo:100"],
    roomCost:   "required"
} );

module.exports = bookshelf.model( "Reservation", {
    tableName: "reservation",
    customers: function() {
        return this.belongsToMany( "Customer" );
    },
	rooms: function(){
		return this.belongsToMany("Room");
	},
    validate: function( model, attrs, options ) {
        
        return validator.run( this.attributes );
    }
} );
