"use strict";
var Checkit = require( "checkit" );

var validator = new Checkit( {
    customer:   "required",
    price:       "required",
    date:   "date",
    receiptnumber:   "required"
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
