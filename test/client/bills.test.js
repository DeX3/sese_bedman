"use strict";

/* jshint expr: true */

describe( "Bills controllers", function() {

    beforeEach( module("bedman") );

    afterEach( inject( function( $httpBackend ) {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    } ) );

    describe( "BillsListCtrl", function() {
        it( "should exist",
            inject( function( $controller,
                              $rootScope,
                              $httpBackend,
                              Bill ) {

            $httpBackend.when( "GET", "/api/bills?page=1&perPage=10" )
                        .respond( [] );

            var ctrl = $controller( "BillsListCtrl", {
                $scope: $rootScope.$new(),
                Bill: Bill
            } );

            $httpBackend.flush();

            chai.expect( ctrl ).to.exist;
        } ) );

    } );

    describe( "BillsEditCtrl", function() {

        it( "should exist",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Bill ) {

            var ctrl = $controller( "BillsEditCtrl", {
                $scope: $rootScope.$new(),
                $routeParams: { id: "create" },
                $location: $location,
                Bill: Bill
            } );

            chai.expect( ctrl ).to.exist;
        } ) );

        it( "should create a new bill",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Bill ) {

            var scope = $rootScope.$new();

            $controller( "BillsEditCtrl", {
                $scope: scope,
                $routeParams: { id: "create" },
                $location: $location,
                Bill: Bill
            } );

            chai.expect( scope.bill ).to.exist;
        } ) );

        it( "should provide an existing bill",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Bill ) {


            $httpBackend.when( "GET", "/api/bills/4711" )
                        .respond( { id: 4711,
                                    reservations: [] } );

            var scope = $rootScope.$new();
            $controller( "BillsEditCtrl", {
                $scope: scope,
                $routeParams: { id: 4711 },
                $location: $location,
                Bill: Bill
            } );

            $httpBackend.flush();

            chai.expect( scope.bill ).to.exist;
            chai.expect( scope.bill.id ).to.equal( 4711 );

        } ) );

        it( "should provide a save method to save a bill",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Bill ) {

            $httpBackend.when( "POST", "/api/bills" )
                        .respond( { id: 4711, 
                                    customer: {},
                                    reservations: [] } );

            var scope = $rootScope.$new();

            $controller( "BillsEditCtrl", {
                $scope: scope,
                $routeParams: { id: "create" },
                $location: $location,
                Bill: Bill
            } );

            scope.save();

            $httpBackend.flush();
        } ) );

        it( "should confirm deletion",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Bill ) {

            $httpBackend.when( "GET", "/api/bills/4711" )
                        .respond( { id: 4711,
                                    reservations: [],
                                    customers: [] } );

            $httpBackend.when( "DELETE", "/api/bills/4711" )
                        .respond( {} );

            var scope = $rootScope.$new();
            var mockFactory = new testutils.MockFactory();
            var dialogs = mockFactory.mockedDialogs;

            $controller( "BillsEditCtrl", {
                $scope: scope,
                $routeParams: { id: 4711 },
                $location: $location,
                dialogs: dialogs,
                Bill: Bill
            } );

            $httpBackend.flush();

            scope.destroy();
            chai.expect( dialogs.confirm ).to.have.been.called();
            dialogs.confirmOk();

            $httpBackend.flush();

        } ) );
    } );

} );
