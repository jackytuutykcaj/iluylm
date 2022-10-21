const express = require('express')();
const app = require('http').createServer(express);
const io = require('socket.io')(app);
const { insert, update, query, remove, removeAll } = require("./lib.js");
const game = require('./game.js')

var roomID = []
var rooms = []

io.on('connection', (socket) => {
    socket.on('playNow', (minPlayers, maxPlayers, username) => {
        query('rooms', { full: false })
            .then(room => {
                if (room != null) {
                    query('account', { username: username })
                        .then(id => {
                            update('rooms', { host: room.host }, { $push: { players: socket.id, playerid: id._id.toString(), playernames: username } })
                                .then(result => {
                                    if (result != null) {
                                        socket.join(result.value._id.toString());
                                        io.to(result.value._id.toString()).emit('room update', result.value);
                                        const index = roomID.indexOf(result.value._id.toString());
                                        rooms[index].players = result.value.players;
                                        rooms[index].playerid = result.value.playerid;
                                        rooms[index].playernames = result.value.playernames;
                                    }
                                })
                        })
                } else {
                    query('account', { username: username })
                        .then(result => {
                            insert('rooms', { host: result._id.toString(), minPlayers: minPlayers, maxPlayers: maxPlayers, players: [socket.id], playerid: [result._id.toString()], playernames: [username], full: false })
                                .then(result => {
                                    socket.join(result.insertedId.toString());
                                    io.to(socket.id).emit('room update');
                                    roomID.push(result.insertedId.toString())
                                    rooms.push(new game(result.insertedId.toString(), socket.id, minPlayers, maxPlayers, [socket.id], [result._id], [username], false, io))
                                })
                        })
                }
            })
    })

    socket.on('createRoom', (minPlayers, maxPlayers, username) => {
        query('account', { username: username })
            .then(result => {
                insert('rooms', { host: result._id.toString(), minPlayers: minPlayers, maxPlayers: maxPlayers, players: [socket.id], playerid: [result._id.toString()], playernames: [username], full: false })
                    .then(result => {
                        socket.join(result.insertedId.toString());
                        io.to(socket.id).emit('room update');
                        roomID.push(result.insertedId.toString())
                        rooms.push(new game(result.insertedId.toString(), socket.id, minPlayers, maxPlayers, [socket.id], [result._id], [username], false, io))
                    })
            })
    })

    socket.on('get room details', () => {
        query('rooms', { players: socket.id })
            .then(result => {
                if (result.players.length == result.maxPlayers) {
                    update('rooms', { players: socket.id }, { $set: { full: true } })
                        .then(result => {
                            io.to(result.value._id.toString()).emit('room details', result.value);
                            const index = roomID.indexOf(result.value._id.toString());
                            rooms[index].full = true;
                            rooms[index].startTimer();
                        })
                } else {
                    io.to(result._id.toString()).emit('room details', result);
                }
            })
    })

    socket.on('click', (area) => {
        query('rooms', { players: socket.id })
            .then(result => {
                if (result != null) {
                    const index = result.players.indexOf(socket.id);
                    if (index == 0) {
                        rooms[roomID.indexOf(result._id.toString())].updateBoard(area, 'x', index)
                    } else {
                        rooms[roomID.indexOf(result._id.toString())].updateBoard(area, 'o', index)
                    }
                }
            })
    })

    socket.on('send-message', (msg) => {
        query('rooms', { players: socket.id })
            .then(result => {
                if (result != null) {
                    io.to(result._id.toString()).emit('chatmessage', msg, result.playernames[result.players.indexOf(socket.id)])
                }
            })
    })

    socket.on('disconnect', () => {
        query('rooms', { players: socket.id })
            .then(result => {
                if (result != null) {
                    const index = result.players.indexOf(socket.id);
                    update('rooms', { players: socket.id }, { $pull: { players: socket.id, playerid: result.playerid[index], playernames: result.playernames[index] }, $set: { full: false } })
                        .then(result => {
                            const index = roomID.indexOf(result.value._id.toString());
                            rooms[index].players = result.value.players;
                            rooms[index].playerid = result.value.playerid;
                            rooms[index].playernames = result.value.playernames;
                            rooms[index].full = false;
                            if (result.value.playernames.length == 0) {
                                remove('rooms', { host: result.value.host });
                                rooms[index].stopTimer();
                                rooms.splice(index, 1);
                                roomID.splice(index, 1);
                            } else {
                                update('rooms', { host: result.value.host }, { $set: { host: result.value.playerid[0] } })
                                    .then(result => {
                                        if (result != null) {
                                            io.to(result.value._id.toString()).emit('room details', result.value);
                                            if (rooms.length > 0) {
                                                rooms[index].stopTimer();
                                                rooms[index].host = rooms[index].playerid[0];
                                                roomID[index] = result.value._id.toString();
                                            }
                                        }
                                    })
                            }
                        })
                }
            })
    })
})

app.listen(8083, () => {
    console.log('TicTacToe server is running and listening on port 8083');
})