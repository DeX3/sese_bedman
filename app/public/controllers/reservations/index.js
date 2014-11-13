"use strict";

var app = angular.module( "bedman" );

app.controller( "ReservationListCtrl",
                function( $scope,
                          Reservation ) {

    $scope.reservations = Reservation.query();
} );
