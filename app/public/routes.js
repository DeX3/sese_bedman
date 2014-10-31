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
	when( "/bills", {
            templateUrl: "public/views/bills/index.html",
            controller: "BillsListCtrl"
        } ).
        when( "/bills/:id", {
            templateUrl: "public/views/bills/edit.html",
            controller: "BillsEditCtrl"
        } ).
        otherwise( {
            redirectTo: "/customers"
        } );
}] );

