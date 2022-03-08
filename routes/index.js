const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require ('../cloudinary');
const upload = multer ( { storage });
const { 
  landingPage,
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  getProfile,
  updateProfile,
  getForgotPw,
  putForgotPw,
  getReset,
  putReset
 } = require('../controllers'); // don't need to add '.js' at the end of index because 'require' already knows
const { 
        asyncErrorHandler,
        isLoggedIn, 
        isValidPassword,
        changePassword } = require('../middleware');
// const passport = require('passport');

/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

//(req, res, next) => {
//   res.render('index', { title: 'Surf Shop - Home' });
// });

/* GET /register */
router.get('/register', getRegister);
//(req, res, next) => {
 // res.send('GET /register');

/* POST /register */
router.post('/register', upload.single('image'), asyncErrorHandler( postRegister) );


/* GET /login */
router.get('/login', getLogin);
// (req, res, next) => {
//  res.send('GET /login');


/* POST /login */
router.post('/login',  asyncErrorHandler(postLogin) ); // passport.authenticate('local', { 
//   successRedirect: '/',
//   failureRedirect: '/login' 
// }));

/* GET /logout */
router.get('/logout', getLogout); // (req, res, next) => {
//   req.logout();
//   res.redirect('/');
// });

//(req, res, next) => {
//res.send('POST /login');

/* GET /profile */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile) );
//(req, res, next) => {
//  res.send('GET /profile');
//});

/* PUT /profile/:user_id */
router.put('/profile',  
          isLoggedIn,
          upload.single('image'),
          asyncErrorHandler(isValidPassword),
          asyncErrorHandler(changePassword),
          asyncErrorHandler(updateProfile) );
//:user_id', (req, res, next) => {
  //res.send('PUT /profile/:user_id');
//});

/* GET /forgot-pw */
router.get('/forgot-password', getForgotPw);
//(req, res, next) => {
//   res.send('GET /forgot-pw');
// });

/* PUT /forgot-pw */
router.put('/forgot-password', asyncErrorHandler(putForgotPw) );
// (req, res, next) => {
//   res.send('PUT /forgot-pw');
// });

/* GET /reset-pw/:token */
router.get('/reset/:token', asyncErrorHandler(getReset) );
//  (req, res, next) => {
//   res.send('GET /reset-pw/:token');
// });

/* PUT /reset-pw/:token */
router.put('/reset/:token', asyncErrorHandler(putReset) );
// (req, res, next) => {
//   res.send('PUT /reset-pw/:token');
// });

module.exports = router;
