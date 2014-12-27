"use strict";

var app = angular.module( "bedman" );

app.factory( "Room", function( $Model ) {

    // maps maximum capacity to available configurations
    var CONFIGURATIONS = {
        1: ["SINGLE"],
        2: ["SINGLE", "DOUBLE", "SINGLE1CHILD"],
        3: ["SINGLE", "DOUBLE", "TRIPLE", "SINGLE1CHILD",
            "SINGLE2CHILDREN", "DOUBLE1CHILD"]
    };

    // maps configurations to display names
    var CONFIGURATION_NAMES = {
        "SINGLE": "Single",
        "DOUBLE": "Double",
        "TRIPLE": "Triple",
        "SINGLE1CHILD": "Single + a child",
        "SINGLE2CHILDREN": "Single + two children",
        "DOUBLE1CHILD": "Double + a child"
    };

    // maps configurations to price column names
    var CONFIGURATION_COSTS = {
        "SINGLE": "priceSingle",
        "DOUBLE": "priceDouble",
        "TRIPLE": "priceTriple",
        "SINGLE1CHILD": "priceSingleChild",
        "SINGLE2CHILDREN": "priceSingleTwoChildren",
        "DOUBLE1CHILD": "priceDoubleChild"
    };

    return $Model.extend(
        {
            name: "Room",
            url: "/api/rooms",
        },
        {
            isConfigurationAvailable: function( cfg ) {
                return CONFIGURATIONS[this.maxCap].indexOf( cfg ) >= 0;
            },
            getAvailableConfigurations: function() {
                return (CONFIGURATIONS[this.maxCap] || []).map(
                    function( config ) {
                        return {
                            value: config,
                            name: CONFIGURATION_NAMES[config]
                        };
                    }
                );
            },
            getDailyCosts: function() {
                
                var priceColumn = CONFIGURATION_COSTS[this.configuration];
                if( priceColumn ) {
                    return this[priceColumn];
                }
            }
        }
    );
} );
