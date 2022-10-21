const { MongoClient } = require('mongodb');
const url = "mongodb+srv://iluylm:Bundleofjoy1!@iluylm.9njj5.mongodb.net/";
const client = new MongoClient(url, { useNewUrlParser: true });
client.connect(err => {
    if (err) {
        console.log("error");
    } else {
        console.log("Connected to database");
        removeAll('rooms', {})
    }
})

module.exports.insert = async function(collectionName, query) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(query);
    return result;
}

module.exports.update = async function(collectionName, query, field) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.findOneAndUpdate(query, field, {returnDocument: "after"});
    return result;
}

module.exports.query = async function(collectionName, query) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.findOne(query);
    return result;
}

module.exports.remove = async function(collectionName, query) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.deleteOne(query);
    return result;
}

module.exports.removeAll = async function(collectionName, query) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.deleteMany(query);
    return result;
}

//This async function querys the database
module.exports.queryAll = async function(collectionName, query, projection, res) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.find(query, projection).toArray(function (err, result) {
        res.send(result);
    });
}

async function removeAll(collectionName, query) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.deleteMany(query);
    return result;
}
