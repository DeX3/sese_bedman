"use strict";

var config = require( "config" );
var knex = require( "knex" )( config.get( "db" ) );
var bookshelf = require( "bookshelf" )( knex );
require( "sugar" );

bookshelf.plugin( "registry" );

bookshelf.Model = bookshelf.Model.extend( {
    hasTimestamps: true,

    initialize: function() {
        this.on( "updating", this.skipTimestamps );
        this.on( "saving", this.validate );
    },

    validate: function() {},

    skipTimestamps: function( model, attrs ) {
        delete attrs.created_at;
        delete attrs.updated_at;
    },

    fixDate: function( name, model, attrs ) {
        if( name in this.attributes &&
            typeof this.attributes[name] === "string" ) {
            this.attributes[name] = new Date( this.attributes[name] );
        }
    }

} );

module.exports = bookshelf;
