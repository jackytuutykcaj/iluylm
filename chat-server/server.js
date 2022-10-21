/*
TODO:
- Save color name
- auto scroll to bottom
- profanity check
- start using the database as a way of tracking online people instead of array
*/
const express = require('express')();
const app = require('http').createServer(express);
const io = require('socket.io')(app);
const { MongoClient } = require('mongodb');
const today = new Date();

const url = "mongodb+srv://iluylm:Bundleofjoy1!@iluylm.9njj5.mongodb.net/";

const client = new MongoClient(url, { useNewUrlParser: true });

var online = [];
var socketid = [];

//This connects to the Mongo database and tests if the connection is successful.
client.connect(err => {
    if (err) {
        console.log("error");
    } else {
        console.log("Connected to database");
    }
})

//This async function inserts into the database
async function insert(collectionName, query) {
    const database = client.db("iluylm");
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(query);
    return result;
}

//Event handlers for socket.io
io.on('connection', (socket) => {
    //The username and socket id is pushed to the array
    socket.on('send-name', (name) => {
        online.push(name);
        socketid.push(socket.id);
        //Emit the online array to everyone to update the online list on client side
        io.emit('userlist', online);
    })
    //The message is recieved from the client and is emitted to everyone with the message and the color
    socket.on('send-message', (user, msg, color) => {
        if (msg.trim().length != 0) {
            io.emit('chat-message', user, msg, color);
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            //The message is logged by inserting it to the database with the user and timestamp
            insert('messages', { user: user, message: msg, date: date, time: time });
        }
    })
    //When a user is diconnected from the server
    socket.on('disconnect', () => {
        socket.disconnect();
        //Find index of the disconnected socket id and use it to remove the socket id and user from the array
        const id = element => element == socket.id;
        const index = socketid.findIndex(id);
        socketid.splice(index, 1);
        online.splice(index, 1);
        //Emit the online array to everyone to update the online list on client side
        io.emit('userlist', online);
    })
})

app.listen(8081, () => {
    console.log('Chat server is running and listening on port 8081');
})