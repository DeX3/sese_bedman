"use strict";

var app = angular.module( "bedman" );

app.factory( "Reservation", function( $Model ) {
    return $Model.extend( {
        url: "/api/reservations"
    } );
} );
