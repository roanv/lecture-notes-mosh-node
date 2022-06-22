const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const request = require('supertest');
const server = require('../../server');

describe('/api/returns', () =>{
    let payload = {};
    let rental;
    let token; 

    const send = async () => {
        return await request(server)
          .post('/api/returns')
          .set('x-auth-token', token)
          .send(payload) // send valid data
    }
    
    beforeEach( async() => {
        const customerId = new mongoose.Types.ObjectId();
        const movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();      
        
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
        payload = {customerId,movieId};
    });
    
    afterEach(async () => {        
        await Rental.deleteMany({});
    });     

    // POST /api/returns {customerId, movieId}    
    describe('POST /', ()=>{         
        
        it ('should return 401 if client is not logged in', async()=>{
            token = '';
            const res = await send();
            expect(res.status).toBe(401);
        });
        it ('should return 400 if customerId is not provided', async() => {
            payload.customerId = null;
            const res = await send();
            expect(res.status).toBe(400);
        });
        it ('should return 400 if movieId is not provided', async() => {
            payload.movieId = null;
            const res = await send();
            expect(res.status).toBe(400);
        });
        it ('should return 404 if rental not found for this customer', async() => {
            await Rental.deleteMany({});
            const res = await send();
            expect(res.status).toBe(404);
        });
        it ('should return 400 if rental already processed', async() => {
            rental.dateReturned = new Date();
            await rental.save();
            const res = await send();
            expect(res.status).toBe(400);
        });
        it ('should return 200 if valid request', async() => {
            const res = await send();
            expect(res.status).toBe(200);
        });
        it ('should set return date', async() => {
            await send();
            const result = await Rental.findOne({id:rental.id});
            expect(result).toBeDefined();
            expect(result.dateReturned).toBeDefined();
            const diff = new Date() - result.dateReturned;
            expect(diff).toBeLessThan(10*1000);
        });
        
        // Calculate rental fee
        // Increase the stock
        // Return the rental
    });

    
    afterAll(async () => {server.close();});
});

