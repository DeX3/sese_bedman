"use strict";

module.exports.withModels = function( models ) {

    var Reservation = models.Reservation;

    return {
        reservations: {
            a: new Reservation( {
                customers: ["0", "1"] ,
                room: "22",
                discount: "0",
                roomCost: "45"
            } ),
            b: new Reservation( {
                customers: ["0", "1"] ,
                room: "366",
                discount: "0.33",
                roomCost: "49.90"
            } )
        }
    };

};
