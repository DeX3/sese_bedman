"use strict";

/* jshint expr: true */

describe( "Customer controllers", function() {

    beforeEach(    module("bedman") );

    describe( "CustomerListCtrl", function() {
        it( "should exist",
            inject( function( $controller, $rootScope ) {

            var mockedParams = mockParamsList( $controller, $rootScope );

            var ctrl = $controller( "CustomerListCtrl", mockedParams );
            chai.expect( ctrl ).to.exist;
        } ) );

        it( "should provide a customers array",
            inject( function( $controller, $rootScope ) {

            var mockedParams = mockParamsList( $controller, $rootScope );
            $controller( "CustomerListCtrl", mockedParams );

            chai.expect( mockedParams.$scope.customers ).to.exist;
            chai.expect( mockedParams.$scope.customers ).to.be.empty;
            chai.expect( mockedParams.Customer.query ).to.have.been.called();
        } ) );
    } );

    describe( "CustomerEditCtrl", function() {

        it( "should exist",
            inject( function( $controller, $rootScope ) {

            var mockedParams = mockParamsEdit( $controller,
                                               $rootScope,
                                               { id: "create" } );            
            var ctrl = $controller( "CustomerEditCtrl", mockedParams );
            chai.expect( ctrl ).to.exist;
        } ) );

        it( "should create a new customer",
            inject( function( $controller, $rootScope ) {

            var mockedParams = mockParamsEdit( $controller,
                                               $rootScope,
                                               { id: "create" } );
            $controller( "CustomerEditCtrl", mockedParams );

            chai.expect( mockedParams.$scope.customer ).to.exist;
            chai.expect( mockedParams.Customer ).to.have.been.called();
        } ) );

        it( "should provide an existing customer",
            inject( function( $controller, $rootScope ) {

            var mockedParams = mockParamsEdit( $controller,
                                               $rootScope,
                                               { id: 4711 } );
            $controller( "CustomerEditCtrl", mockedParams );

            chai.expect( mockedParams.$scope.customer ).to.exist;
            chai.expect( mockedParams.Customer ).to.not.have.been.called();
            chai.expect( mockedParams.Customer.get ).to.have.been.called.with(
                { id: 4711 }
            );

            chai.expect( mockedParams.$scope.customer.id ).to.equal( 4711 );

        } ) );

        it( "should provide a save method to save a customer",
            inject( function( $controller, $rootScope ) {

            var mockedParams = mockParamsEdit( $controller,
                                               $rootScope,
                                               { id: "create" } );
            $controller( "CustomerEditCtrl", mockedParams );
            mockedParams.$scope.save();

            chai.expect( mockedParams.Customer ).to.have.been.called();
            chai.expect(
                mockedParams.$scope.customer.$save
            ).to.have.been.called();
        } ) );
    } );

    function mockParamsList( controller, rootScope ) {
        
        var ret = {
            $scope: rootScope.$new(),
            Customer: chai.spy()
        };
        
        ret.Customer.query = chai.spy( function() {
            return [];
        } );

        return ret;
    }

    function mockParamsEdit( controller, rootScope, routeParams ) {
        var ret = mockParamsList( controller, rootScope );

        ret.$routeParams = routeParams;
        ret.Customer.get = chai.spy( function( criteria ) {
            return criteria;
        } );
        ret.Customer.prototype.$save = chai.spy();

        return ret;
    }
} );
