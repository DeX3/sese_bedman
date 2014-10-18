"use strict";

var app = angular.module( "bedman" );

app.factory( "Customer", function( $resource ) {
    return $resource( "/api/customers/:id" );
} );
