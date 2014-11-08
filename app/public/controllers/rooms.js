"use strict";

var app = angular.module( "bedman" );

app.controller( "RoomListCtrl",
                function( $scope,
                          Room ) {

    $scope.rooms = Room.query();
} );
app.controller( "RoomEditCtrl",
                function( $scope,
                          $routeParams,
                          Room ) {

    if( $routeParams.id === "create" ) {
        $scope.room = new Room();
    } else {
        $scope.room = Room.get( { id: $routeParams.id } );
    }

    $scope.save = function() {
        $scope.room.$save();
    };
} );
