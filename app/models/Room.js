"use strict";
var Checkit = require( "checkit" );
var bookshelf = require( "./ModelBase" );

var validator = new Checkit( {
    name : 'required',
    maxCap : 'required',
    priceSingle : 'greaterThan:0'
} );

var PRICE_MAP = {
    "SINGLE": "priceSingle",
    "DOUBLE": "priceDouble",
    "TRIPLE": "priceTriple",
    "SINGLE1CHILD": "priceSingleChild",
    "SINGLE2CHILDREN": "priceSingleTwoChildren",
    "DOUBLE1CHILD": "priceDoubleChild"
};

var Room = bookshelf.model( "Room", {
    tableName: "rooms",
    validate: function() {
        return validator.run( this.attributes );
    },
	reservations: function(){
		return this.belongsToMany("Reservations").withPivot("configuration");
	},
    getDailyRate: function() {
        var config = null;

        if( this.configuration ) {
            config = this.configuration;
        } else if( this.pivot &&
                   this.pivot.has( "configuration" ) ) {
            config = this.pivot.get( "configuration" );
        } else {
            return null;
        }

        return this.get( PRICE_MAP[config] );
    }
} );

module.exports = Room;
