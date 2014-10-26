'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable( "reservation", function( table ) {
        table.increments();
        table.timestamps();
        table.string( "customer" ).notNullable();
        table.string( "room" ).notNullable();
        table.float( "discount" );
        table.float( "roomCost").notNullable();
    } );
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable( "reservation" );
};
