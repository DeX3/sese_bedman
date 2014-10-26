"use strict";

var app = angular.module( "bedman" );

app.config( ["$routeProvider", function( $routeProvider) {
    
    $routeProvider.
        when( "/customers", {
            templateUrl: "public/views/customers/index.html",
            controller: "CustomerListCtrl"
        } ).
        when( "/customers/:id", {
            templateUrl: "public/views/customers/edit.html",
            controller: "CustomerEditCtrl"
        } ).
        when( "/reservations", {
            templateUrl: "public/views/reservations/index.html",
            controller: "reservationListCtrl"
        } ).
        when( "/reservations/:id", {
            templateUrl: "public/views/customers/edit.html",
            controller: "CustomerEditCtrl"
        } ).
        otherwise( {
            redirectTo: "/customers"
        } );
}] );

