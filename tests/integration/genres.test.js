const request = require('supertest');
const {Genre} = require('../../models/genre');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach(async ()=>{ 
        server = require('../../app') // need to load server before and close after each test 
        await Genre.remove({});
    }); 
    afterEach(async ()=>{
        server.close()
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            Genre.collection.insertMany([
                {name:'Horror'},
                {name:'Comedy'},
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'Horror')).toBeTruthy();
            expect(res.body.some(g => g.name === 'Comedy')).toBeTruthy();
        })
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
          const genre = new Genre({ name: 'Horror' });
          await genre.save();
    
          const res = await request(server).get('/api/genres/' + genre.id);
    
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('name', genre.name);     
        });
    
        it('should return 404 if invalid id is passed', async () => {
          const id = new mongoose.Types.ObjectId();
          const res = await request(server).get('/api/genres/' + id);
    
          expect(res.status).toBe(404);
        });
    
        it('should return 404 if no genre with the given id exists', async () => {
          const id = new mongoose.Types.ObjectId();
          const res = await request(server).get('/api/genres/' + id);
    
          expect(res.status).toBe(404);
        });
    });
});