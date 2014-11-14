'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.table( "reservation", function( table ) {
        //delete the now unnecessary dummy-key
        table.dropColumn( "customer" );
    } ).createTable( "customers_reservation", function( table ) {
        table.increments();
        table.timestamps();
        table.integer( "customer_id" ).unsigned()
                                      .references( "customers.id" )
                                      .onDelete( "CASCADE" );
        table.integer( "reservation_id" ).unsigned()
                                         .references( "reservation.id" )
                                         .onDelete( "CASCADE" );
    } );
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable( "customers_reservation" )
                      .table( "reservation", function( table ) {

        //re-add the dummy-key for backwards compatibility
        table.string( "customer" ).notNullable();
  } );
};
