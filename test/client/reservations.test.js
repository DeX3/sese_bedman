"use strict";

/* jshint expr: true */

describe( "Reservation controllers", function() {

	beforeEach(	module("bedman") );

	describe( "ReservationListCtrl", function() {
        it( "should exist",
			inject( function( $controller, $rootScope ) {

			var mockedParams = mockParamsList( $controller, $rootScope );

			var ctrl = $controller( "ReservationListCtrl", mockedParams );
            chai.expect( ctrl ).to.exist;
        } ) );

        it( "should provide a reservations array",
            inject( function( $controller, $rootScope ) {

			var mockedParams = mockParamsList( $controller, $rootScope );
			$controller( "ReservationListCtrl", mockedParams );

            chai.expect( mockedParams.$scope.reservations ).to.exist;
			chai.expect( mockedParams.$scope.reservations ).to.be.empty;
			chai.expect( mockedParams.Reservation.query ).to.have.been.called();
        } ) );
    } );

    describe( "ReservationEditCtrl", function() {

        it( "should exist",
			inject( function( $controller, $rootScope ) {

			var mockedParams = mockParamsEdit( $controller,
											   $rootScope,
											   { id: "create" } );            
            console.dir( mockedParams );
			var ctrl = $controller( "ReservationEditCtrl", mockedParams );
            chai.expect( ctrl ).to.exist;
        } ) );

		it( "should create a new reservation",
			inject( function( $controller, $rootScope ) {

			var mockedParams = mockParamsEdit( $controller,
											   $rootScope,
											   { id: "create" } );
			$controller( "ReservationEditCtrl", mockedParams );

			chai.expect( mockedParams.$scope.reservation ).to.exist;
			chai.expect( mockedParams.Reservation ).to.have.been.called();
		} ) );

		it( "should provide an existing reservation",
			inject( function( $controller, $rootScope ) {

			var mockedParams = mockParamsEdit( $controller,
											   $rootScope,
											   { id: 4711 } );
			$controller( "ReservationEditCtrl", mockedParams );

			chai.expect( mockedParams.$scope.reservation ).to.exist;
			chai.expect( mockedParams.Reservation ).to.not.have.been.called();
			chai.expect( mockedParams.Reservation.get ).to.have.been.called.with(
				{ id: 4711 }
			);

			chai.expect( mockedParams.$scope.reservation.id ).to.equal( 4711 );

		} ) );

		it( "should provide a save method to save a reservation",
			inject( function( $controller, $rootScope ) {

			var mockedParams = mockParamsEdit( $controller,
											   $rootScope,
											   { id: "create" } );
			$controller( "ReservationEditCtrl", mockedParams );

            chai.expect( mockedParams.$scope.save ).to.be.a( "function" );
			mockedParams.$scope.save();

			chai.expect( mockedParams.Reservation ).to.have.been.called();
			chai.expect(
				mockedParams.$scope.reservation.$save
			).to.have.been.called();
		} ) );

        it( "should provide a list of customers to add to the reservation",
            inject( function( $controller, $rootScope ) {

			var mockedParams = mockParamsEdit( $controller,
											   $rootScope,
											   { id: "create" } );
			$controller( "ReservationEditCtrl", mockedParams );

            chai.expect( mockedParams.$scope.availableCustomers ).to.exist;

            chai.expect(
                mockedParams.$scope.availableCustomers
            ).not.to.be.empty;

            chai.expect(
                mockedParams.$scope.availableCustomers
            ).to.contain( { firstName: "Homer", lastName: "Simpson" } );

        } ) );
    } );

	function mockParamsList( controller, rootScope ) {
		
		var ret = {
			$scope: rootScope.$new(),
			Reservation: chai.spy()
		};
		
		ret.Reservation.query = chai.spy( function() {
			return [];
		} );

		return ret;
	}

	function mockParamsEdit( controller, rootScope, routeParams ) {
		var ret = mockParamsList( controller, rootScope );

		ret.$routeParams = routeParams;
		ret.Reservation.get = chai.spy( function( criteria ) {
			return criteria;
		} );
		ret.Reservation.prototype.$save = chai.spy( function(){
            return { catch: chai.spy() };
        } );

        ret.Customer = chai.spy( function() {} );
        ret.Customer.query = chai.spy( function() {
            return [{
                firstName: "Homer",
                lastName: "Simpson",
            }];
        } );
		return ret;
	}
} );
