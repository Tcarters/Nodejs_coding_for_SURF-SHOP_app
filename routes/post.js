const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer( { storage }); //{'dest': 'uploads/'});
const { asyncErrorHandler,
        isLoggedIn,
        isAuthor,
        searchAndFilterPosts
    } = require('../middleware');
const { 
    postIndex, 
    postNew, 
    postCreate,
    postShow,
    postEdit,
    postUpdate,
    postDestroy

 } = require ('../controllers/posts');



/* GET post index /post.  */
router.get('/', asyncErrorHandler(searchAndFilterPosts), asyncErrorHandler(postIndex) );  // (req, res, next) => {
    // res.render('index', { title: 'Surf Shop - Home' });
//     res.send('INDEX /post');
// });
  
/* GET post new /post/new */
router.get('/new', isLoggedIn,  postNew);  //(req, res, next) => {
//     res.send('NEW /post/new');
// });

/* POST posts create /post */
router.post('/', isLoggedIn, upload.array('images', 4), asyncErrorHandler(postCreate)); // (req, res, next) => {
//     res.send('CREATE /post');
// });

/* GET posts show /post/:id */
router.get('/:id', asyncErrorHandler(postShow) ); //(req, res, next) => {
//     res.send('SHOW /post/:id');
// });

/* GET posts edit /posts/:id/edit  */
router.get('/:id/edit',isLoggedIn, asyncErrorHandler(isAuthor), postEdit); //asyncErrorHandler(postEdit) );  //(req, res, next) => {
//     res.send('EDIT /post/:id/edit');
// });

/* PUT posts update /post/:id */
router.put('/:id', isLoggedIn, asyncErrorHandler(isAuthor), upload.array('images', 4), asyncErrorHandler(postUpdate)); //(req, res, next) => {
//     res.send('UPDATE /post/:id');
// });

/* DELETE posts destroy /post/:id */
router.delete('/:id', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(postDestroy)); //(req, res, next) => {
//     res.send('DELETE /post/:id');
// });

  module.exports = router;