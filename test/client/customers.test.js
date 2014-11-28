"use strict";

/* jshint expr: true */

describe( "Customer controllers", function() {

    beforeEach( module("bedman") );

    afterEach( inject( function( $httpBackend ) {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    } ) );

    describe( "CustomerListCtrl", function() {
        it( "should exist",
            inject( function( $controller,
                              $rootScope,
                              $httpBackend,
                              Customer ) {

            $httpBackend.when( "GET", "/api/customers" )
                        .respond( [] );

            var ctrl = $controller( "CustomerListCtrl", {
                $scope: $rootScope.$new(),
                Customer: Customer
            } );

            $httpBackend.flush();

            chai.expect( ctrl ).to.exist;
        } ) );

        it( "should provide a customers array",
            inject( function( $controller,
                              $rootScope,
                              $httpBackend,
                              Customer ) {

            $httpBackend.when( "GET", "/api/customers" )
                        .respond( [] );

            var scope = $rootScope.$new();
            $controller( "CustomerListCtrl", {
                $scope: scope,
                Customer: Customer
            } );

            $httpBackend.flush();

            chai.expect( scope.customers ).to.exist;
            chai.expect( scope.customers ).to.be.empty;
        } ) );
    } );

    describe( "CustomerEditCtrl", function() {

        it( "should exist",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Customer ) {

            var ctrl = $controller( "CustomerEditCtrl", {
                $scope: $rootScope.$new(),
                $routeParams: { id: "create" },
                $location: $location,
                Customer: Customer
            } );
            chai.expect( ctrl ).to.exist;
        } ) );

        it( "should create a new customer",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Customer ) {

            var scope = $rootScope.$new();

            $controller( "CustomerEditCtrl", {
                $scope: scope,
                $routeParams: { id: "create" },
                $location: $location,
                Customer: Customer
            } );

            chai.expect( scope.customer ).to.exist;
        } ) );

        it( "should provide an existing customer",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Customer ) {

            $httpBackend.when( "GET", "/api/customers/4711" )
                        .respond( { id: 4711 } );

            var scope = $rootScope.$new();
            $controller( "CustomerEditCtrl", {
                $scope: scope,
                $routeParams: { id: 4711 },
                $location: $location,
                Customer: Customer
            } );

            $httpBackend.flush();

            chai.expect( scope.customer ).to.exist;
            chai.expect( scope.customer.id ).to.equal( 4711 );

        } ) );

        it( "should provide a save method to save a customer",
            inject( function( $controller,
                              $rootScope,
                              $location,
                              $httpBackend,
                              Customer ) {

            var scope = $rootScope.$new();

            $controller( "CustomerEditCtrl", {
                $scope: scope,
                $routeParams: { id: "create" },
                $location: $location,
                Customer: Customer
            } );

            $httpBackend.when( "POST", "/api/customers" )
                        .respond( { id: 4711 } );

            scope.save();

            $httpBackend.flush();
        } ) );
    } );

} );
