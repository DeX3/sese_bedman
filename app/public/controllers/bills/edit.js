"use strict";

var app = angular.module( "bedman" );
app.controller( "BillsEditCtrl",
                function( $scope,
                          $routeParams,
                          $location,
                          DateService,
                          Bill ) {

    if( $routeParams.id === "create" ) {
        $scope.bill = new Bill();
        $scope.bill.newObject = true;
    } else {
        Bill.get( { id: $routeParams.id } ).$promise.then( function( bill ) {
            $scope.bill = bill;
            $scope.billdate = DateService.parseDate( bill.date );
        } );
    }

    $scope.save = function() {

        $scope.bill.date = DateService.formatDate( $scope.billdate );

        if( $scope.bill.newObject ) {
            delete $scope.bill.newObject;

            $scope.bill.$save().then( function(bill) {
                $location.path( "/bills/" + bill.id );
            } ).catch( function() {
                $scope.bill.newObject = true;
            } );
        } else {
            $scope.bill.$update().then( function(bill) {
                $location.path( "/bills/" + bill.id );
            } );
        }
    };

    $scope.destroy = function() {
        $scope.bill.$delete().then( function() {
            $location.path( "/bills" );
        } );
    };
} );
