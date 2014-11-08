"use strict";

/* jshint camelcase: false */

require( "should" );
require( "assert" );
require( "expect.js" );
var request = require( "supertest" );

var testsetup = require( "./testsetup" );
var Bill = testsetup.models.Bill;

var testData = testsetup.testData;

describe( "Bills API", function() {

    before( function( done ) {
        done();
    } );

    beforeEach( function( done ) {
        //delete all Bills in the database
        Bill.query().del().then( done.bind( null, null ) );
    } );

    it( "should save a valid Bill", function( done ) {
        
        var r1 = testData.bills.r1.clone().attributes;

        request( testsetup.appUrl )
            .post( "/api/bills" )
            .send( r1 )
            .expect( 201 )
            .end( function( err, res ) {

            if( err ) { throw err; }

            res.body.should.have.property( "id" );
            res.body.should.have.property( "created_at" );
            res.body.should.have.property( "updated_at" );

            delete res.body.id;
            delete res.body.created_at;
            delete res.body.updated_at;

            //compare the dates via date, not via strings
            new Date( res.body.date ).should.eql( new Date( r1.date ) );
            delete res.body.date;
            delete r1.date;

            res.body.should.eql( r1 );

            done();
        } );

    } );

    function testPresence( fieldName ) {
        it( "should require " + fieldName + " to be present", function( done ) {

            var r1 = testData.bills.r1.clone().attributes;
            delete r1[fieldName];

            request( testsetup.appUrl )
                .post( "/api/bills" )
                .send( r1 )
                .expect( 500 )
                .end( function( err, res ) {

                if( err ) { throw err; }

                res.body.should.have.property( fieldName );

                done();
            } );
        } );
    }
    
    testPresence( "price" );
    testPresence( "date" );
    testPresence( "billId" );

    it( "should require price to be a valid price", function( done ) {

        var r1 = testData.bills.r1.clone().attributes;
        r1.price = "asdf";

        request( testsetup.appUrl )
            .post( "/api/bills" )
            .send( r1 )
            .expect( 500 )
            .end( function( err, res ) {

            if( err ) { throw err; }

            res.body.should.have.property( "price" );
            
            done();
        } );
    } );

    it( "should perform validations on updates as well", function( done ) {
        
        testData.bills.r1.save().then( function( savedR1 ) {
            
            var r1 = testData.bills.r1.clone().attributes;
            r1.price = "asdf";

            request( testsetup.appUrl )
                .put( "/api/bills/" + savedR1.id )
                .send( r1 )
                .expect( 500 )
                .end( function( err, res ) {

                if( err ) { throw err; }

                res.body.should.have.property( "price" );
                
                done();
            } );

        } );

    } );

    it( "should fail to delete non-existing bill", function( done ) {
        
        request( testsetup.appUrl )
            .delete( "/api/bills/4711" )
            .expect( 404 )
            .end( function( err, res ) {

            if( err ) { throw err; }

            done();
        } );
    } );

    it( "should fail to update non-existing bills", function( done ) {
        
        request( testsetup.appUrl )
            .put( "/api/bills/4711" )
            .expect( 404 )
            .end( function( err, res ) {

            if( err ) { throw err; }

            done();
        } );
    } );

    it( "should successfully delete existing bills", function( done ) {
        
        testData.bills.r1.save( {}, {method: "insert"})
                               .then( function( savedR1 ) {
            
            request( testsetup.appUrl )
                .delete( "/api/bills/" + savedR1.id )
                .expect( 200 )
                .end( function( err, res ) {

                if( err ) { throw err; }
                
                done();
            } );

        } );
    } );

} );
