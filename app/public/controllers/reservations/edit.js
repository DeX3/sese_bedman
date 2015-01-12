"use strict";

var app = angular.module( "bedman" );
app.controller( "ReservationEditCtrl",
                function( $scope,
                          $routeParams,
                          $location,
                          DateService,
                          Reservation,
                          dialogs,
                          Customer,
                          ValidationErrorHandler,
                          Room) {

    $scope.selectedCustomers = [];
    $scope.selectedRooms = [];
    $scope.today = DateService.formatDate( DateService.today() );

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
            var customer = new Customer(
                $scope.selectedCustomer.originalObject
            );

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
                room.configuration = "SINGLE";
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

    $scope.$watch( "currentRoom", function() {
        if( $scope.currentRoom ) {
            var room = $scope.currentRoom;
            $scope.configurations = room.getAvailableConfigurations();
        }
    } );


    var projectBill = function() {

        if( !$scope.reservation ||
            !$scope.reservation.to ||
            !$scope.reservation.from ||
            $scope.reservation.to < $scope.reservation.from ||
            $scope.selectedCustomers.length === 0 ) {
            
            $scope.projectedBill = null;
            return;
        }

        var bestDiscountCustomer = $scope.selectedCustomers.reduce(
            function(current, customer) {

            if( !current || customer.discount > current.discount ) {
                return customer;
            } else {
                return current;
            }

        }, null );

        var discount = bestDiscountCustomer?
                        bestDiscountCustomer.discount :
                        0;

        var duration = ($scope.reservation.to - $scope.reservation.from) /
                        (1000 * 60 * 60 * 24) +
                         1;

        $scope.projectedBill = {};
        $scope.projectedBill.duration = duration;

        $scope.projectedBill.rooms = [];
        var sum = $scope.selectedRooms.reduce( function( sum, room ) {

            var dailyRate = room.getDailyCosts();
            $scope.projectedBill.rooms.push( {
                name: room.name,
                configuration: room.configuration,
                dailyRate: dailyRate,
                total: room.getDailyCosts() * duration
            } );

            return sum + room.getDailyCosts() * duration;
        }, 0 );

        $scope.projectedBill.subtotal = sum;
        $scope.projectedBill.discount = { 
                                          percent: discount,
                                          amount: sum * (discount/100),
                                          via: bestDiscountCustomer };
        $scope.projectedBill.total = sum * (1 - discount/100);
    };

    $scope.$watchGroup( [ "currentRoom.configuration",
                          "reservation.from",
                          "reservation.to"], projectBill );

    $scope.$watchCollection( "selectedCustomers", projectBill );
    $scope.$watchCollection( "selectedRooms", projectBill );

    $scope.save = function() {
        $scope.reservation.customers = [];
        $scope.reservation.rooms = [];
        angular.forEach( $scope.selectedCustomers, function( customer ) {
            $scope.reservation.customers.push( customer.id );
        } );
        angular.forEach( $scope.selectedRooms, function( room ) {
            $scope.reservation.rooms.push( {
                id: room.id,
                configuration: room.configuration
            } );
        } );


        ValidationErrorHandler.handle( 
            $scope.form,
            $scope.reservation.$save().then( function( reservation ) {
                $location.path( "/reservations" );
        } ) );
    };

    $scope.destroy = function() {
        
        dialogs.confirm().then( function() {
            $scope.reservation.$delete().then( function() {
                $location.path( "/reservations" );
            } );
        } );
    };
    
} );
