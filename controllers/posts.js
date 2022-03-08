const Post = require('../models/post');
const User =  require('../models/user');
const  mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');
// const cloudinary = require('cloudinary');
// cloudinary.config({
//     cloud_name: 'xxxxxxxxxxxxxx',
//     api_key: 'xxxxxxxxxxxxxx',
//     api_secret: process.env.CLOUDINARY_SECRET
// });

module.exports = {
    // Posts Index
    async postIndex (req, res, next) {
        const { dbQuery } = res.locals;

        delete res.locals.dbQuery;

        let posts = await Post.paginate(dbQuery, {
            page: req.query.page || 1,
            limit: 10, 
            sort: '-_id'
        } ); // changing find by paginate\
        posts.page = Number(posts.page);
        if ( !posts.docs.length && res.locals.query ) {
            res.locals.error = 'NO results match that query.';

        }
        res.render('posts/index', { 
            posts, 
            mapBoxToken , //: process.env.MAPBOX_TOKEN,
            title: 'Posts Index'
        }); //calling main post from app.js
    },
    // Posts new
    postNew(req, res, next) {
        res.render('posts/new'); // new posts from views directmapBoxToken: process.env.MAPBOX_TOKENory
    },
    // Posts Create
    async postCreate(req, res, next) {
        req.body.post.images = [];
        for ( const file of req.files) {
            // let image = await cloudinary.v2.uploader.upload(file.path);
            req.body.post.images.push({
                url: file.secure_url,
                public_id: file.public_id
            });
        }
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
        // req.body.post.coordinates = response.body.features[0].geometry.coordinates;
        req.body.post.geometry = response.body.features[0].geometry;
        req.body.post.author = req.user._id;
        // let post = await Post.create(req.body.post);// use req.body to create a new Post
        let post = new Post(req.body.post);
		post.properties.description = `<strong><a href="/post/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
		await post.save();
        req.session.success = 'Post created successfully!';
        res.redirect(`/post/${post.id}`); // main post created in app.js
    },
    // Posts Show
    async postShow(req, res, next) {
        // throw new Error('This is a big bad error! ');
        // let currentUser = req.user; // not done in lecture
        let post = await Post.findById(req.params.id).populate({
            path: 'reviews',
            options: { sort: { '_id': -1 } },
            populate: {  // nested populated
                path: 'author',
                model: 'User'
            }
         });
        // const floorRating = post.calculateAvgRating();
        //  console.log(currentUser);
        // let mapBoxToken = process.env.MAPBOX_TOKEN; // not done it in lecture
        // res.render('posts/show', { post, currentUser, floorRating, mapBoxToken } ); // refer post in view
        const floorRating = post.avgRating;
        res.render('posts/show', { post, floorRating, mapBoxToken } ); // refer post in view
    },
    // Edit Posts
    //async 
    postEdit(req, res, next) {
        // let post = await Post.findById(req.params.id);
        res.render('posts/edit'); //, { post });
    },
    // Post Update
    async postUpdate(req, res, next) {
        // find the post by id
    //    let post = await Post.findById(req.params.id);
        const { post } = res.locals; // distructure post from res.locals
        // check if there's any images for deletion
       if (req.body.deleteImages && req.body.deleteImages.length) {
           // assign deleteImages from req.body to its own variable
        let deleteImages = req.body.deleteImages;
        // loop over deleteImages
        for(const public_id of deleteImages) {
            // delete images from cloudinary
            await cloudinary.v2.uploader.destroy(public_id);
            // delete image from post.images
            for(const image of post.images) {
                if ( image.public_id === public_id) {
                    let index = post.images.indexOf(image);
                    post.images.splice(index, 1);
                }
            }
        }
    }
    // check if there are any new images for upload
    if ( req.files) {
        for ( const file of req.files) {
            // let image = await cloudinary.v2.uploader.upload(file.path);
            // add images to post.images array
            post.images.push({
                url: file.secure_url,
                public_id: file.public_id
            });
        }
    }
    // check if location was updated
    if (req.body.post.location !== post.location){
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
            // post.coordinates = response.body.features[0].geometry.coordinates;
            post.geometry = response.body.features[0].geometry;
            post.location = req.body.post.location;
    }
    
    // update the post with new any new properties
    post.title = req.body.post.title;
    post.decription = req.body.post.description;
    post.price = req.body.post.price;
    post.properties.description = `<strong><a href="/post/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
    // save the updated post into the db
    await post.save();
    // redirect to the show page
    res.redirect(`/post/${post.id}`); 
    },
    // Post Destroy 
    async postDestroy (req, res, next) {
        // let post = await Post.findById(req.params.id);
        const { post } = res.locals;
        for ( const image of post.images ) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await post.remove();
        req.session.success = 'Post deleted successfully!';
        res.redirect('/post');
    }
}
