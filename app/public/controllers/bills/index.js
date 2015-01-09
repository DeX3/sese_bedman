"use strict";

var app = angular.module( "bedman" );

app.controller( "BillsListCtrl",
                function( $scope,
                          Bill ) {

    $scope.perPage = 10;

    $scope.$watch( "page", function() {
        Bill.$query( {
            page: $scope.page,
            perPage: $scope.perPage
        } ).then( function(bills) {
            $scope.bills = bills;
        } );
    } );

    $scope.page = 1;
} );
