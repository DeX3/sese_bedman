'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.table( "rooms", function( table ) {

        table.dropColumn( "priceSingle" );
        table.dropColumn( "priceDouble" );
        table.dropColumn( "priceTriple" );
        table.dropColumn( "priceSingleChild" );
        table.dropColumn( "priceSingleTwoChildren" );
        table.dropColumn( "priceDoubleChild" );

    } ).table( "rooms", function( table ) {

        table.float( "priceSingle" );
        table.float( "priceDouble" );
        table.float( "priceTriple" );
        table.float( "priceSingleChild" );
        table.float( "priceDoubleChild" );
        table.float( "priceSingleTwoChildren" );
    } );
};

exports.down = function(knex, Promise) {
    return knex.schema.table( "rooms", function( table ) {

        table.dropColumn( "priceSingle" );
        table.dropColumn( "priceDouble" );
        table.dropColumn( "priceTriple" );
        table.dropColumn( "priceSingleChild" );
        table.dropColumn( "priceSingleTwoChildren" );
        table.dropColumn( "priceDoubleChild" );

    } ).table( "rooms", function( table ) {

        table.integer("priceSingle");
        table.integer("priceDouble");
        table.integer("priceTriple");
        table.integer("priceSingleChild");
        table.integer("priceSingleTwoChildren");
        table.integer("priceDoubleChild");
    } );
};
