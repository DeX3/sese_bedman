/*
 * @file This file exports a `setup` function that will set up all the app's
 * routes.
 *
 */
"use strict";

var express = require( "express" );
var path = require( "path" );

var RoomController = require( "./controllers/RoomController" );
var CustomerController = require( "./controllers/CustomerController" );
var ReservationController = require( "./controllers/ReservationController" );
var BillController = require( "./controllers/BillController" );

/* does stuff */
module.exports.setup = function( app ) {

    var router = express.Router();
    
    // serve static files under "/public"
    app.use( "/public", express.static(path.join(__dirname, "public")) );

    // main page
    app.get( "/", function( req, res ) {
        res.render( "index" );
    } );

    // creates basic CRUD-routes for the given controller
    var crud = function( routepart, ctrl ) {
        router.get( "/" + routepart, ctrl.index.bind(ctrl) );
        router.post( "/" + routepart, ctrl.create.bind(ctrl) );
        router.get( "/" + routepart + "/:id", ctrl.get.bind(ctrl) );
        router.put( "/" + routepart + "/:id", ctrl.update.bind(ctrl) );
        router.delete( "/" + routepart + "/:id", ctrl.destroy.bind(ctrl) );
    };
    
    crud( "customers", new CustomerController() );
    crud( "rooms", new RoomController() );
    crud( "reservations", new ReservationController() );

    var bills = new BillController();
    crud( "bills", bills );

    router.get( "/bills/:id/details", bills.details.bind(bills) );

    // enable the api routes under "/api"
    app.use( "/api", router );
};
