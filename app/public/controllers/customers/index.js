"use strict";

var app = angular.module( "bedman" );

app.controller( "CustomerListCtrl",
                function( $scope,
                          Customer ) {

    Customer.$query().then( function(customers) {
        $scope.customers = customers;
    } );
} );
