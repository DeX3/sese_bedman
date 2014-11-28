/*
 * @file This file exports a `setup` function that will set up all the app's
 * routes.
 *
 */
"use strict";

var express = require( "express" );
var path = require( "path" );


/* does stuff */
module.exports.setup = function( app ) {

    var router = express.Router();
    var controllers = app.get( "controllers" );
    
    // serve static files under "/public"
    app.use( "/public", express.static(path.join(__dirname, "public")) );

    // main page
    app.get( "/", function( req, res ) {
        res.render( "index" );
    } );

    // creates basic CRUD-routes for the given controller
    var crud = function( routepart, controller ) {
        router.get( "/" + routepart, controller.index );
        router.post( "/" + routepart, controller.create );
        router.get( "/" + routepart + "/:id", controller.get );
        router.put( "/" + routepart + "/:id", controller.update );
        router.delete( "/" + routepart + "/:id", controller.destroy );
    };
    
    crud( "customers", controllers.CustomerController );
    crud( "bills", controllers.BillController );
    crud( "reservations", controllers.ReservationController );
    crud( "rooms", controllers.RoomController );

    // enable the api routes under "/api"
    app.use( "/api", router );
};
