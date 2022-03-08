const express = require('express');
const router = express.Router( { mergeParams: true });
const {asyncErrorHandler, isReviewAuthor } = require('../middleware');
const {
    reviewCreate,
    reviewUpdate,
    // ReviewDestroy,
    reviewDestroy
} = require ('../controllers/reviews');


/* reviews reviewss create /post/:id/reviews */
router.post('/', asyncErrorHandler(reviewCreate) );


/* PUT reviewss update post/:id/reviews/:review_id */
router.put('/:review_id', isReviewAuthor, asyncErrorHandler(reviewUpdate));
// (req, res, next) => {
//     res.send('UPDATE /post/:id/reviews/:review_id');
// });

/* DELETE reviewss destroy post/:id/reviews/:review_id */
 router.delete('/:review_id', isReviewAuthor, asyncErrorHandler(reviewDestroy));
// (req, res, next) => {
//     res.send('DELETE /post/:id/reviews/:review_id');
// });

  module.exports = router;