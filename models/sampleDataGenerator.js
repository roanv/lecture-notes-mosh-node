const {Genre} = require('./genre');
const {Customer} = require('./customer');
const {Movie} = require('./movie');
const {Rental} = require('./rental');

const sampleCustomers = [
  new Customer({name:'Jane Doe', isGold:false, phone:'123456789'}),
  new Customer({name:'Megan Champion', isGold:true, phone:'108192374'}),
  new Customer({name:'Blake Scott', isGold:false, phone:'5487427'}),
  new Customer({name:'Shani Cream', isGold:false, phone:'642846453'}),
  new Customer({name:'Jason Corne', isGold:false, phone:'86745482'}),
  new Customer({name:'Graeme Slate', isGold:true, phone:'126312778'}),
  new Customer({name:'Christie Chains', isGold:false, phone:'9865436325'}),
  new Customer({name:'Aaron Fluve', isGold:false, phone:'2357734'})
]

const sampleGenres = [
  new Genre({name:'Horror'}),
  new Genre({name:'Sci-Fi'}),
  new Genre({name:'Drama'}),
  new Genre({name:'Comedy'}),
  new Genre({name:'Action'}),
  new Genre({name:'Thriller'}),
  new Genre({name:'Romance'}),
  new Genre({name:'Adventure'})
]

const sampleMovies = [
  new Movie({title:'Blade Runner', genre: randGenre(), numberInStock:2, dailyRentalRate: 26}),
  new Movie({title:'Chicken Run', genre: randGenre(), numberInStock:6, dailyRentalRate: 11}),
  new Movie({title:'A Bugs Life', genre: randGenre(), numberInStock:24, dailyRentalRate: 32}),
  new Movie({title:'Jason Bourne', genre: randGenre(), numberInStock:26, dailyRentalRate: 56}),
  new Movie({title:'Mission Impossible', genre: randGenre(), numberInStock:23, dailyRentalRate: 31}),
  new Movie({title:'Arrival', genre: randGenre(), numberInStock:26, dailyRentalRate: 5}),
  new Movie({title:'Bad Boys', genre: randGenre(), numberInStock:15, dailyRentalRate: 13}),
  new Movie({title:'Rush Hour', genre: randGenre(), numberInStock:1, dailyRentalRate: 21})
]

const sampleRentals = [];

async function customers(){
    console.log('Generating sample customers...')    
    await sampleCustomers.map(async (customer) => {
      const exists = await Customer.findOne({name:customer.name});
      if (exists) return;
      await customer.save();
    });
    console.log(`Sample customers done.`);
  }

async function genres(){
  console.log('Generating sample genres...')    
  await sampleGenres.map(async (genre) => {
    const exists = await Genre.findOne({name:genre.name});
    if (exists) return;
    await genre.save();
  });
  console.log(`Sample genres done.`);
}

async function movies(){
  console.log('Generating sample movies...')
  await sampleMovies.map(async (movie) =>{
    const exists = await Movie.findOne({title:movie.title});
    if (exists) return;
    await movie.save();
  });
  console.log(`Sample movies done.`);
}

async function rentals(){
  console.log('Generating sample rentals...')

  await Rental.deleteMany({});

  for (let i = 0; i < 10; i++){
    const rental = new Rental({
      customer:randCustomer(),
      movie:randMovie()
    })    
    sampleRentals.push(rental);
  }

  await sampleRentals.map(async (rental) =>{
    const exists = await Rental.findOne({
      customer:{name:rental.customer.name},
      movie:{title:rental.movie.title},
      dateOut:rental.dateOut
    });
    if (exists) return;
    await rental.save();
  });
  console.log(`Sample rentals done.`);
}

function randGenre(){  
  const rand = Math.floor(Math.random() * sampleGenres.length);
  return sampleGenres[rand];
}

function randCustomer(){
  const rand = Math.floor(Math.random() * sampleCustomers.length);
  return sampleCustomers[rand];
}

function randMovie(){
  const rand = Math.floor(Math.random() * sampleMovies.length);
  return sampleMovies[rand];
}

function randDate(daysAgo){
  const start = new Date();
  start.setTime(Date.now - (1000 * 60 * 60 * 24 * daysAgo));
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
  

exports.customers = customers;
exports.genres = genres;
exports.movies = movies;
exports.rentals = rentals;