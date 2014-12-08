"use strict";
var Checkit = require( "checkit" );
var bookshelf = require( "./base" );
require("./Customer.js");

var validator = new Checkit( {
    price: ["required", "number"],
    date: "required",
    billId: "required"
} );

module.exports = bookshelf.model( "Bill", {
    tableName: "bills",
    cutsomer: function(){
	return this.belongsTo("Customer")
    }
    validate: function() {
        return validator.run( this.attributes );
    }
} );
