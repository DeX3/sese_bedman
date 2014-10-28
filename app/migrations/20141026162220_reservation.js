'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable( "reservation", function( table ) {
        table.increments();
        table.timestamps();
        table.string( "customer" ).notNullable();	//Foreign Key
        table.string( "room" ).notNullable();		//Foreign Key
        table.float( "discount" );
        table.float( "roomCost").notNullable();
    } );
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable( "reservation" );
};
