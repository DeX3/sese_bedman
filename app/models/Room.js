"use strict";
var Checkit = require( "checkit" );

var validator = new Checkit( {
	name : 'required',
	maxCap : 'required',
	priceSingle : 'greaterThan:0'
} );

module.exports = function( app ) {
    
    var bookshelf = app.get( "bookshelf" );

    var Room = bookshelf.Model.extend( {
        tableName: "rooms",
        hasTimestamps: true,
        initialize: function() {
            this.on( "saving", this.validate );
        },
        validate: function() {
            return validator.run( this.attributes );
        }
    } );
    

    return Room;
};
