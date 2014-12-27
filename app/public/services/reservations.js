"use strict";

var app = angular.module( "bedman" );

app.factory( "Reservation", function( $Model ) {
    return $Model.extend( {
        url: "/api/reservations",
        dates: ["from", "to"]
    }, {
        initialize: function() {
            this.from = new Date();
            this.to = new Date();
        }
    } );
} );
