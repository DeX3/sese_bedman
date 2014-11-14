"use strict";

var app = angular.module( "bedman" );

app.controller( "CustomerListCtrl",
                function( $scope,
                          Customer ) {

    $scope.customers = Customer.query();
} );
