"use strict";

var config = require( "config" );
var knex = require( "knex" )( config.get( "db" ) );
var bookshelf = require( "bookshelf" )( knex );
require( "sugar" );

bookshelf.plugin( "registry" );

var schema = {};

bookshelf.Model = bookshelf.Model.extend( {
    hasTimestamps: true,

    initialize: function() {
        this.on( "updating", this.skipTimestamps );
        this.on( "saving", this.validate );


        var tableSchema = schema[this.tableName];
        for( var name in tableSchema ) {
            if( tableSchema.hasOwnProperty(name) ) {
                var columnInfo = tableSchema[name];
                if( columnInfo.type === "datetime" ) {
                    this.on( "saving", this.fixDateTimeIn.bind(this, name) );
                } else if( columnInfo.type === "date" ) {
                    this.on( "saving", this.fixDateIn.bind(this, name) );
                    this.on( "fetched", this.fixDateOut.bind(this, name) );
                }
            }
        }
    },

    skipTimestamps: function( model, attrs ) {
        delete attrs.created_at;
        delete attrs.updated_at;
    },

    fixDateTimeIn: function( name, model, attrs ) {

        if( name in this.attributes &&
            typeof this.attributes[name] === "string" ) {
            this.attributes[name] = new Date( this.attributes[name] );
        }
    },

    fixDateIn: function( name, model, attrs ) {
    },

    fixDateOut: function( name, model, resp, options ) {

        if( model.attributes[name] ) {
            var date = model.attributes[name];
            model.attributes[name] = date.getFullYear() + "-" +
                                      (date.getMonth() + 1) + "-" +
                                      date.getDate();
        }
    }

} );


var originalExtend = bookshelf.Model.extend;
bookshelf.Model.extend = function( options ) {

    var ret = originalExtend.apply( this, arguments );

    knex( options.tableName ).columnInfo().then( function( info ) {

        schema[options.tableName] = info;
    } );


    return ret;
};

module.exports = bookshelf;
