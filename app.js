/**
 * @file Main entry point for the application. Registers routes, models,
 * controllers and views.
 */

"use strict";

require( "string.prototype.endswith" );
require( "colors" );

if( ["development",
     "production",
     "test"].indexOf( process.env.NODE_ENV ) < 0 ) {

    if( process.env.NODE_ENV ) {
        console.log( "Invalid environment " + process.env.NODE_ENV.red );
    }

    console.log( "Falling back to " + "development".cyan );
    process.env.NODE_ENV = "development";
}

var express = require( "express" );
var bodyParser = require( "body-parser" );
var config = require( "config" );
var knex = require( "knex" )( config.get( "db" ) );
var fs = require( "fs" );

var routes = require( "./app/routes" );
var models = require( "./app/models/models" );
var controllers = require( "./app/controllers/controllers" );

var bookshelf = require( "bookshelf" )( knex );

var app = express();
app.set( "bookshelf", bookshelf );

app.use( config.get("logger") );

app.use( bodyParser.json() );

models.setup( app );
app.set( "models", models );

controllers.setup( app );
app.set( "controllers", controllers );

app.set( "views", "app/views" );
app.set( "view engine", "ejs" );

app.locals.ngControllers = fs.readdirSync( "app/public/controllers" )
                             .filter( function(file) {
    return file.endsWith(".js");
} );
app.locals.ngServices = fs.readdirSync( "app/public/services" )
                             .filter( function(file) {
    return file.endsWith(".js");
} );
app.locals.ngDirectives = fs.readdirSync( "app/public/directives" )
                             .filter( function(file) {
    return file.endsWith(".js");
} );
app.locals.ngViews = fs.readdirSync( "app/public/views" )
                             .filter( function(file) {
    return file.endsWith(".html");
} );
app.locals.ngDirectives = fs.readdirSync( "app/public/directives" )
                             .filter( function(file) {
    return file.endsWith(".js");
} );

routes.setup( app );

app.locals.appinfo = {
    environment: process.env.NODE_ENV
};

if( config.has("additionalMiddleware") ) {
    var middlewares = config.get( "additionalMiddleware" );
    for( var route in middlewares ) {
        if( middlewares.hasOwnProperty(route) ) {
            var middleware = middlewares[route];
            app.use( route, middleware );
        }
    }
}

var server = app.listen( config.get("port"), function() {
	console.log( "Listening on port %d in %s", server.address().port,
                                               process.env.NODE_ENV.cyan );
} );
