'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.table("reservation",function(table){
        table.integer("bill_id").unsigned().references("bills.id").onDelete("CASCADE");
    });  
};

exports.down = function(knex, Promise) {
  return knex.schema.table("reservation",function(table){
      table.dropColumn("reservation_id");
  });
};
