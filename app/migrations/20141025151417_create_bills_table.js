'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable( "bills", function( table ) {
        table.increments();
        table.timestamps();
        table.decimal( "price" ).notNullable();
        table.date( "date" ).notNullable();
    } );
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable( "bills" );
};
