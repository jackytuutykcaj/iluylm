var express = require('express');
var cors = require('cors');
const bp = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
var app = express();
var path = require('path');
var fs = require('fs');

var dir = path.join(__dirname, 'images')

app.use(cors());
app.use(express.static(dir));
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json());

const url = "mongodb+srv://iluylm:Bundleofjoy1!@iluylm.9njj5.mongodb.net/";

const client = new MongoClient(url, { useNewUrlParser: true });

//This connects to the Mongo database and tests if the connection is successful.
client.connect(err => {
    if (err) {
        console.log("error");
    } else {
        console.log("Connected to database");
    }
})

//This async function updates the database
async function update(collectionName, query, field) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.findOneAndUpdate(query, field, {returnDocument: "after"});
    return result;
}

//This async function querys the database
async function query(collectionName, query) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.findOne(query);
    return result;
}

//This async function querys the database
async function queryAll(collectionName, query, projection, res) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.find(query, projection).toArray(function (err, result) {
        res.send(result);
    });
}

//This async function inserts into the database
async function insert(collectionName, query) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(query);
    return result;
}

app.use('/setbio', (req, res) => {
    update('bio', { uid: req.body.uid }, { $set: { bio: req.body.contents } })
        .then(result => {
            res.send(result);
        })
})

app.use('/getbio', (req, res) => {
    query('bio', { uid: req.body._id })
        .then(result => {
            if (result == null) {
                var bio = `Hi. I'm new here.`;
                insert('bio', { uid: req.body._id, bio: bio });
                res.send({
                    bio: bio
                })
            } else {
                res.send({
                    bio: result.bio
                })
            }
        })
})

app.use('/createpost', (req, res) => {
    insert('posts', { uid: req.body.uid, post: req.body.postvalue, date: req.body.date });
})

app.use('/getposts', (req, res) => {
    queryAll('posts', { uid: req.body._id }, { projection: { post: 1, date: 1 } }, res);
})

app.use('/uploadimage', (req, res) => {
    query('account', { username: req.body.username }).then((result) => {
        var dataurl = req.body.dataurl;
        var regex = /^data:.+\/(.+);base64,(.*)$/;
        var matches = dataurl.match(regex);
        var ext = matches[1];
        var data = matches[2];
        var buffer = Buffer.from(data, 'base64');
        fs.writeFileSync(`images/${result._id}.` + ext, buffer);
        res.send({
            msg: 'success'
        })
    })
})

app.use('/getimage', (req, res) =>{
    query('account', { username: req.body.username }).then((result) =>{
        const path = `images/${result._id}.png`;
        try{
            if(fs.existsSync(path)){
                res.send({
                    exists: true,
                    name: result._id
                })
            }
        }catch(err){
            console.log('user has no profile pic');
        }
    })
})

app.listen(8082, function () {
    console.log("Data server starting and listening on port 8082")
})