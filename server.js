const express=require('express');
const cors=require('cors');
require('dotenv').config()
const app=express();
const port=process.env.port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// craftDB
// 7FbQXeDHOfQHO4zb

// middleware
app.use(cors());
app.use(express.json())







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v1zto12.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const craftCollection = client.db("craftDB");
    const craft = craftCollection.collection("craft");
    

    app.get('/addCraft',async(req,res)=>{
      const cursor=craft.find();
      const result=await cursor.toArray();
      res.send(result)
    })

    // app.get('/showCraft',async(req,res)=>{
    //   const cursor=craftCategory.find();
    //   const result=await cursor.toArray();
    //   res.send(result)
    // })


    app.get('/showCraft', async (req, res) => {
      try {
          const craftCategoryCollection = client.db("craftDB").collection("craftCategory");
          const cursor = craftCategoryCollection.find();
          const result = await cursor.toArray();
          res.send(result);
      } catch (error) {
          console.error('Error fetching craft items:', error);
          res.status(500).send({ error: 'An error occurred while fetching craft items' });
      }
  });


    app.get('/addCraft/:id', async (req, res) => {
      try {
          const id = req.params.id;
          const query = {_id: new ObjectId(id) };
          const result = await craft.findOne(query);
          res.send(result);
      } catch (error) {
          console.error('Error fetching craft items:', error);
          res.status(500).send({ error: 'An error occurred while fetching craft items' });
      }
  });
    


    app.post('/addCraft',async(req,res)=>{
        const newAddCraft=req.body;
        console.log(newAddCraft)
        const result = await craft.insertOne(newAddCraft);
        res.send(result);
        
    })

    app.delete('/addCraft/:id',async(req,res)=>{
      const id=req.params.id;
      console.log("delete",id);
      const query={_id:new ObjectId(id)}
      const result=await craft.deleteOne(query)
      res.send(result)
    }
  )

    app.put('/addCraft/:id',async(req,res)=>{
      const id=req.params.id;
      const user=req.body;
      console.log(user)
      const filter={_id:new ObjectId(id)}
      const options={upsert:true}
      const updatedUser={
        $set:{
          image:user.image,
          itemName:user.itemName,
          subcategoryName:user.subcategoryName,
          shortDescription:user.shortDescription,
          price:user.price,
          rating:user.rating,
          customization:user.customization,
          processingTime:user.processingTime,
          stockStatus:user.stockStatus
         
        }
      }
      const result=await craft.updateOne(filter,updatedUser,options)
      res.send(result)
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




app.get('/',(req,res)=>{
    res.send('crud is running')
})

app.listen(port,()=>{
    console.log(`crud is running on port ${port}`)
})