"use strict";

var app = angular.module( "bedman" );

app.factory( "Bill", function( $Model ) {
    return $Model.extend( {
        url: "/api/bills",
        dates: ["date"]
    } );
} );
