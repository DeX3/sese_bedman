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
    } else {
        $scope.customer = Customer.get( { id: $routeParams.id } );
    }

    $scope.save = function() {
        console.log( "Saving..." );
        $scope.customer.$save();
    };
} );
