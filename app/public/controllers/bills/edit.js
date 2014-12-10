"use strict";

/* jshint camelcase: false */
var app = angular.module( "bedman" );
app.controller( "BillsEditCtrl",
                function( $scope,
                          $routeParams,
                          $location,
                          dialogs,
                          DateService,
                          Bill,
                          Customer ) {

    Customer.$query().then( function(customers) {
        $scope.customers = customers;

        if( $routeParams.id === "create" ) {
            $scope.bill = new Bill();
        } else {
            Bill.$get( $routeParams.id ).then( function( bill ) {
                $scope.bill = bill;

                angular.forEach( customers, function(customer) {
                    if( customer.id === bill.customer_id ) {
                        bill.customer = customer;
                    }
                } );

            } );
        }
    } );

    $scope.save = function() {

        if( $scope.bill.customer &&
            $scope.bill.customer.id ) {
            $scope.bill.customer_id = $scope.bill.customer.id;
        }

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

    
} );
