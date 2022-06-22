const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');
const {Movie} = require('../../models/movie');
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');
const server = require('../../server');

describe('/api/returns', () =>{
    let payload = {};
    let rental;
    let token; 
    let movie;

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
        
        movie = new Movie({
            id: movieId,
            title: 'movie',
            dailyRentalRate: 2,
            genre:{name:'genre'},
            numberInStock: 10
        });

        await movie.save();
        
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
        await Movie.deleteMany({});
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
            const dbRental = await Rental.findOne({id:rental.id});
            const diff = new Date() - dbRental.dateReturned;
            expect(diff).toBeLessThan(moment.duration(10,'seconds').asMilliseconds());
        });

        it ('should set rental fee', async() => {
            rental.dateOut = moment().add(-7,'days').toDate();            
            await rental.save();
            await send();
            const dbRental = await Rental.findOne({id:rental.id});
            expect(dbRental.rentalFee).toBe(14);
        });
        it ('should increase stock for movie', async() => {
            await send();            
            const dbMovie = await Movie.findOne({id:movie.id});
            expect(dbMovie.numberInStock).toBe(movie.numberInStock+1);
        });
        it ('should return the rental', async() => {
            const res = await send();
            expect(res.body._id).toBe(rental.id);
            expect(res.body).toHaveProperty('dateOut');
            expect(res.body).toHaveProperty('dateReturned');
            expect(res.body).toHaveProperty('rentalFee');
            expect(res.body).toHaveProperty('customer');
            expect(res.body).toHaveProperty('movie');
        });
    });

    
    afterAll(async () => {server.close();});
});

