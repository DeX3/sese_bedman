"use strict";

var app = angular.module( "bedman" );

app.controller( "RoomListCtrl",
                function( $scope,
                          Room ) {

    $scope.rooms = Room.query();
} );
