"use strict";

/* jshint camelcase: false */
var app = angular.module( "bedman" );
app.controller( "BillsEditCtrl",
                function( $scope,
                          $routeParams,
                          $location,
                          $timeout,
                          dialogs,
                          DateService,
                          Bill,
                          Customer,
                          Reservation ) {


    if( $routeParams.id === "create" ) {
        $scope.bill = new Bill();
        $scope.bill.date = new Date();
        $scope.bill.price = 0;
        $scope.reservations = {};
        $timeout( function() {
            $scope.refreshCustomers();
        } );

        if( "for" in $routeParams ) {
            
            Reservation.$get(
                $routeParams["for"]
            ).then( function( reservation ) {
                $scope.reservations[reservation.id] = reservation;
                $scope.currentReservation = reservation;
                $scope.refreshCustomers();
            } );
        }
    } else {
        Bill.$get( $routeParams.id ).then( function( bill ) {
            $scope.bill = bill;

            angular.forEach( bill.customers, function(customer) {
                if( customer.id === bill.customer_id ) {
                    bill.customer = customer;
                }
            } );

            $scope.reservations = {};
            bill.reservations.forEach( function(reservation) {
                $scope.reservations[reservation.id] = new Reservation(
                    reservation );
            } );

            if( bill.reservations.length > 0 ) {
                var key = Object.keys( $scope.reservations )[0];
                $scope.currentReservation = $scope.reservations[key];
            }

            if( bill.customer ) {
                $scope.selectedPayer = bill.customer;
            }

            $scope.refreshCustomers();
        } );

    }

    // rebuilds payerOptions
    $scope.refreshCustomers = function() {
        
        var ids = [];
        $scope.payerOptions = [];

        // first, make sure the bill's current payer is in the options
        if( $scope.bill.customer ) {
            $scope.payerOptions.push( {
                value: $scope.bill.customer,
                text: new Customer($scope.bill.customer).fullName()
            } );
            ids.push( $scope.bill.customer.id );
        }

        // now, add customers from selected reservations for easy access
        angular.forEach( $scope.reservations, function( reservation ) {

            angular.forEach( reservation.customers, function( customer ) {
                if( ids.indexOf(customer.id) < 0 ) {
                    $scope.payerOptions.push( {
                        value: customer,
                        text: new Customer(customer).fullName()
                    } );
                    ids.push( customer.id );
                }
            } );

        } );

        // lastly, add a search options to specify customers not in reservations
        $scope.payerOptions.push( {
            value: "search",
            text: "Search customers..."
        } );
        
    };
    $scope.updatePayer = function() {
        if( $scope.selectedPayer === "search" ) {
            $timeout( function() {
                $( "#customer-search_value" ).focus();
            } );
        }
    };

    $scope.save = function() {

        $scope.bill.reservations = [];
        angular.forEach( $scope.reservations, function( reservation ) {
            $scope.bill.reservations.push( reservation.id );
        } );

        if( $scope.selectedPayer === "search" && $scope.searchedPayer ) {
            $scope.bill.customer_id = $scope.searchedPayer.originalObject.id;
        } else if( $scope.selectedPayer ) {
            $scope.bill.customer_id = $scope.selectedPayer.id;
        }


        $scope.bill.$save().then( function(bill) {
            $location.path( "/bills/" + bill.id );
        } );
    };

    $scope.addReservation = function() {
        dialogs.selectReservation( {
            title: "Add a reservation",
            confirmText: "Add"
        } ).then( function( reservation ) {
            if( !$scope.reservations[reservation.id] ) {
                $scope.reservations[reservation.id] = reservation;
                if( !$scope.currentReservation ) {
                    $scope.currentReservation = reservation;
                }

                $scope.refreshCustomers();
            }
        } );
    };

    $scope.removeReservation = function( reservation ) {
        if( !reservation ) {
            return;
        }

        delete $scope.reservations[reservation.id];
        if( Object.keys($scope.reservations).length === 0 ) {
            $scope.currentReservation = null;
        } else {
            var key = Object.keys($scope.reservations)[0];
            $scope.currentReservation = $scope.reservations[key];
        }

        $scope.refreshCustomers();
    };

    $scope.destroy = function() {
        dialogs.confirm(
            "Do you really want to delete bill #" + $scope.bill.id + "?"
        ).then( function(result) {
            $scope.bill.$delete().then( function() {
                $location.path( "/bills" );
            } );
        } );
    };

    
} );
