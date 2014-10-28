"use strict";
var Checkit = require( "checkit" );

var validator = new Checkit( {
    customer:   "required",
    room:       "required",
    discount:   ["greaterThanEqualTo:0", "lessThanEqualTo:100"],
    roomCost:   "required"
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
