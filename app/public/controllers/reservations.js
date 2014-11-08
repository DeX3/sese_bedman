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
        $scope.reservation.newObject = true;
    } else {
        $scope.reservation = Reservation.get( { id: $routeParams.id } );
    }

    $scope.save = function() {
        if( $scope.reservation.newObject ) {
            delete $scope.reservation.newObject;
            $scope.reservation.$save().catch( function() {
                $scope.reservation.newObject = true;
            } );
        } else {
            $scope.reservation.$update();
        }
    };
} );
