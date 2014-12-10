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

            $httpBackend.when( "GET", "/api/reservations" )
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

            $httpBackend.when( "GET", "/api/reservations" )
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
            $httpBackend.when( "GET", "/api/reservations/4711" )
                        .respond( { id: 4711,
                                    customers: []} );

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
            chai.expect( scope.reservation.customers ).to.be.empty;
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
        } ) );

        it( "should provide a list of customers to add to the reservation",
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
            $httpBackend.when( "POST", "/api/reservations" )
                        .respond( {} );

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

            chai.expect( scope.availableCustomers ).to.exist;
            chai.expect( scope.availableCustomers ).not.to.be.empty;
            chai.expect( scope.availableCustomers ).to.be.of.length( 1 );

            chai.expect(
                scope.availableCustomers[0].firstName
            ).to.equal( "Homer" );

            chai.expect(
                scope.availableCustomers[0].lastName
            ).to.equal( "Simpson" );

        } ) );
    } );

} );
