"use strict";

var app = angular.module( "bedman" );

app.controller( "ReservationListCtrl",
                function( $scope,
                          Reservation ) {

    $scope.reservations = Reservation.query();
} );
app.controller( "ReservationEditCtrl",
                function( $scope,
                          $routeParams,
                          Reservation ) {

    if( $routeParams.id === "create" ) {
        $scope.reservation = new Reservation();
    } else {
        $scope.reservation = Reservation.get( { id: $routeParams.id } );
    }

    $scope.save = function() {
        $scope.reservation.$save();
    };
} );
