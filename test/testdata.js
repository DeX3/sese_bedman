"use strict";

module.exports.withModels = function( models ) {

    var Customer = models.Customer;
    var Bill = models.Bill;
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
        bills:{
            r1: new Bill( {
                billId: "r1",
                date:"1988-10-04",
                price: 12.12
            } ),
            r2: new Bill( {
                billId: "r2",
                date: "1988-10-04",
                price: 11.11
            } )
        }
    };

};
