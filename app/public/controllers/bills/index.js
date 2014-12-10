"use strict";

var app = angular.module( "bedman" );

app.controller( "BillsListCtrl",
                function( $scope,
                          Bill ) {

    Bill.$query().then( function(bills) {
        $scope.bills = bills;
    } );
} );
