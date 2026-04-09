const mongoose = require('mongoose');
const app = require('./app');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const server = async () => {
	try {
		const client = new MongoClient('mongodb://localhost:27017/SBR');

		const db = client.db('project4');

		const productCollection = db.collection('products');
		const teamMembersCollection = db.collection('teamMembers');

		app.get('/products', async (req, res) => {
			try {
				const data = await productCollection.find().toArray();

				res.send(data);
			} catch (error) {
				console.log(error);
			}
		});
		app.get('/products/:id', async (req, res) => {
			try {
				const id = req.params.id;

				const data = await productCollection.findOne({
					_id: new ObjectId(id)
				});

				res.send(data);
			} catch (error) {
				console.log(error);
			}
		});
		app.put('/products/:id', async (req, res) => {
			try {
				const id = req.params.id;

				console.log('BODY:', req.body);

				const { title, description } = req.body;

				//  Prevent null / undefined overwrite
				const updateDoc = {};

				if (title !== undefined && title !== null) {
					updateDoc['section.title'] = title;
				}

				if (description !== undefined && description !== null) {
					updateDoc['section.description'] = description;
				}

				const result = await productCollection.updateOne(
					{ _id: new ObjectId(id) },
					{ $set: updateDoc }
				);

				res.send(result);
			} catch (err) {
				res.status(500).send(err.message);
			}
		});
		app.post('/products', async (req, res) => {
			try {
				const productData = req.body;
				console.log(productData);
				const products = await productCollection.insertOne(productData);
				res.send(products);
			} catch (error) {
				console.log(error);
			}
		});

		app.get('/team-members', async (req, res) => {
			try {
				const id = req.params.id;

				const data = await teamMembersCollection.find().toArray();

				res.send(data);
			} catch (error) {
				console.log(error);
			}
		});
		app.get('/team-members/:id', async (req, res) => {
			try {
				const id = req.params.id;

				const data = await teamMembersCollection.findOne({
					_id: new ObjectId(id)
				});

				res.send(data);
			} catch (error) {
				console.log(error);
			}
		});
		app.post('/team-members', async (req, res) => {
			try {
				const teamMembersData = req.body;
				console.log(teamMembersData);
				const teamMembers = await teamMembersCollection.insertOne(
					teamMembersData
				);
				res.send(teamMembers);
			} catch (error) {
				console.log(error);
			}
		});
		app.listen(process.env.PORT, () => {
			console.log(`Server running on port ${process.env.PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};
server();
