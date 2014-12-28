'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.table("reservation",function(table){
        table.integer("bill_id").unsigned().references("bills.id").onDelete("SET NULL");
    });  
};

exports.down = function(knex, Promise) {
  return knex.schema.table("reservation",function(table){
      table.dropColumn("bill_id");
  });
};
