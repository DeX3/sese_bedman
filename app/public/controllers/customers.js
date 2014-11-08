"use strict";

var app = angular.module( "bedman" );

app.controller( "CustomerListCtrl",
                function( $scope,
                          Customer ) {

    $scope.customers = Customer.query();
} );
app.controller( "CustomerEditCtrl",
                function( $scope,
                          $routeParams,
                          Customer ) {

    if( $routeParams.id === "create" ) {
        $scope.customer = new Customer();
        $scope.customer.newObject = true;
    } else {
        $scope.customer = Customer.get( { id: $routeParams.id } );
    }

    $scope.save = function() {
        if( $scope.customer.newObject ) {
            delete $scope.customer.newObject;
            $scope.customer.$save();
        } else {
            $scope.customer.$update();
        }
    };
} );
