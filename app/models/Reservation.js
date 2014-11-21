"use strict";
var Checkit = require( "checkit" );
var bookshelf = require( "./base" );
require( "./Customer" );

var validator = new Checkit( {
    room:       "required",
    discount:   ["greaterThanEqualTo:0", "lessThanEqualTo:100"],
    roomCost:   "required"
} );

module.exports = bookshelf.model( "Reservation", {
    tableName: "reservation",
    customers: function() {
        return this.belongsToMany( "Customer" );
    },
    validate: function() {
        return validator.run( this.attributes );
    }
} );
