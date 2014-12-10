"use strict";

var app = angular.module( "bedman" );
app.controller( "ReservationEditCtrl",
                function( $scope,
                          $routeParams,
                          $location,
                          Reservation,
                          dialogs,
                          Customer,
                          Room) {

    $scope.selectedCustomers = [];
    $scope.selectedRooms = [];
    if( $routeParams.id === "create" ) {
        $scope.reservation = new Reservation();
    } else {
        Reservation.$get( $routeParams.id ).then( function( reservation ) {

            angular.forEach( reservation.customers, function( c ) {
                $scope.selectedCustomers.push( new Customer(c) );
            } );

            angular.forEach( reservation.rooms, function( r ) {
                $scope.selectedRooms.push( new Room(r) );
            } );
            
            if( reservation.customers.length > 0 ) {
                $scope.currentCustomer = $scope.selectedCustomers[0];
            }
            
            if( reservation.rooms.length > 0 ) {
                $scope.currentRoom = $scope.selectedRooms[0];
            }

            $scope.reservation = reservation;
        } );
    }

    Customer.$query().then( function( availableCustomers ) {
        $scope.availableCustomers = availableCustomers;
    } );
    
    Room.$query().then( function( availableRooms ) {
        $scope.availableRooms = availableRooms;
    } );


    var getById = function( collection, id ) {
        if( !collection ) {
            return null;
        }

        for( var i=0 ; i < collection.length ; i++ ) {
            if( collection[i].id === id ) {
                return collection[i];
            }
        }

        return null;
    };

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

    $scope.addRoom = function() {
        if( $scope.selectedRoom ) {
            var room = $scope.selectedRoom;

            var contained = getById( $scope.selectedRooms, room.id );
            if( !contained ) {
                $scope.selectedRooms.push( room );

                //select the item in the listbox right away to avoid empty item
                if( !$scope.currentRoom ) {
                    $scope.currentRoom = room;
                }
            } else {
                $scope.currentRoom = contained;
            }

        }
    };

    $scope.onSearchKeyPress = function( evt ) {
        if( evt.keyCode === 13 ) {
            $scope.addCustomer();

            //prevent form submit
            evt.preventDefault();
        }
    };

    var genericKeyDown = function( evt, currentName, listName ) {

        if( evt.keyCode === 46 && $scope[currentName] ) {
            var idx = $scope[listName].indexOf($scope[currentName] );

            $scope[listName].splice( idx, 1 );
            if( idx >= $scope[listName].length ) {
                idx = $scope[listName].length - 1;
            }

            $scope[currentName] = $scope[listName][idx];
        }
    };

    $scope.onCustomersKeyDown = function( evt ) {
        genericKeyDown.call( this,
                             evt,
                             "currentCustomer",
                             "selectedCustomers" );
    };

    $scope.onRoomsKeyDown = function( evt ) {
        genericKeyDown.call( this,
                             evt,
                             "currentRoom",
                             "selectedRooms" );
    };

    $scope.save = function() {
        $scope.reservation.customers = [];
        $scope.reservation.rooms = [];
        angular.forEach( $scope.selectedCustomers, function( customer ) {
            $scope.reservation.customers.push( customer.id );
        } );
        angular.forEach( $scope.selectedRooms, function( room ) {
            $scope.reservation.rooms.push( room.id );
        } );
        $scope.reservation.$save().then( function( reservation ) {
            $location.path( "/reservations" );
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
