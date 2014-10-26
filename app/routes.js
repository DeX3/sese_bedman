/*
 *
 *
 */
"use strict";

var express = require( "express" );
var path = require( "path" );


/* does stuff */
module.exports.setup = function( app ) {

    var router = express.Router();
    var controllers = app.get( "controllers" );
    
    app.use( "/public", express.static(path.join(__dirname, "public")) );

    app.get( "/", function( req, res ) {
        res.render( "index" );
    } );

    var crud = function( routepart, controller ) {
        router.get( "/" + routepart, controller.index );
        router.post( "/" + routepart, controller.create );
        router.get( "/" + routepart + "/:id", controller.get );
        router.put( "/" + routepart + "/:id", controller.update );
        router.delete( "/" + routepart + "/:id", controller.destroy );
    };
    
    crud( "customers", controllers.CustomerController );
    crud( "reservations", controllers.ReservationController );

    app.use( "/api", router );
};
