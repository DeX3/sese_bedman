"use strict";

/* jshint camelcase: false */

require( "should" );
require( "assert" );
require( "expect.js" );
var request = require( "supertest" );

var testsetup = require( "./testsetup" );
var Customer = testsetup.models.Customer;

var testData = testsetup.testData;

describe( "Customer API", function() {

    before( function( done ) {
        done();
    } );

    beforeEach( function( done ) {
        //delete all Customers in the database
        Customer.query().del().then( done.bind( null, null ) );
    } );

    it( "should save a valid customer", function( done ) {
        
        var c = testData.customers.john.clone().attributes;

        request( testsetup.appUrl )
            .post( "/api/customers" )
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

            var c = testData.customers.john.clone().attributes;
            delete c[fieldName];

            request( testsetup.appUrl )
                .post( "/api/customers" )
                .send( c )
                .expect( 500 )
                .end( function( err, res ) {

                if( err ) { throw err; }

                res.body.should.have.property( fieldName );
                throw new Error( "this will make the build fail" );

                done();
            } );
        } );
    }
    
    testPresence( "firstName" );
    testPresence( "lastName" );
    testPresence( "company" );
    testPresence( "email" );

    it( "should require email to be a valid email", function( done ) {

        var c = testData.customers.john.clone().attributes;
        c.email = "asdf";

        request( testsetup.appUrl )
            .post( "/api/customers" )
            .send( c )
            .expect( 500 )
            .end( function( err, res ) {

            if( err ) { throw err; }

            res.body.should.have.property( "email" );
            
            done();
        } );
    } );

    it( "should perform validations on updates as well", function( done ) {
        
        testData.customers.john.save().then( function( savedJohn ) {
            
            var c = testData.customers.john.clone().attributes;
            c.email = "asdf";

            request( testsetup.appUrl )
                .put( "/api/customers/" + savedJohn.id )
                .send( c )
                .expect( 500 )
                .end( function( err, res ) {

                if( err ) { throw err; }

                res.body.should.have.property( "email" );
                
                done();
            } );

        } );

    } );

    it( "should fail to delete non-existing customers", function( done ) {
        
        request( testsetup.appUrl )
            .delete( "/api/customers/4711" )
            .expect( 404 )
            .end( function( err, res ) {

            if( err ) { throw err; }

            done();
        } );
    } );

    it( "should fail to update non-existing customers", function( done ) {
        
        request( testsetup.appUrl )
            .put( "/api/customers/4711" )
            .expect( 404 )
            .end( function( err, res ) {

            if( err ) { throw err; }

            done();
        } );
    } );

    it( "should successfully delete existing customers", function( done ) {
        
        testData.customers.john.save( {}, {method: "insert"})
                               .then( function( savedJohn ) {
            
            request( testsetup.appUrl )
                .delete( "/api/customers/" + savedJohn.id )
                .expect( 200 )
                .end( function( err, res ) {

                if( err ) { throw err; }
                
                done();
            } );

        } );
    } );

} );
