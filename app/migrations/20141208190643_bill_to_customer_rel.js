'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table("bills", function(table){
	  table.integer("customer_id").unsigned().references("customers.id").onDelete("CASCADE");
  });
};

exports.down = function(knex, Promise) {
 return knex.schema.table("bills",function(table){
	table.dropColumn("customer_id");
 }); 
};
