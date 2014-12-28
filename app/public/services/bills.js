"use strict";

var app = angular.module( "bedman" );

/* jshint camelcase: false */
app.factory( "Bill", function( $Model, $http ) {
    return $Model.extend( {
        url: "/api/bills",
        dates: ["date"]
    }, {
        fetchDetails: function() {
            return $http( {
                method: "GET",
                url: this.$url + "/" + 
                        this.id + "/details?customer=" +
                            this.customer_id
            } ).then( function( resp ) {
                return resp.data;
            } );
        }
    } );
} );
