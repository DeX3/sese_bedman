"use strict";
var Checkit = require( "checkit" );
var bookshelf = require( "./base" );

require( "./Reservation" );

var validator = new Checkit( {
    firstName: "required",
    lastName: "required",
    company: "required",
    phone: "required",
    email: ["required", "email"]
} );

module.exports = bookshelf.model( "Customer", {
    tableName: "customers",
    reservations: function() {
        return this.belongsToMany( "Reservation" );
    },
    validate: function() {
        return validator.run( this.attributes );
    }
} );
