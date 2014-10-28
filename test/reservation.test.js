"use strict";

/* jshint camelcase: false */

require( "should" );
require( "assert" );
require( "expect.js" );
var request = require( "supertest" );

var testsetup = require( "./testsetup" );
var Reservation = testsetup.models.Reservation;

var testData = testsetup.testData;

//var testData = require("./testdata_Reservation"); 

describe( "Reservation API", function() {

    before( function( done ) {
        done();
    } );

    beforeEach( function( done ) {
        //delete all Reservations in the database
        Reservation.query().del().then( done.bind( null, null ) );
    } );

    it( "should save a valid reservation", function( done ) {
        
        var c = testData.reservations.a.clone().attributes;

        request( testsetup.appUrl )
            .post( "/api/reservations" )
            .send( c )
            .expect( 201 )
            .end( function( err, res ) {

            if( err ) { throw err; }

            res.body.should.have.property( "id" );
            res.body.should.have.property( "created_at" );
            res.body.should.have.property( "updated_at" );

            delete res.body.id;
            delete res.body.created_at;
            delete res.body.updated_at;

            res.body.should.eql( c );

            done();
        } );

    } );

    function testPresence( fieldName ) {
        it( "should require " + fieldName + " to be present", function( done ) {

            var c = testData.reservations.a.clone().attributes;
            delete c[fieldName];

            request( testsetup.appUrl )
                .post( "/api/reservations" )
                .send( c )
                .expect( 500 )
                .end( function( err, res ) {

                if( err ) { throw err; }

                res.body.should.have.property( fieldName );

                done();
            } );
        } );
    }
    
    testPresence( "customer" );
    testPresence( "room" );
    //testPresence( "discount" );
    testPresence( "roomCost" );

    it( "should perform validations on updates as well", function( done ) {
        
        testData.reservations.a.save().then( function( savedJohn ) {
            
            var c = testData.reservations.a.clone().attributes;
            c.discount = "-1";

            request( testsetup.appUrl )
                .put( "/api/reservations/" + savedJohn.id )
                .send( c )
                .expect( 500 )
                .end( function( err, res ) {

                if( err ) { throw err; }

                res.body.should.have.property( "discount" );
                
                done();
            } );

        } );

    } );

    it( "should fail to delete non-existing reservation", function( done ) {
        
        request( testsetup.appUrl )
            .delete( "/api/reservations/4711" )
            .expect( 404 )
            .end( function( err, res ) {

            if( err ) { throw err; }

            done();
        } );
    } );

    it( "should fail to update non-existing reservations", function( done ) {
        
        request( testsetup.appUrl )
            .put( "/api/reservations/4711" )
            .expect( 404 )
            .end( function( err, res ) {

            if( err ) { throw err; }

            done();
        } );
    } );

    it( "should successfully delete existing reservations", function( done ) {
        
        testData.reservations.a.save( {}, {method: "insert"})
                               .then( function( savedJohn ) {
            
            request( testsetup.appUrl )
                .delete( "/api/reservations/" + savedJohn.id )
                .expect( 200 )
                .end( function( err, res ) {

                if( err ) { throw err; }
                
                done();
            } );

        } );
    } );

} );
