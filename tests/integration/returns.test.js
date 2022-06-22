const {Rental} = require('../../models/rental');
const mongoose = require('mongoose');
server = require('../../app');


describe('/api/returns', () =>{
    let server;
    let customerId;
    let movieId;
    let rental;


    beforeEach( async() => {
        customerId = new mongoose.Types.ObjectId()
        movieId = new mongoose.Types.ObjectId()
        
        rental = new Rental({
            customer:{
                id: customerId,
                name: 'cstmr',
                phone: '12345'
            },
            movie:{
                id: movieId,
                title: 'movie',
                dailyRentalRate: 2
            }            
        });
        await rental.save();
    });
    afterEach(async () => {
        
        await Rental.deleteMany({});
    });

    it('should work', async () => {
        const result = await Rental.findOne({id:rental.id});
        expect(result).not.toBeNull();
        expect(result.id).toBe(rental.id);
    });

    // POST /api/returns {customerId, movieId}    

    // Return 401 if client is not logged in
    // Return 400 if customerId is not provided
    // Return 400 if movieId is not provided
    // Return 404 if not rental is found for this customer
    // Return 400 if rental already processed  
    
    // Return 200 if valid request
    // Set return date
    // Calculate rental fee
    // Increase the stock
    // Return the rental

});

server.close();