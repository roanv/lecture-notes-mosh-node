const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
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

    describe('POST /', () => {
        let token; 
        let name; 
    
        const exec = async () => {
          return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name });
        }
    
        beforeEach(() => {
          token = new User().generateAuthToken();      
          name = 'Adventure'; 
        })
    
        it('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        it('should return 400 if genre is less than 5 characters', async () => {
          name = '1234'; 
          
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        it('should return 400 if genre is more than 50 characters', async () => {
          name = new Array(52).join('a');
    
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        it('should save the genre if it is valid', async () => {
          await exec();
    
          const genre = await Genre.find({ name });
    
          expect(genre).not.toBeNull();
        });
    
        it('should return the genre if it is valid', async () => {
          const res = await exec();
    
          expect(res.body.name).toBe(name);
        });
      });
});