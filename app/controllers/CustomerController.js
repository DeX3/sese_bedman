"use strict";

var ControllerBase = require( "./ControllerBase" );
var Customer = require( "../models/Customer" );

module.exports = ControllerBase.extend( {

    Model: Customer,

    pagination: {
        type: "auto",
        perPage: 10,
    },

    searchable: ["firstName", "lastName", "company"],

    update: function( req, res ) {
        
        var id = req.params.id;
        var data = Object.merge( req.body, req.query );

        delete data.reservations;

        Customer.where( { id: id } ).fetch().then( function( result ) {
            if( !result ) {
                res.status( 404 ).send();
            } else {
                return result.save( data, { patch: true } ).then(
                    function(savedModel) {
                    res.status( 200 ).json( savedModel );
                } );
            }
        } ).catch( function( error ) {
            res.status( 500 ).json( error );
        } );
        
    },
    
    //get a customer data and all his reservations
    get: function( req, res ) {

        var id = req.params.id;

        Customer.where( {id: id} ).fetch(
            { withRelated: "reservations" }        
        ).then( function( result ) {
            if( !result ) {
                res.status( 404 ).send();
            } else {
                res.json( result );
            }
        } ).catch( function(error) {
            console.dir( error );
            res.status( 500 ).json( error );
        } );
    }

} );

