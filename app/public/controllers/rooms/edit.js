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
        Room.$get( $routeParams.id ).then( function(room) {
            $scope.room = room;
        } );
    }

    $scope.save = function() {
        $scope.room.$save().then( function() {
            $location.path( "/rooms" );
        } );
    };

    $scope.destroy = function() {
        $scope.room.$delete().then( function() {
            $location.path( "/rooms" );
        } );
    };
} );
