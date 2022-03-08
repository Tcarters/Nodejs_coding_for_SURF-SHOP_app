const mongoose = require('mongoose');
//const mongooseUniqueValidator = require('mongoose-unique-validator');
//const uniqueValidator = require('mongoose-unique-validator');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema( {
    email: { type: String, unique: true, required: true },
    image: {
        secure_url: { type: String, default: '/images/default-profile.jpg' },
	    public_id: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
    // posts: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Post'
    //     }
    // ]
});
UserSchema.plugin(passportLocalMongoose);
//UserSchema.plugin(mongooseUniqueValidator); //, { message: 'A user with the given email is already registred'});


module.exports = mongoose.model('User', UserSchema);
