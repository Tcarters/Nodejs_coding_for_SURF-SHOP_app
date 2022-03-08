const faker = require('faker');
const cities = require('./cities');
const Post = require('./models/post');

async function seedPosts() {
	// await Post.remove({});
	await Post.deleteMany({});
	for(const i of new Array(600)) {
		const random1000 = Math.floor(Math.random() * 1000);
		const random5 = Math.floor(Math.random() * 6);
		const title = faker.lorem.word();
		const description = faker.lorem.text();
		const postData = {
			title,
			description,
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			geometry: {
				type: 'Point',
				coordinates: [cities[random1000].longitude, cities[random1000].latitude],
			},
			price: random1000,
			avgRating: random5,
			author: '62041d6912bd966267fe5823',
			images: [
				{
					url: 'https://images.pexels.com/photos/708932/pexels-photo-708932.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
				}
			] //{
		//     '_id' : '62041d6912bd966267fe5823',
		//     'username' : 'ed3'
		//   }
		}
		let post = new Post(postData);
		post.properties.description = `<strong><a href="/post/${post._id}">${title}</a></strong><p>${post.location}</p><p>${description.substring(0, 20)}...</p>`;
		post.save();
	}
	console.log('600 new posts created');
}

module.exports = seedPosts;

// async function seedPosts() {
//     await Post.remove({ });
//     for ( const i of new Array(40)) {
//         const post = {
//             title: faker.lorem.word(),
//             description: faker.lorem.text(),
//             coordinates: [-122.0842499, 37.4224764],
//             author: {
//                 '_id' : '61fc207f4e0fcd9639735ef6',
//                 'username' : 'ed'
//           }
//         }
//         await Post.create(post);
//     }
//     console.log('40 new posts created');
// }

// module.exports = seedPosts;