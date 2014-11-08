"use strict";
var Checkit = require( "checkit" );
var bookshelf = require( "./base" );

var validator = new Checkit( {
    price: ["required", "number"],
    date: "required",
    billId: "required"
} );

module.exports = bookshelf.Model.extend( {
    tableName: "bills",
    hasTimestamps: true,
    initialize: function() {
        bookshelf.Model.prototype.initialize.apply( this, arguments );

        this.on( "saving", this.fixDate.bind(this, "date") );
        this.on( "saving", this.validate );
    },
    validate: function() {
        return validator.run( this.attributes );
    }
} );
