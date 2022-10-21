//Template for game(lobby and waiting room not the actual game)
import React, { useEffect, useState } from "react";
import Game from "../TicTacToe/Game";
import styles from './TicTacToe.module.css'
import Lobby from "./Lobby";
import Room from "./Room";
import GameChat from "./GameChat";

function TicTacToe({ io, token }) {
    const [username, setUsername] = useState('');
    const [lobbyComponent, showLobby] = useState(true);
    const [roomComponent, showRoom] = useState(false);
    const [gameComponent, showGame] = useState(false);
    const [minPlayers] = useState(2);
    const [maxPlayers] = useState(2);
    const [XorO, setXorO] = useState()
    const [socket] = useState(() => createCon('http://153.92.214.195:8083'))

    useEffect(()=>{
        fetchData('http://153.92.214.195:8080/getprofile', { token }) 
            .then(data => {
                if (data.err) {
                    window.localStorage.removeItem('token');
                    return false;
                } else {
                    setUsername(data.username);
                }
            })
            socket.on('go to room', ()=>{
                goToRoom();
                socket.emit('get room details')
            })
    }, [])

    function createCon(url) {
        const socket = io(url, { transports: ['websocket'] });
        return socket;
    }

    const playNow = () =>{
        socket.emit('playNow', minPlayers, maxPlayers, username);
        showLobby(false);
        showRoom(true);
    }
    
    const createRoom = () =>{
        socket.emit('createRoom', minPlayers, maxPlayers, username);
        showLobby(false);
        showRoom(true);
    }

    const startGame = () =>{
        showLobby(false);
        showRoom(false);
        showGame(true);
    }

    const goToRoom = () =>{
        showRoom(true)
        showGame(false)
    }

    async function fetchData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        return response.json()
    }

    return (
        <div className={styles.GameHome}>
            {(lobbyComponent) && <Lobby playNow={playNow} createRoom={createRoom}/>}
            {(roomComponent) && <Room startGame={startGame} socket={socket}/>}
            {(gameComponent) && <Game socket={socket}/>}
            {(gameComponent || roomComponent) && <GameChat socket={socket}/>}
        </div>
    )
}

export default TicTacToe;