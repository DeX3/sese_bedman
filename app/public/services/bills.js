"use strict";

var app = angular.module( "bedman" );

app.factory( "Bill", function( $resource ) {
    return $resource( "/api/bills/:id" );
} );
