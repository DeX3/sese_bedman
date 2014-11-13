"use strict";

var app = angular.module( "bedman" );
app.controller( "RoomEditCtrl",
                function( $scope,
                          $routeParams,
                          $location,
                          Room ) {

    if( $routeParams.id === "create" ) {
        $scope.room = new Room();
    } else {
        $scope.room = Room.get( { id: $routeParams.id } );
    }

    $scope.save = function() {
        $scope.room.$save();
    };

    $scope.destroy = function() {
        $scope.room.$delete().then( function() {
            $location.path( "/rooms" );
        } );
    };
} );
