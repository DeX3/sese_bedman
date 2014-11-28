"use strict";

var app = angular.module( "bedman" );

app.controller( "ReservationListCtrl",
                function( $scope,
                          Reservation ) {

    Reservation.$query().then( function( reservations ) {
        $scope.reservations = reservations;
    } );
} );
