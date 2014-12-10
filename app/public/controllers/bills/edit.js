"use strict";

var app = angular.module( "bedman" );
app.controller( "BillsEditCtrl",
                function( $scope,
                          $routeParams,
                          $location,
                          dialogs,
                          DateService,
                          Bill,Customer ) {

    if( $routeParams.id === "create" ) {
        $scope.bill = new Bill();
    } else {
        Bill.$get( $routeParams.id ).then( function( bill ) {
            $scope.bill = bill;
        } );
    }

    $scope.save = function() {

        $scope.bill.$save().then( function(bill) {
            $location.path( "/bills" );
        } );
    };

    $scope.destroy = function() {
        dialogs.confirm(
            "Do you really want to delete bill #" + $scope.bill.billId + "?"
        ).then( function(result) {
            $scope.bill.$delete().then( function() {
                $location.path( "/bills" );
            } );
        } );
    };
    
    Customer.$query().then( function(customers) {
        $scope.customers = customers;
    } );
} );
