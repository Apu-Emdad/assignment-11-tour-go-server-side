
const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://tour_bee_admin:Tx289Udon6OPq8pu@cluster0.1ikru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("tour_bee");
    const serviceCollection = database.collection("services");
    const orderCollection = database.collection("orders");
    const expertCollction = database.collection("experts");
    app.get("/services", async (req, res) => {
      const query = serviceCollection.find({});
      const services = await query.toArray();
      res.send(services);
    });
    app.get("/orders", async (req, res) => {
      const query = orderCollection.find({});
      const services = await query.toArray();
      res.send(services);
    });
    app.get("/experts", async (req, res) => {
      const query = expertCollction.find({});
      const services = await query.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(filter);
      res.send(service);
    });
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const service = await orderCollection.findOne(filter);
      res.send(service);
    });

    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("services got hit", service);

      const result = await serviceCollection.insertOne(service);
      // console.log(result);
      res.json(result);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      console.log(req.body);
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });

    //status update
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updatedStatus = req.body;
      const option = { upsert: true };
      console.log(updatedStatus);

      const updateDoc = {
        $set: {
          status: updatedStatus.status,
        },
      };
      const result = await orderCollection.updateOne(filter, updateDoc, option);
      res.json(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(filter);
      res.json(result);
    });
  } finally {
    // client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("this is tour bee");
});

app.listen(port, () => {
  console.log("listening from port", port);
});
