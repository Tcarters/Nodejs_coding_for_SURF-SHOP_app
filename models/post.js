const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const Review = require('../models/review');
const mongoosePaginate = require('mongoose-paginate');
const review = require('../models/review');


const PostSchema = new Schema( {
    title: String,
    price: Number,
    description: String,
    images: [ { url: String, public_id: String } ],
    // if error use this -> images: - { path: String, filename: String } ],
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    properties: {
        description: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            // type: mongoose.Schema.Types.ObjectId,
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    avgRating: { type: Number, default: 0 }
});
PostSchema.pre('remove' , async function() {
        await Review.remove({
            _id: {
                $in: this.reviews
            }
        });
});

PostSchema.methods.calculateAvgRating = function() {
    let ratingsTotal = 0;
    if ( this.reviews.length) {
        this.reviews.forEach(review => {
            ratingsTotal += review.rating;
        });
        this.avgRating = Math.round( (ratingsTotal / this.reviews.length) * 10 ) / 10;
    } else {
        this.avgRating = ratingsTotal;
    }
   
    const floorRating = Math.floor(this.avgRating);
    this.save();
    return floorRating;
}
// PostSchema.plugin(passportLocalMongoose);
PostSchema.plugin(mongoosePaginate);

PostSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('Post', PostSchema);
