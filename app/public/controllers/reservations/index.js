"use strict";

var app = angular.module( "bedman" );

app.controller( "ReservationListCtrl",
                function( $scope,
                          Reservation ) {

    $scope.perPage = 10;

    $scope.$watchGroup( ["page", "search"], function() {
        Reservation.$query( {
            page: $scope.page || 1,
            perPage: $scope.perPage,
            s: $scope.search
        } ).then( function( reservations ) {
            $scope.reservations = reservations;
        } );
    }, true );


    $scope.page = 1;
} );
