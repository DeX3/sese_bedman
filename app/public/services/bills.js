"use strict";

var app = angular.module( "bedman" );

app.factory( "Bill", function( $Model ) {

    return $Model.extend(
        {
            name: "Bill",
            url: "/api/bills",
        }
    );
} );
