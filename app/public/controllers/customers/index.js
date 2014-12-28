"use strict";

var app = angular.module( "bedman" );

app.controller( "CustomerListCtrl",
                function( $scope,
                          Customer ) {

    $scope.perPage = 10;
    $scope.$watchGroup( ["page", "search"], function() {
        Customer.$query( {
            page: $scope.page,
            perPage: $scope.perPage,
            s: $scope.search
        } ).then( function(customers) {
            $scope.customers = customers;
        } );
    } );

    $scope.page = 1;
} );
