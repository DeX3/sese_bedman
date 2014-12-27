'use strict';

exports.up = function(knex, Promise) {

    return knex.schema.table( "reservation", function( table ) {
        table.dropColumn( "roomCost" );
        table.dropColumn( "discount" );
        table.date( "from" ).notNullable();
        table.date( "to" ).notNullable();
    } ).then( function() {
        //make sure to update existing reservations with dummy dates
        return knex( "reservation" ).update( {
            from: new Date(),
            to: new Date()
        } );
    } );
};

exports.down = function(knex, Promise) {
    return knex.schema.table( "reservation", function( table ) {
        table.dropColumn( "from" );
        table.dropColumn( "to" );
        table.float( "discount" );
        table.float( "roomCost").notNullable();
    } );

};
