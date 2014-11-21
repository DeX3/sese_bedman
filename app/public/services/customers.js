"use strict";

var app = angular.module( "bedman" );

app.factory( "Customer", function( $Model ) {

    return $Model.extend(
        {
            name: "Customer",
            url: "/api/customers",
        },
        {
            fullName: function() {
                return this.firstName + " " + this.lastName;
            }
        }
    );
} );
