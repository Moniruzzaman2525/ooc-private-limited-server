const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const bcrypt = require('bcrypt');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y4mhh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("Deskala");
        const userCollection = db.collection("users");
        const candidateCollection = db.collection("candidate");

        // API to Run Server 
        app.get("/", async (req, res) => {
            res.send("Server is Running");
        });

        // API to Get All Users
        app.get("/users", async (req, res) => {
            const users = await userCollection.find({}).toArray();
            res.send(users);
        }
        );
        // API to Get All Users
        app.get("/users", async (req, res) => {
            const users = await userCollection.find({}).toArray();
            res.send(users);
        }
        );

        // API to get all candidate
        app.get("/candidates", async (req, res) => {
            const candidates = await candidateCollection.find({}).toArray();
            res.send(candidates)
        })

        // API to update a candidate with id
        app.put("/candidates/:id", async (req, res) => {
            const id = req.params.id;
            const candidate = req.body;
            // console.log(candidate, id);
            const result = await candidateCollection.updateOne({ _id: ObjectId(id) }, { $set: candidate });
            res.send(result);
        }
        );

        // API to delete a candidate with id
        app.delete("/candidates/:id", async (req, res) => {
            const id = req.params.id;
            await candidateCollection.deleteOne({ _id: ObjectId(id) });
            res.send("Candidate Deleted");
        }
        );

    }
    finally {
        // client.close(); 
    }
}

run().catch(console.dir);

app.listen(port, () => console.log(`Listening on port ${port}`));