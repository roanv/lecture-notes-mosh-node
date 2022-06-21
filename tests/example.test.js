const c = require('config');
const {db, absolute, applyDiscount} = require('./example');

describe('absolute',()=>{
    it('should return a positive number if input is positive', ()=>{
        const result = absolute(1);
        expect(result).toBe(1);
    });
    it('should return a positive number if input is negative', ()=>{
        const result = absolute(-1);
        expect(result).toBe(1);
    });
    it('should return 0 if input is 0', ()=>{
        const result = absolute(0);
        expect(result).toBe(0);
    });
});

// isolating units with external dependencies 
describe('applyDiscount',()=>{
    it('should apply 10% discount if customer has more than 10 points',()=>{
        db.getCustomer = function(customerId){ // replace the dependency with a mock function
            console.log('Mock getting customer from DB...');
            return {id:customerId,points:20}; // returns a fake user object
        }
        const order = {customerId:1,totalPrice:10};
        applyDiscount(order); // now when applyDiscount calls db.getCustomer, it calls the mock method defined above
        expect(order.totalPrice).toBe(9);
    });
});
