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
        $scope.bill.newObject = true;
    } else {
        $scope.bill = Bill.get( { id: $routeParams.id } );
    }

    $scope.save = function() {
        if( $scope.bill.newObject ) {
            delete $scope.bill.newObject;
            $scope.bill.$save().catch( function() {
                $scope.bill.newObject = true;
            } );
        } else {
            $scope.bill.$update();
        }
    };
} );
