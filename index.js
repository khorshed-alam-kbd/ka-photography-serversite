const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0zdruwc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const serviceCollection = client.db('kaPhotography').collection('services');
        const reviewCollection = client.db('kaPhotography').collection('reviews');

        // services api
        app.get('/services', async (req, res) => {
            const quarry = {}
            const cursor = serviceCollection.find(quarry)
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services/3', async (req, res) => {
            const quarry = {}
            const cursor = serviceCollection.find(quarry).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const quarry = { _id: ObjectId(id) };
            const services = await serviceCollection.findOne(quarry);
            res.send(services);
        })

        //review api
        app.get('/reviews', async (req, res) => {
            let quarry = {}
            if (req.query.email) {
                quarry = {
                    userEmail: req.query.email
                }
            }
            if (req.query.id) {
                quarry = {
                    service: req.query.id
                }
            }
            const cursor = reviewCollection.find(quarry);
            const reviews = await cursor.toArray();
            res.send(reviews);

        })
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const quarry = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(quarry);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(error => console.error(error));


app.get('/', (req, res) => {
    res.send('ka photography server is running')
});

app.listen(port, () => {
    console.log(`ka photography server running on ${port}`);
})

