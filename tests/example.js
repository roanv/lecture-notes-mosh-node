module.exports.absolute = function (number){
    return (number >= 0) ? number : -number;
}

module.exports.applyDiscount = function (order) {
    const customer = db.getCustomer(order.customerId);
    if (customer.points > 10) order.totalPrice *= 0.9;
}

// this is the "real" external dependency db function that would normally talk to the db
db = function () { 
    getCustomer = function (id){
        console.log('Getting customer from database...');
        return {id: 12345, points:11};
    }
}

module.exports.db = db;