/*
TODO:
- bcrypt password
- account attributes
    - last login
    - last active
    - banned
    - mutes
    - ban strikes
- account settings
*/
var express = require('express');
var cors = require('cors');
const jwt = require('jsonwebtoken')
const bp = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
var app = express();
require('dotenv').config();

app.use(cors());
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json());

const saltRounds = 10;

const url = process.env.MONGODB_URL;

const client = new MongoClient(url, { useNewUrlParser: true });

const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const secret = '';

//This connects to the Mongo database and tests if the connection is successful.
client.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to database");
        const database = client.db("iluylm");
        const collection = database.collection('accounts');
        collection.createIndex({"createdAt" : 1}, { expireAfterSeconds: 60});
    }
})

//This async function inserts into the database
async function insert(collectionName, query) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(query);
    return result;
}

//This async function querys the database
async function query(collectionName, query) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.findOne(query);
    return result;
}

//This async function updates the database
async function update(collectionName, query, field) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.updateOne(query, field);
    return result;
}

//This is for checking if the username and password is correct when logging in
app.use('/auth', (req, res) => {
    query("account", { email: req.body.email }).then(result => {
        if (result === null) {
            res.send({
                err: 'Email or password is incorrect'
            })
        } else {
            bcrypt.compare(req.body.password, result.password, (err, compare) => {
                if (compare == true) {
                    var token = jwt.sign({ _id: result._id }, process.env.SECRETKEY, { expiresIn: '14d' })
                    res.send({
                        token: token
                    })
                } else {
                    res.send({
                        err: 'Email or password is incorrect'
                    })
                }
            })
        }
    })
})

//This is for registering an account
app.use('/register', (req, res) => {
    if (req.body.email.match(mailFormat)) {
        //If email is taken send an error saying Email exists already
        query("account", { email: req.body.email }).then(result => {
            if (result) {
                //If the email is taken send an error that the email is taken
                res.send({
                    err: 'Email exists already'
                })
            } else {
                //If email is not taken check if Username is taken
                query("account", { username: req.body.username }).then(result => {
                    if (result) {
                        //If the username is taken send an error that the username is taken
                        res.send({
                            err: 'Username exists already'
                        })
                    } else {
                        if (req.body.username.length > 4 && req.body.username.length < 13) {
                            if (req.body.password.length > 7 && req.body.password.length < 15) {
                                //If username is not taken, insert the credentials into the database
                                //hash password with bcrypt
                                bcrypt.genSalt(saltRounds, (err, salt) => {
                                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                                        insert("account", { username: req.body.username, email: req.body.email, password: hash })
                                    })
                                })
                                //Create a token and send it back to the client
                                query('account', { email: req.body.email })
                                    .then((result) => {
                                        var token = jwt.sign({ _id: result._id }, process.env.SECRETKEY, { expiresIn: '1d' })
                                        res.send({
                                            token: token
                                        })
                                    })
                            } else {
                                res.send({
                                    err: 'Password must be between 8 to 14 characters long'
                                })
                            }
                        } else {
                            res.send({
                                err: 'Username must be between 5 to 12 characters long'
                            })
                        }
                    }
                })
            }
        })
    } else {
        res.send({
            err: 'Invalid Email'
        })
    }
})

//This is for getting profile details
app.use('/getprofile', (req, res) => {
    var token = req.body.token;
    //Verify if the token is legit
    jwt.verify(token, process.env.SECRETKEY, function (err, decoded) {
        //If the token is invalid send an error back to the client
        if (err) {
            console.log(err);
            res.send({
                err: true
            })
        } else {
            //If the token is valid, send whatever we need to send back to the client
            query('account', { _id: ObjectId(decoded._id) })
                .then(result => {
                    res.send({
                        username: result.username,
                        _id: result._id
                    })
                })
        }
    });
})

app.use('/getaccount', (req, res) => {
    var token = req.body.token;

    jwt.verify(token, process.env.SECRETKEY, function (err, decoded) {
        if (err) {
            res.send({
                err: true
            })
        } else {
            query('account', { _id: ObjectId(decoded._id) })
                .then(result => {
                    if (result != null) {
                        res.send({
                            username: result.username,
                            email: result.email
                        })
                    }
                })
        }
    })
})

app.use('/checkavailable', (req, res) => {
    query('account', { username: {'$regex': `^${req.body.username}$`, '$options': 'i'} })
        .then((result) => {
            if (result != null) {
                res.send({
                    msg: 'Username is taken',
                })
            } else {
                res.send({
                    msg: `Username is available`
                })
            }
        })
})

app.use('/updateaccount', (req, res) => {
    if (req.body.detail == 'username') {
        query('account', { username: {'$regex': `^${req.body.newUsername}$`, '$options': 'i'} })
        .then((result) =>{
            if(result != null){
                res.send({
                    msg: 'Username is taken',
                    fail: true
                })
            }else{
                if (req.body.newUsername.length > 4 && req.body.newUsername.length < 13) {
                    update('account', { username: req.body.oldUsername }, { $set: { username: req.body.newUsername } })
                        .then(() => {
                            query('account', { username: req.body.newUsername })
                                .then((result) => {
                                    var token = jwt.sign({ _id: result._id }, process.env.SECRETKEY, { expiresIn: '2d' })
                                    res.send({
                                        token: token,
                                        fail: false
                                    })
                                })
                        })
                }
            }
        })
    }
    if (req.body.detail == 'email') {
        if (req.body.newEmail.match(mailFormat)) {
            query('account', { email: {'$regex': `^${req.body.newEmail}$`, '$options': 'i'}})
                .then(result => {
                    if (result) {
                        res.send({
                            success: false,
                            msg: 'Email already used'
                        })
                    } else {
                        update('account', { email: req.body.oldEmail }, { $set: { email: req.body.newEmail } });
                        res.send({
                            success: true
                        })
                    }
                })
        } else {
            res.send({
                success: false,
                msg: 'Invalid email'
            })
        }
    }
})

app.use('/updatepassword', (req, res) => {
    query('account', { username: req.body.username })
        .then(result => {
            bcrypt.compare(req.body.currentPassword, result.password, (err, compare) => {
                if (compare == true) {
                    if (req.body.newPassword == req.body.confirmPassword) {
                        bcrypt.genSalt(saltRounds, (err, salt) => {
                            bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
                                update('account', { username: req.body.username }, { $set: { password: hash } })
                                    .then((result) => {
                                        res.send({
                                            success: true
                                        })
                                    })
                            })
                        })
                    } else {
                        res.send({
                            success: false,
                            msg: 'Passwords do not match'
                        })
                    }
                } else {
                    res.send({
                        success: false,
                        msg: 'Current password incorrect'
                    })
                }
            })
        })
})

app.use('/guesttoken', (req, res)=>{
    //generate random guest number as username
    var username = "guest" + Math.floor(Math.random() * 100000)
    //create temporary account with expiry date
    insert("account", { "createdAt" : new Date(), username: username})
    .then(result =>{
        var token = jwt.sign({ _id: result._id }, process.env.SECRETKEY, { expiresIn: '60s' })
        res.send({
            token: token
        })
    })
})

app.listen(8080, function () {
    console.log("Auth server starting and listening on port 8080")
})