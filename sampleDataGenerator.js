const Genre = require('./models/genre');
const Customer = require('./models/customer');

async function customers(){
    console.log('Generating sample customers...')
    const sampleData = [
      new Customer({name:'Jane Doe', isGold:false, phone:'123456789'}),
      new Customer({name:'Megan Champion', isGold:true, phone:'108192374'}),
      new Customer({name:'Blake Scott', isGold:false, phone:'5487427'}),
      new Customer({name:'Shani Cream', isGold:false, phone:'642846453'}),
      new Customer({name:'Jason Corne', isGold:false, phone:'86745482'}),
      new Customer({name:'Graeme Slate', isGold:true, phone:'126312778'}),
      new Customer({name:'Christie Chains', isGold:false, phone:'9865436325'}),
      new Customer({name:'Aaron Fluve', isGold:false, phone:'2357734'}),
    ]
    await sampleData.map(async (customer) => {
      //console.log(`Checking if ${customer.name} exists...`);
      const exists = await Customer.findOne({name:customer.name});
      if (!exists) {
        //console.log(`Adding sample customer: ${customer.name}.`);
        await customer.save();
      } else{
        //console.log(`Sample customer ${customer.name} already exists. Skipping...`)
      }
    });
    console.log(`Done generating sample customers.`);
  }

  async function genres(){
    console.log('Generating sample genres...')
    const sampleData = [
      new Genre({name:'Horror'}),
      new Genre({name:'Sci-Fi'}),
      new Genre({name:'Drama'}),
      new Genre({name:'Comedy'}),
      new Genre({name:'Action'}),
      new Genre({name:'Thriller'}),
      new Genre({name:'Romance'}),
      new Genre({name:'Adventure'}),
    ]
    await sampleData.map(async (genre) => {
      //console.log(`Checking if ${genre.name} exists...`);
      const exists = await Genre.findOne({name:genre.name});
      if (!exists) {
        //console.log(`Adding sample genre: ${genre.name}.`);
        await genre.save();
      } else{
        //console.log(`Sample genre ${genre.name} already exists. Skipping...`)
      }
    });
    console.log(`Done generating sample genres.`);
  }
  

  exports.customers = customers;
  exports.genres = genres;