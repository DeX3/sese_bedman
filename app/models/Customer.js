"use strict";
var Checkit = require( "checkit" );
var bookshelf = require( "./ModelBase" );

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
    bills: function() {
        return this.hasMany( "bills" );
    },
    validate: function() {
        return validator.run( this.attributes );
    },
} );
