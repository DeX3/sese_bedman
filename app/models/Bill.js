"use strict";
var Checkit = require( "checkit" );
var bookshelf = require( "./base" );

var validator = new Checkit( {
    price: ["required","number"],
    date: "required",
    billId: "required"
} );

module.exports = bookshelf.model( "Bill", {
    tableName: "bills",
    hasTimestamps: true,
    initialize: function() {
        this.on( "saving", this.fixDate.bind(this, "date") );
    },
    validate: function() {
        return validator.run( this.attributes );
    }
} );
