"use strict";

var app = angular.module( "bedman" );
app.controller( "ReservationEditCtrl",
                function( $scope,
                          $routeParams,
                          $location,
                          Reservation,
                          dialogs,
                          Customer ) {

    $scope.selectedCustomers = [];
    if( $routeParams.id === "create" ) {
        $scope.reservation = new Reservation();
    } else {
        Reservation.$get( $routeParams.id ).then( function( reservation ) {
            
            for( var i=0; i < reservation.customers.length ; i++ ) {
                var c = reservation.customers[i];
                $scope.selectedCustomers.push( new Customer(c) );
            }
            if( reservation.customers.length > 0 ) {
                $scope.currentCustomer = $scope.selectedCustomers[0];
            }

            $scope.reservation = reservation;
        } );
    }

    Customer.$query().then( function( availableCustomers ) {
        $scope.availableCustomers = availableCustomers;
    } );

    $scope.addCustomer = function() {
        if( $scope.selectedCustomer ) {
            var customer = $scope.selectedCustomer.originalObject;
            $scope.selectedCustomers.push( customer );

            //select the item in the listbox right away to avoid empty item
            if( !$scope.currentCustomer ) {
                $scope.currentCustomer = customer;
            }
            //clear the searchbox after add
            $scope.$broadcast( "angucomplete-alt:clearInput",
                               "customerSearch" );
        }
    };

    $scope.onSearchKeyPress = function( evt ) {
        if( evt.keyCode === 13 ) {
            $scope.addCustomer();

            //prevent form submit
            evt.preventDefault();
        }
    };

    $scope.save = function() {
        $scope.reservation.customers = [];
        for( var i=0 ; i < $scope.selectedCustomers.length ; i++ ) {
            $scope.reservation.customers.push( $scope.selectedCustomers[i].id );
        }

        $scope.reservation.$save().then( function( reservation ) {
            $location.path( "/reservations/" + reservation.id );
        } ).catch( function() {
            $scope.reservation.newObject = true;
        } );
    };

    $scope.destroy = function() {
        
        dialogs.confirm().then( function() {
            $scope.reservation.$delete().then( function() {
                $location.path( "/reservations" );
            } );
        } );
    };
} );
