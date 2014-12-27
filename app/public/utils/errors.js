"use strict";

var app = angular.module( "bedman" );

app.factory( "ValidationError", function() {

    function ValidationError( validationResults ) {
        this.validationResults = validationResults;
        this.message = "Validation failed";
    }

    return ValidationError;
} );
