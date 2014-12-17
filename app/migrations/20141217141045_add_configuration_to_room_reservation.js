'use strict';

exports.up = function(knex, Promise) {
  
    return knex.schema.table( "reservation_rooms", function( table ) {
        table.enu( "configuration", ["SINGLE",
                                     "DOUBLE",
                                     "TRIPLE",
                                     "SINGLE1CHILD",
                                     "SINGLE2CHILDREN",
                                     "DOUBLE1CHILD"] );
    } );
};

exports.down = function(knex, Promise) {
    return knex.schema.table( "reservation_rooms", function( table ) {
        table.dropColumn( "configuration" );
    } );
  
};
