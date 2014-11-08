"use strict";

var app = angular.module( "bedman" );

app.controller( "ReservationListCtrl",
                function( $scope,
                          Reservation ) {

    $scope.reservations = Reservation.query();
} );
app.controller( "ReservationEditCtrl",
                function( $scope,
                          $routeParams,
                          Reservation,
                          Customer ) {

    if( $routeParams.id === "create" ) {
        $scope.reservation = new Reservation();
        $scope.reservation.newObject = true;
    } else {
        $scope.reservation = Reservation.get( { id: $routeParams.id } );
    }

    $scope.availableCustomers = Customer.query();
    $scope.addCustomer = function() {
        if( $scope.selectedCustomer ) {
            var customer = $scope.selectedCustomer.originalObject;
            $scope.selectedCustomers.push( customer );
        }
    };
    Customer.prototype.displayName = function() {
        return this.firstName + " " + this.lastName;
    };

    $scope.save = function() {
        if( $scope.reservation.newObject ) {
            delete $scope.reservation.newObject;
            $scope.reservation.$save().catch( function() {
                $scope.reservation.newObject = true;
            } );
        } else {
            $scope.reservation.$update();
        }
    };
} );
