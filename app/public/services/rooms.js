"use strict";

var app = angular.module( "bedman" );

app.factory( "Room", function( $resource ) {
    return $resource( "/api/rooms/:id" );
} );
