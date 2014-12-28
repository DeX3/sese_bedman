"use strict";

var ControllerBase = require( "./ControllerBase" );
var Room = require( "../models/Room" );

module.exports = ControllerBase.extend( {
    Model: Room,
    pagination: {
        type: "auto",
        perPage: 10
    }
} );
