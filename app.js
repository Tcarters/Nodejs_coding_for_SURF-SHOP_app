require('dotenv').config();

const createError   = require('http-errors');
const express       = require('express');
const engine        = require('ejs-mate');
const path          = require('path');
const favicon       = require('serve-favicon');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
// const bodyParser    = require('body-parser');
const passport      = require('passport');
const User          = require('./models/user');
const session       = require('express-session');
const mongoose      = require('mongoose');
const methodOverride = require('method-override');
// const mapBoxToken = process.env.MAPBOX_TOKEN;
// const seedPosts = require ('./seeds');
// seedPosts();

// require routes
const indexRouter = require('./routes/index');
const post        = require('./routes/post');
const reviews     = require('./routes/reviews');


// const usersRouter = require('./routes/users');

const app = express();
//connect to the database
//const connectDB = 
( async () => {
  try {
 await  mongoose.connect('mongodb://127.0.0.1:27017/surf-shop',{
     useNewUrlParser: true,  
     useCreateIndex: true,
     useUnifiedTopology: true
    })
      console.log(`Connected Sucessfully to DB on Worker process: ${process.pid}`) 
 
  }
    catch (err) { console.log('Error Connection to DB: ' + err ) }
    //then(() => console.log('Connected Successfully'))
    // catch( (err) => console.error('Error connection')); 
  }) ()
// mongoose.connect('mongodb://localhost:27017/surf-shop', { useNewUrlParser: true,  useUnifiedTopology: true }).
//   catch(error => handleError(error));
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('we\'re connected!') ;
// });

// use ejs-locals for all ejs templates;
app.engine('ejs', engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// set public assets directory
app.use(express.static('public'));

// uncomment after placing your favicon in /public 
app.use (favicon(path.join(__dirname, 'public', 'favicon.jpg')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Add moment to every view
app.locals.moment = require('moment');



// Configure Passport and Sessions
// We need session configuration before passport
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'Zhang pong pingy',
  resave: false,
  saveUninitialized: true
  // cookie: { secure: true }
}));
// CHANGE: USE 'createStrategy' INSTEAD OF 'authenticate'
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// settig local variables title middleware   before mount middlewarre
app.use(function(req, res, next) {
  // req.user = {
  //       //'_id' : '61fc207f4e0fcd9639735ef6',
  //        '_id' : '62041d6912bd966267fe5823',
  //       'username' : 'ed3'
  // }
  res.locals.currentUser = req.user;
  // set default page title
  res.locals.title = 'Surf Shop';
  // set success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;
  // set error flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;
  // continue on to next function in middleware chain
  next();

});

// Mount routes
app.use('/', indexRouter);
app.use('/post', post);
app.use('/post/:id/reviews', reviews);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
  // next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
console.log(err);
req.session.error = err.message;
res.redirect('back');

});

module.exports = app;
// module.exports = connectDB;
