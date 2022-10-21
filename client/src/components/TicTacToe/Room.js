import React, { useEffect, useState } from "react";
import { PieChart } from 'react-minimal-pie-chart';
import GameChat from './GameChat'
import styles from './Room.module.css'

function Room({ startGame, socket }) {
    const [countdown, setCountdown] = useState(30);
    const [host, setHost] = useState('Host');
    const [highlight, setHighlight] = useState('Waiting for more players')
    const [players, setPlayers] = useState();
    const [id, setIDs] = useState();
    const [maxPlayers, setMaxPlayers] = useState(0);
    const url = "http://153.92.214.195:8082/";

    useEffect(() => {
        socket.on('room update', () => {
            socket.emit('get room details');
        })

        socket.on('room details', (room) => {
            setPlayers(room.playernames);
            setIDs(room.playerid);
            setMaxPlayers(room.maxPlayers);
            setHost(room.playernames[0]);
            setMaxPlayers(room.maxPlayers);
            showPlayers(room.playernames, room.playerid, room.players.length)
        })

        socket.on('time left', (seconds) => {
            setHighlight(`Game starting in ${seconds} seconds`)
            setCountdown(seconds);
        })

        socket.on('reset timer', () => {
            setHighlight('Waiting for more players')
            setCountdown(30);
        })

        socket.on('start game', () => {
            startGame(true)
        })

        socket.on('disconnect', ()=>{
            window.location.reload();
        })
    }, [])

    function showPlayers(players, ids, numPlayers) {
        var playerpanel = document.getElementById('players');
        playerpanel.innerHTML = '';
        for (var i = 0; i < numPlayers; i++) {
            var player = document.createElement('div');
            var name = document.createElement('h5');
            var img = document.createElement('img');
            name.textContent = players[i];
            img.src = url + ids[i] + ".png";
            player.appendChild(img);
            player.appendChild(name);
            player.style.width = '50%';
            player.style.height = '100%';
            player.style.float = 'left';
            img.style.display = 'block';
            img.style.marginLeft = 'auto';
            img.style.marginRight = 'auto';
            img.style.width = '25%'
            img.style.paddingTop = "30%"
            name.style.textAlign = 'center';
            playerpanel.appendChild(player);
        }
    }

    return (
        <div className={styles.Room}>
            <div className={styles.left}>
                <div className={styles.toppanel}>
                    <div className="timer" style={{ float: 'left', height: '100%' }}>
                        <PieChart
                            data={[
                                { value: countdown, color: '#C13C37' }
                            ]}
                            totalValue={30}
                            startAngle={270}
                            lengthAngle={-360}
                            radius={40}
                            lineWidth={5}
                            label={({ dataEntry }) => dataEntry.value}
                            labelPosition={0}
                            background={'white'}
                        />
                    </div>
                    <div>
                        <h3>{highlight}</h3>
                        <h4>Host: {host}</h4>
                    </div>
                </div>
                <div id="players" className={styles.players}>
                </div>
            </div>
        </div>
    )
}

export default Room;