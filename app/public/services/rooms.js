"use strict";

var app = angular.module( "bedman" );

app.factory( "Room", function( $Model ) {

    return $Model.extend(
        {
            name: "Room",
            url: "/api/rooms",
        }
    );
} );
