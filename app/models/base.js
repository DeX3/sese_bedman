/**
 * @file Defines the base model class that all models extend from. It will setup
 * bookshelf so that models may use it accordingly. Each model inherited from
 * the base model will have a `created_at` and an `updated_at` property. Keeping
 * this property up-to-date is handled by the base model.
 *
 * The base model also makes sure that only attributes declared as writable can
 * be persisted to the database. By default, every column in the backing table
 * is writable. If the Model passes a `writableAttributes` array when extending,
 * ***only the attributes specified there will be writable***.
 *
 * Child classes may specify a `validate` member function that will
 * automatically be called on save.
 *
 * This module exports the modified `bookshelf` object, so that models may use
 * it.
 */

"use strict";

var config = require( "config" );
var knex = require( "knex" )( config.get( "db" ) );
var bookshelf = require( "bookshelf" )( knex );
var Promise = require( "bluebird" );
require( "sugar" );

bookshelf.plugin( "registry" );

// will be filled with metadata for each defined model
var schema = {};
var schemaPromises = [];

/**
 * Replaces bookshelf's base model with our own base model.
 * @class Model
 */
bookshelf.Model = bookshelf.Model.extend( {
    hasTimestamps: true,

    /**
     * Called whenever someone initializes a new model using `new`.
     * Model classes ***must call this*** when they override this method.
     *
     * @memberof Model#
     * @protected
     */
    initialize: function() {

        var self = this;
        //makes sure that only whitelisted attributes can be updated
        this.on( "saving", this.filterAttributes.bind(this) );

        //makes sure that this.validate is called on save
        this.on( "saving", this.validate.bind(this) );

        //by default, all columns (except the timestamp columns) are writable
        //this array is filled later on
        this.writableAttributes = [];

        var customWritableProvided = "writable" in this;

        // rely on the schema object that has been updated whenever a model is
        // created through our overwritten bookshelf.extend function
        var tableSchema = schema[this.tableName];
        Object.each( tableSchema, function( name, columnInfo ) {

            // add fixer functions for date(time) columns
            if( columnInfo.type === "datetime" ) {
                self.on( "saving", self.fixDateTimeIn.bind(self, name) );
            } else if( columnInfo.type === "date" ) {
                self.on( "fetched", self.fixDateOut.bind(self, name) );
            }
            
            // if the child class does not specify custom
            // writable attributes, assume sane defaults
            if( !customWritableProvided &&
                name !== "created_at" &&
                name !== "updated_at" ) {
                self.writableAttributes.push( name );
            }

        } );
    },

    /**
     * Called on saving. Removes non-writable attributes from the model, before
     * they reach the database. As this typically removes timestamps as well,
     * they are set again after removal.
     *
     * @memberof Model#
     * @private
     */
    filterAttributes: function( model, attrs, options ) {

        this.attributes = this.pick( this.writableAttributes );

        if( this.writableAttributes.indexOf("updated_at") < 0 ) {
            this.attributes.updated_at = new Date();
        }

        if( !this.attributes.created_at ) {
            this.attributes.created_at = this.attributes.updated_at;
        }
    },

    /**
     * Called on saving for each date(time)-attribute. This will convert
     * attributes that are strings, but declared as date(time) according to the
     * schema to dates.
     *
     * @memberof Model#
     * @private
     */
    fixDateTimeIn: function( name, model, attrs ) {

        if( name in this.attributes &&
            typeof this.attributes[name] === "string" ) {
            this.attributes[name] = new Date( this.attributes[name] );
        }
    },

    /**
     * This will convert date-columns (they come as a javascript date object,
     * that includes time...) to a string of the format `YYYY-M-D` for each
     * fetched model.
     *
     * @memberof Model#
     * @private
     */
    fixDateOut: function( name, model, resp, options ) {

        if( model.attributes[name] ) {
            var date = model.attributes[name];
            model.attributes[name] = date.getFullYear() + "-" +
                                      (date.getMonth() + 1) + "-" +
                                      date.getDate();
        }
    }

} );


// overwrite bookshelf's extend so that the model's schema gets added to the
// schema object
var originalExtend = bookshelf.Model.extend;

/**
 * Create a new model class, extending from the base. This will check the
 * database to store the model's schema.
 *
 * @memberof Model
 * @public
 */
bookshelf.Model.extend = function( options ) {

    var ret = originalExtend.apply( this, arguments );

    var p = knex( options.tableName ).columnInfo().then( function( info ) {
        schema[options.tableName] = info;
    } );

    schemaPromises.push( p );

    return ret;
};

module.exports = bookshelf;

module.exports.onSchemaLoaded = function( callback ) {
    Promise.all( schemaPromises ).then( callback );
};
