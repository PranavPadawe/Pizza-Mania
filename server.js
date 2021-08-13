require('dotenv').config()
const express = require("express");
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')

//database connections

mongoose.connect(process.env.MONGO_CONNECTION_URL,{ useNewUrlParser: true,useCreateIndex: true,useUnifiedTopology: true,
useFindAndModify: true});
const connection = mongoose.connection;
connection.once('open', ()=>{
  console.log('Database connection.....');
}).catch(err =>{
  console.log('Connection failed......')
});

//session store
/*let mongoStore = new MongoDbStore({
          mongooseConnection: connection,
          collection: 'sessions'
        })*/

//session config
app.use(session({
  secret: process.env.COOKIE_SECRET,      //for cookies
  resave: false,
  store: MongoDbStore.create({
    mongoUrl: process.env.MONGO_CONNECTION_URL
    //collection: 'sessions'
  }),
  saveUninitialized: false,
  cookie: { maxAge: 100*60*60*24 }       //24 hrs in ms
}))

//Assets
app.use(express.static('public'))
app.use(express.json())


//Global middleware
app.use((req, res, next)=>{
  res.locals.session = req.session
  next()
})

//set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app)



app.listen(PORT , ()=>{
  console.log(`Listen to port on ${PORT}`)
})
