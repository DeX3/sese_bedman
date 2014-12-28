'use strict';

exports.up = function(knex, Promise) {
    knex.schema.table( "bills", function( table ) {
        table.dropColumn( "billId" );
    } ).debug();
};

exports.down = function(knex, Promise) {
  
    knex.schema.table( "bills", function( table ) {
        table.string( "billId" ).unique();
    } );

};
