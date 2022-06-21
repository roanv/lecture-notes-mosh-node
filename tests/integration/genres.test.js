const request = require('supertest');
const {Genre} = require('../../models/genre');
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
});