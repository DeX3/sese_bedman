"use strict";

var app = angular.module( "bedman" );
app.controller( "CustomerEditCtrl",
                function( $scope,
                          $routeParams,
                          $location,
                          dialogs,
                          Customer ) {

    if( $routeParams.id === "create" ) {
        $scope.customer = new Customer();
    } else {
        Customer.$get( $routeParams.id ).then( function(customer) {
            $scope.customer = customer;
        } );
    }

    $scope.save = function() {

        $scope.customer.$save().then( function() {
            $location.path( "/customers" );
        } );
    };

    $scope.destroy = function() {

        dialogs.confirm(
            "Do you really want to delete" + $scope.customer.fullName() + "?"
        ).then( function(result) {

            $scope.customer.$delete().then( function() {
                $location.path( "/customers" );
            } );

        } );
    };

} );
