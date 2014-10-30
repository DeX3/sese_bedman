"use strict";
var Checkit = require( "checkit" );

var validator = new Checkit( {
    price: ["required","number"],
    date: "required",
    billId: "required"
} );

module.exports = function( app ) {
    
    var bookshelf = app.get( "bookshelf" );

    var Bill  = bookshelf.Model.extend( {
        tableName: "bills",
        hasTimestamps: true,
        initialize: function() {
            this.on( "saving", this.validate );
        },
        validate: function() {
            return validator.run( this.attributes );
        }
    } );
    

    return Bill;
};
