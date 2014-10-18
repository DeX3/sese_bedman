'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.createTable( "customers", function( table ) {
        table.increments();
        table.timestamps();
        table.string( "firstName" ).notNullable();
        table.string( "lastName" ).notNullable();
        table.string( "company" );
        table.string( "notes" );
        table.float( "discount" );
        table.string( "phone" ).notNullable();
        table.string( "fax" );
        table.string( "email" ).notNullable();
        table.string( "web" );
    } );
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable( "customers" );
};
