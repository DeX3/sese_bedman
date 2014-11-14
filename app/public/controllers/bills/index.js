"use strict";

var app = angular.module( "bedman" );

app.controller( "BillsListCtrl",
                function( $scope,
                          Bill ) {

    $scope.bills = Bill.query();
} );
