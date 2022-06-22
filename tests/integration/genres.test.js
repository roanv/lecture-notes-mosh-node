const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const server = require('../../app');

describe('/api/genres', () => {
    beforeEach(async ()=>{ 
        await Genre.deleteMany({});
    }); 
    afterEach(async ()=>{
        await Genre.deleteMany({});
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
    
        it('should return 400 if invalid id is passed', async () => {
          const id = 123;
          const res = await request(server).get('/api/genres/' + id);
    
          expect(res.status).toBe(400);
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
    
          const genre = await Genre.findOne({ name });
          expect(genre).toHaveProperty("_id");
          expect(genre.name).toBe(name);
        });
    
        it('should return the genre if it is valid', async () => {
          const res = await exec();
          expect(res.body).toHaveProperty("_id");
          expect(res.body.name).toBe(name);
        });
      });

      describe('PUT /:id', () => {
        let token; 
        let newName; 
        let genre; 
        let id; 
    
        const exec = async () => {
          return await request(server)
            .put('/api/genres/' + id)
            .set('x-auth-token', token)
            .send({ name: newName });
        }
    
        beforeEach(async () => {
          // Before each test we need to create a genre and 
          // put it in the database.      
          genre = new Genre({ name: 'Comedy' });
          await genre.save();
          
          token = new User().generateAuthToken();     
          id = genre.id; 
          newName = 'updatedName'; 
        })
    
        it('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        it('should return 400 if genre is less than 5 characters', async () => {
          newName = '1234'; 
          
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        it('should return 400 if genre is more than 50 characters', async () => {
          newName = new Array(52).join('a');
    
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        it('should return 400 if id is invalid', async () => {
          id = 1;
    
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        it('should return 404 if genre with the given id was not found', async () => {
          id = new mongoose.Types.ObjectId();
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should update the genre if input is valid', async () => {
          await exec();
    
          const updatedGenre = await Genre.findById(genre._id);
    
          expect(updatedGenre.name).toBe(newName);
        });
    
        it('should return the updated genre if it is valid', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty("_id");
          expect(res.body.name).toBe(newName);
        });
      });  
    
});

server.close()