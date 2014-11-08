"use strict";
var Checkit = require( "checkit" );

var validator = new Checkit( {
    firstName: "required",
    lastName: "required",
    company: "required",
    phone: "required",
    email: ["required", "email"]
} );

module.exports = function( app ) {
    
    var bookshelf = app.get( "bookshelf" );

    var User = bookshelf.Model.extend( {
        tableName: "customers",
        hasTimestamps: true,
        initialize: function() {
            this.on( "updating", this.skipTimestamps );
            this.on( "saving", this.validate );
        },
        skipTimestamps: function( model, attrs ) {
            delete attrs.created_at;
            delete attrs.updated_at;
        },
        validate: function() {
            return validator.run( this.attributes );
        }
    } );
    

    return User;
};
