function init(app){
    app.set('view engine', 'pug'); // enable pug
    app.set('views','./views'); // optional (this is default value)
    app.get('/',(req, res) => {res.render('index',{title:'Vidly',message:'Welcome to Vidly!'});}) // pug render    
}

exports.init = init;