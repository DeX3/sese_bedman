"use strict";

var app = angular.module( "bedman" );

app.controller( "RoomListCtrl",
                function( $scope,
                          Room ) {

    $scope.perPage = 10;

    $scope.$watch( "page", function() {
        Room.$query( {
            page: $scope.page,
            perPage: $scope.perPage
        } ).then( function( rooms ) {
            $scope.rooms = rooms;
        } );
    } );

    $scope.page = 1;
} );
