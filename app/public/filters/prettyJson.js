"use strict";

var app = angular.module( "bedman" );

app.filter( "prettyJson", function() {
    return function( input ) {
        return JSON.stringify( input, null, "  " );
    };
} );
