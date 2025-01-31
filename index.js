const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m3whnjn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const spotAll = client.db('spotDB').collection('spot');
    const countryCollection = client.db('countryDB').collection('country');

    app.get('/spot', async(req,res) =>{
        const cursor = spotAll.find();
        const result =await cursor.toArray();
        res.send(result);
    })

    app.post('/spot', async(req,res) =>{
        const newSpot = req.body;
        console.log(newSpot);
        const result = await spotAll.insertOne(newSpot);
        res.send(result);
    })


    app.get('/myList/:email', async(req,res) =>{
      console.log(req.params.email);
      const result = await spotAll.find({email:req.params.email}).toArray();
      res.send(result)
    })


    app.get('/spot/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await spotAll.findOne(query);
      res.send(result);
    })


    app.put('/spot/:id', async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert:true};
      const updatedSpot = req.body;
      const spot = {
        $set:{
          name: updatedSpot.name,
           tourist_spot_name: updatedSpot.tourist_spot_name,
           country_name: updatedSpot.country_name,
           location: updatedSpot.location,
           description: updatedSpot.description,
           cost: updatedSpot.cost,
           seasonality: updatedSpot.seasonality,
           travel_time: updatedSpot.travel_time,
           total: updatedSpot.total,
           email: updatedSpot.email,
           photo:  updatedSpot.photo
        }
      }
      const result = await spotAll.updateOne(filter,spot,options);
      res.send(result)

    })

    app.delete('/spot/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await spotAll.deleteOne(query);
      res.send(result);

    })


    app.get('/country', async(req,res) =>{
      const cursor = countryCollection.find();
      const result =await cursor.toArray();
      res.send(result);

    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Tourism server is running')
})

app.listen(port,() => {
    console.log(`Tourism is running on:${port}`)
})