"use strict";

var app = angular.module( "bedman" );

/**
 * This directive will make a value null if it is an emtpy string or a string
 * containing only whitespace
 */
app.directive( "nullIfBlank", function() {
    return {
        require: "ngModel",
        link: function( scope, elem, attr, ctrl ) {
            ctrl.$parsers.unshift( function( value ) {
                
                if( value && !value.length && !value.trim().length ) {
                    return null;
                } else {
                    return value;
                }

            } );
        }
    };
} );
