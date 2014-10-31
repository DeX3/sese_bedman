"use strict";

var app = angular.module( "bedman" );

app.controller( "BillsListCtrl",
                function( $scope,
                          Bill ) {

    $scope.bills = Bill.query();
} );
app.controller( "BillsEditCtrl",
                function( $scope,
                          $routeParams,
                          Bill ) {

    if( $routeParams.id === "create" ) {
        $scope.bill = new Bill();
    } else {
        $scope.bill = Bill.get( { id: $routeParams.id } );
    }

    $scope.save = function() {
        $scope.bill.$save();
    };
} );
