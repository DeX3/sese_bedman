'use strict';

exports.up = function(knex, Promise) {
 return knex.schema.createTable( "rooms", function( table ) {
        table.increments();
        table.timestamps();
        table.string( "name" ).notNullable();
        table.integer( "maxCap" ).notNullable();
        table.integer("priceSingle");
        table.integer("priceDouble");
        table.integer("priceTriple");
        table.integer("priceSingleChild");
        table.integer("priceSingleTwoChildren");
        table.integer("priceDoubleChild");
    } );
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable( "rooms" );
};
