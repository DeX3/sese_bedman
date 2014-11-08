"use strict";
var Checkit = require( "checkit" );
var bookshelf = require( "./base" );

var validator = new Checkit( {
	name : 'required',
	maxCap : 'required',
	priceSingle : 'greaterThan:0'
} );

module.exports = bookshelf.model( "Room", {
    tableName: "rooms",
    hasTimestamps: true,
    initialize: function() {
        this.on( "saving", this.validate );
    },
    validate: function() {
        return validator.run( this.attributes );
    }
} );
