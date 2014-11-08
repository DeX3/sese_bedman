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
            this.on( "saving", this.parseDate );
            this.on( "updating", this.skipTimestamps );
        },
        parseDate: function( model, attrs, options ) {
            if( "date" in this.attributes &&
                typeof this.attributes.date === "string" ) {
                this.attributes.date = new Date( this.attributes.date );
            }
        },
        skipTimestamps: function( model, attrs ) {
            delete attrs.created_at;
            delete attrs.updated_at;
        },
        validate: function() {
            return validator.run( this.attributes );
        }
    } );
    

    return Bill;
};
