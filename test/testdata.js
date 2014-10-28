"use strict";

module.exports.withModels = function( models ) {

    var Customer = models.Customer;
    var Reservation = models.Reservation;

    return {
        customers: {
            john: new Customer( {
                firstName: "John",
                lastName: "Doe",
                company: "Company",
                phone: "123456789",
                email: "john.doe@example.com"
            } ),
            jane: new Customer( {
                firstName: "Jane",
                lastName: "Doe",
                company: "Company",
                phone: "987654321",
                email: "jane.doe@example.com"
            } )
        },
        reservations: {
            a: new Reservation( {
                customer: "0",
                room: "HS 14",
                discount: 0,
                roomCost: 45
            } ),
            b: new Reservation( {
                customer: "john",
                room: "366",
                discount: 33,
                roomCost: 49.90
            } )
        }
    };

};
