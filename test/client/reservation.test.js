"use strict";

/* jshint expr: true */

describe( "Reservation controllers", function() {

    beforeEach( module("bedman") );

    afterEach( inject( function( $httpBackend ) {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    } ) );

    describe( "ReservationListCtrl", function() {
        it( "should exist",
            inject( function( $controller,
                              $rootScope,
                              $httpBackend,
                              Reservation ) {

            $httpBackend.when( "GET", "/api/reservations?page=1&perPage=10&s=" )
                        .respond( [] );

            var scope = $rootScope.$new();
            var ctrl = $controller( "ReservationListCtrl", {
                $scope: scope,
                Reservation: Reservation
            } );

            $httpBackend.flush();

            chai.expect( ctrl ).to.exist;
        } ) );

        it( "should provide a reservations array",
            inject( function( $controller,
                              $rootScope,
                              $httpBackend,
                              Reservation ) {

            $httpBackend.when( "GET", "/api/reservations?page=1&perPage=10&s=" )
                        .respond( [ {} ] );

            var scope = $rootScope.$new();
            $controller( "ReservationListCtrl", {
                $scope: scope,
                Reservation: Reservation
            } );

            $httpBackend.flush();

            //$rootScope.$apply();
            chai.expect( scope.reservations ).to.exist;
            chai.expect( scope.reservations.length ).to.equal(1);
        } ) );
    } );

    describe( "ReservationEditCtrl", function() {

        it( "should exist",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Reservation,
                              Customer,
                              Bill ) {

            $httpBackend.when( "GET", "/api/customers" )
                        .respond( [] );

            $httpBackend.when( "GET", "/api/rooms" )
                        .respond( [] );
            

            var scope = $rootScope.$new();
            var ctrl = $controller( "ReservationEditCtrl", {
                $scope: scope,
                $routeParams: { id: "create" },
                $location: $location,
                Reservation: Reservation,
                Customer: Customer,
                Bill:Bill
            } );


            $httpBackend.when( "GET", "/api/bills" )
                        .respond( [] );
            $httpBackend.flush();
            
            chai.expect( ctrl ).to.exist;
        } ) );

        it( "should create a new reservation",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Reservation,
                              Customer,
                              Bill ) {

            $httpBackend.when( "GET", "/api/customers" )
                        .respond( [] );
            $httpBackend.when( "GET", "/api/rooms" )
                        .respond( [] );

            var scope = $rootScope.$new();
            $controller( "ReservationEditCtrl", {
                $scope: scope,
                $routeParams: { id: "create" },
                $location: $location,
                Reservation: Reservation,
                Customer: Customer,
                Bill:Bill
            } );

            $httpBackend.when( "GET", "/api/bills" )
                        .respond( [] );
            $httpBackend.flush();

            chai.expect( scope.reservation ).to.exist;
            chai.expect( scope.reservation.$isNew ).to.equal( true );
        } ) );

        it( "should provide an existing reservation",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Reservation,
                              Customer ) {

            $httpBackend.when( "GET", "/api/customers" )
                        .respond( [] );
            $httpBackend.when( "GET", "/api/rooms" )
                        .respond( [] );
            $httpBackend.when( "GET", "/api/reservations/4711" )
                        .respond( { id: 4711,
                                    customers: [ {
                                        firstName: "Homer",
                                        lastName: "Simpson"
                                    } ],
                                    rooms: [ {} ]
                                        
                                } );

            var scope = $rootScope.$new();
            $controller( "ReservationEditCtrl", {
                $scope: scope,
                $routeParams: { id: 4711 },
                $location: $location,
                Reservation: Reservation,
                Customer: Customer
            } );

            $httpBackend.when( "GET", "/api/bills" )
                        .respond( [] );
            $httpBackend.flush();
        
            chai.expect( scope.reservation ).to.exist;
            chai.expect( scope.reservation.$isNew ).to.equal( false );

            chai.expect( scope.reservation.id ).to.equal( 4711 );
            chai.expect( scope.reservation.customers ).to.have.length( 1 );
            chai.expect( scope.reservation.rooms ).to.have.length( 1 );
        } ) );

        it( "should provide a save method to save a reservation",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Reservation,
                              Customer ) {

            $httpBackend.when( "GET", "/api/customers" )
                        .respond( [] );
            $httpBackend.when( "GET", "/api/rooms" )
                        .respond( [] );
            $httpBackend.when( "POST", "/api/reservations" )
                        .respond( { id: 4711,
                                    customers: [] } );

            var scope = $rootScope.$new();
            $controller( "ReservationEditCtrl", {
                $scope: scope,
                $routeParams: { id: "create" },
                $location: $location,
                Reservation: Reservation,
                Customer: Customer
            } );

            $httpBackend.when( "GET", "/api/bills" )
                        .respond( [] );
            $httpBackend.flush();

            chai.expect( scope.save ).to.be.a( "function" );
            chai.expect( scope.save ).to.exist;

            scope.save();

            $httpBackend.flush();
        } ) );

        it( "should enable adding rooms to the reservation",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Reservation,
                              Customer,
                              Room ) {

            $httpBackend.when( "GET", "/api/customers" )
                        .respond( [] );
            $httpBackend.when( "GET", "/api/rooms" )
                        .respond( [ { name: "asdf" } ] );
            $httpBackend.when( "POST", "/api/reservations" )
                        .respond( {} );

            var scope = $rootScope.$new();
            $controller( "ReservationEditCtrl", {
                $scope: scope,
                $routeParams: { id: "create" },
                $location: $location,
                Reservation: Reservation,
                Customer: Customer,
                Room: Room
            } );

            $httpBackend.flush();

            chai.expect( scope.availableRooms ).to.exist;
            chai.expect( scope.availableRooms ).not.to.be.empty;
            chai.expect( scope.availableRooms ).to.be.of.length( 1 );

            chai.expect(
                scope.availableRooms[0].name
            ).to.equal( "asdf" );

            //test adding room when none is selected
            scope.addRoom();
            chai.expect( scope.selectedRooms ).to.have.length( 0 );

            scope.selectedRoom = scope.availableRooms[0];
            scope.addRoom();

            chai.expect( scope.selectedRooms ).to.have.length( 1 );

        } ) );

        it( "should not allow to adding the same room twice",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Reservation,
                              Customer,
                              Room ) {

            $httpBackend.when( "GET", "/api/customers" )
                        .respond( [] );
            $httpBackend.when( "GET", "/api/rooms" )
                        .respond( [ { name: "asdf" } ] );
            $httpBackend.when( "POST", "/api/reservations" )
                        .respond( {} );

            var scope = $rootScope.$new();
            $controller( "ReservationEditCtrl", {
                $scope: scope,
                $routeParams: { id: "create" },
                $location: $location,
                Reservation: Reservation,
                Customer: Customer,
                Room: Room
            } );

            $httpBackend.flush();

            chai.expect( scope.availableRooms ).to.exist;
            chai.expect( scope.availableRooms ).not.to.be.empty;
            chai.expect( scope.availableRooms ).to.be.of.length( 1 );

            chai.expect(
                scope.availableRooms[0].name
            ).to.equal( "asdf" );

            scope.selectedRoom = scope.availableRooms[0];
            scope.addRoom();
            scope.addRoom();

            chai.expect( scope.selectedRooms ).to.have.length( 1 );

        } ) );
        
        it( "should confirm deletion",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Reservation,
                              Customer ) {

            $httpBackend.when( "GET", "/api/customers" )
                        .respond( [
                { firstName: "Homer", lastName: "Simpson" }
            ] );
            $httpBackend.when( "GET", "/api/rooms" )
                        .respond( [] );

            $httpBackend.when( "GET", "/api/reservations/4711" )
                        .respond( { id: 4711,
                                    customers: [],
                                    rooms: []
            } );

            $httpBackend.when( "DELETE", "/api/reservations/4711" )
                        .respond( {} );

            var mockFactory = new testutils.MockFactory();
            var dialogs = mockFactory.mockedDialogs;

            var scope = $rootScope.$new();
            $controller( "ReservationEditCtrl", {
                $scope: scope,
                $routeParams: { id: 4711 },
                $location: $location,
                Reservation: Reservation,
                dialogs: dialogs,
                Customer: Customer
            } );

            $httpBackend.flush();
            scope.destroy();

            chai.expect( dialogs.confirm ).to.have.been.called();

            dialogs.confirmOk();
            $httpBackend.flush();

        } ) );
    } );
} );
