"use strict";
var Checkit = require( "checkit" );

var validator = new Checkit( {
    customers: ["required", "array"] ,
    room: "required",
    discount: "between:0:1",
    roomCost: ["required", "numeric"]
} );

module.exports = function( app ) {
    
    var bookshelf = app.get( "bookshelf" );

    var Reservation = bookshelf.Model.extend( {
        tableName: "reservation",
        hasTimestamps: true,
        initialize: function() {
            this.on( "saving", this.validate );
        },
        validate: function() {
            return validator.run( this.attributes );
        }
    } );
    

    return Reservation;
};
