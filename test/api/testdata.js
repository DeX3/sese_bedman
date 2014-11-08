"use strict";

module.exports = {
    customers: {
        john: {
            firstName: "John",
            lastName: "Doe",
            company: "Company",
            phone: "123456789",
            email: "john.doe@example.com"
        },
        jane: {
            firstName: "Jane",
            lastName: "Doe",
            company: "Company",
            phone: "987654321",
            email: "jane.doe@example.com"
        },
    },
    bills: {
        r1: {
            billId: "r1",
            date:"1988-10-04",
            price: 12.12
        },
 	rooms: {
            a: {
                name: "A",
                maxCap: 1,
				priceSingle : 30
            },
            b: {
                name: "B",
                maxCap: 2,
				priceSingle : 15
            }
        }
    },
    reservations: {
        a: {
            room: "HS 14",
            discount: 0,
            roomCost: 45
        },
        b: {
            room: "366",
            discount: 33,
            roomCost: 49.90
        }
    }
};
