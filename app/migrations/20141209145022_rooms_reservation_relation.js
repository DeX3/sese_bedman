'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table("reservation", function(table) {
	table.dropColumn("room");
  }).createTable("reservation_rooms", function(table){
	table.increments();
	table.timestamps();
	table.integer("room_id").unsigned().references("rooms.id").onDelete("CASCADE");
	table.integer("reservation_id").unsigned().references("reservation.id").onDelete("CASCADE");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("reservation_rooms")
	.table("reservation", function(table){
	
	table.string("room").notNullable();
	});
};
