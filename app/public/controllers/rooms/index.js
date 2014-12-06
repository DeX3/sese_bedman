"use strict";

var app = angular.module( "bedman" );

app.controller( "RoomListCtrl",
                function( $scope,
                          Room ) {

    Room.$query().then( function( rooms ) {
        $scope.rooms = rooms;
    } );
} );
