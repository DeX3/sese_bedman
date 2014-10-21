"use strict";

process.env.NODE_ENV = "test";
var config = require( "config" );
var knex = require( "knex" )( config.get("db") ); 
var bookshelf = require( "bookshelf" )( knex );
var models = require( "../app/models/models" );

var testdata = require( "./testdata" );

var mockApp = {
    get: function(name) {
        if( name === "bookshelf" ) {
            return bookshelf;
        } else if( name === "models" ) {
            return models;
        }
    }
};

models.setup( mockApp );

module.exports = {
    app: mockApp,
    models: models,
    appUrl: "http://localhost:3000",
    testData: testdata.withModels( models )
};
