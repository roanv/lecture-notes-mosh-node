const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const request = require('supertest');
const server = require('../../server');

describe('/api/returns', () =>{
    let customerId;
    let movieId;
    let rental;
    let token; 

    afterAll(async () => {server.close();});

    beforeEach( async() => {
        customerId = new mongoose.Types.ObjectId()
        movieId = new mongoose.Types.ObjectId()
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
    });
    afterEach(async () => {
        
        await Rental.deleteMany({});
    });

     

    it('should return the valid baseline test rental', async () => {
        const result = await Rental.findOne({id:rental.id});
        expect(result).not.toBeNull();
        expect(result.id).toBe(rental.id);
    });

    // POST /api/returns {customerId, movieId}    
    describe('POST /', ()=>{    
        const exec = async () => {
          return await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({customerId,movieId}) // send valid data
        }
        
        it ('should return 401 if client is not logged in', async()=>{
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });
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

    

});

