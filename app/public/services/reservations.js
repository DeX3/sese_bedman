"use strict";

var app = angular.module( "bedman" );

app.factory( "Reservation", function( $resource ) {
    return $resource( "/api/reservations/:id",
                      { id: "@id" },
                      { update: {method: "PUT"} }
    );
} );
