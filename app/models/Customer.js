"use strict";
var Checkit = require( "checkit" );

var validator = new Checkit( {
    firstName: "required",
    lastName: "required",
    company: "required",
    email: ["required", "email"]
} );

module.exports = function( app ) {
    
    var bookshelf = app.get( "bookshelf" );

    var User = bookshelf.Model.extend( {
        tableName: "customers",
        hasTimestamps: true,
        initialize: function() {
            this.on( "saving", this.validate );
        },
        validate: function() {
            return validator.run( this.attributes );
        }
    } );
    

    return User;
};
