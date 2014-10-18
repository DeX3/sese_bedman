"use strict";

module.exports.withModels = function( models ) {

    var Customer = models.Customer;

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
        }
    };

};
