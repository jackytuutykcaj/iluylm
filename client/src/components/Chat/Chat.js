import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './Chat.css';

Modal.setAppElement('#root')

const customStyle = {
    content: {
        top: '25%',
        bottom: '25%',
        left: '25%',
        right: '25%',
        borderRadius: '15px'
    }
}

function Chat({ io, token }) {
    const [chatsetting, chatsettingsopen] = useState(false);
    const [username, setUsername] = useState('');
    const [redValue, setRedValue] = useState(0);
    const [greenValue, setGreenValue] = useState(0);
    const [blueValue, setBlueValue] = useState(0);
    const [color, setColor] = useState('');
    const [socket] = useState(() => createCon('http://153.92.214.195:8081'))

    useEffect(() => {
        document.title = "ILUYLM - Chat"
        setColor(localStorage.getItem('name-color'));
        fetchData('http://153.92.214.195:8080/getprofile', { token }) 
            .then(data => {
                if (data.err) {
                    window.localStorage.removeItem('token');
                    return false;
                } else {
                    setUsername(data.username);
                    socket.emit('send-name', data.username);
                    socket.on('disconnect', () => {
                        socket.emit('send-name', data.username);
                    })
                }
            })

        socket.on('chat-message', (user, message, color) => {
            var item = document.createElement('li');
            var chatlog = document.getElementById('chatlog');
            var username = document.createElement('div');
            username.id = 'username';
            var msg = document.createElement('div');
            msg.id = 'message';
            username.textContent = user;
            username.style.color = color;
            msg.textContent = `: ${message}`;
            item.appendChild(username);
            item.appendChild(msg);
            chatlog.appendChild(item);
        })

        socket.on('userlist', (userlist) => {
            document.getElementById("online").innerHTML = "";
            userlist.map(user => {
                const node = document.createElement("li");
                const textnode = document.createTextNode(user);
                node.appendChild(textnode);
                document.getElementById("online").appendChild(node);
            })
        })

        socket.on('help',(msg)=>{
            var item = document.createElement('li');
            var chatlog = document.getElementById('chatlog');
            item.textContent = msg;
            chatlog.appendChild(item);
        })

        socket.io.on("error", (error) => {
            console.log(error);
        })
    }, [socket, token])

    function createCon(url) {
        const socket = io(url, { transports: ['websocket'] });
        return socket;
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

    function onEnterPress(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            var inputbox = document.getElementById('input-box');
            socket.emit('send-message', username, inputbox.value, color);
            inputbox.value = "";
        }
    }

    function openmodal(){
        setRedValue(localStorage.getItem('red'))
        setGreenValue(localStorage.getItem('green'))
        setBlueValue(localStorage.getItem('blue'))
        chatsettingsopen(true);
    }

    function closemodal() {
        chatsettingsopen(false);
    }

    function getColor(e){
        if(e.target.id === 'redSlider') setRedValue(e.target.value);
        if(e.target.id === 'blueSlider') setBlueValue(e.target.value);
        if(e.target.id === 'greenSlider') setGreenValue(e.target.value);
        setColor(`#${toHex(redValue)}${toHex(greenValue)}${toHex(blueValue)}`);
        document.getElementById('sampletext').style.color = color;
        localStorage.setItem('name-color', color);
        localStorage.setItem('red', redValue);
        localStorage.setItem('blue', blueValue);
        localStorage.setItem('green', greenValue);
    }

    function toHex(c){
        var hex = parseInt(c).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    return (
        <div className="Chat">
            <div className="chatlog">
                <ul id='chatlog' className='log'>
                    <li>Welcome to the chatroom!</li>
                    <li>Be nice and kind to each other.</li>
                </ul>
            </div>
            <div className="online">
                <ul id='online'></ul>
            </div>
            <div className="msg">
                <textarea className="input-box" id="input-box" onKeyDown={onEnterPress}></textarea>
                <img className='settings' src={require('../../assets/gear.png')} width='20px' onClick={openmodal}/>
            </div>
            <Modal isOpen={chatsetting} onRequestClose={closemodal} style={customStyle}>
                <div>
                    <h3>Chat Settings</h3>
                    <h4>Name Color</h4>
                    <input type="range" min="0" max="255" id='redSlider' defaultValue={redValue} onChange={getColor}/><br/>
                    <input type="range" min="0" max="255" id='greenSlider' defaultValue={greenValue} onChange={getColor}/><br/>
                    <input type="range" min="0" max="255" id='blueSlider' defaultValue={blueValue} onChange={getColor}/><br/>
                    <p>R:{redValue} G:{greenValue} B:{blueValue}</p>
                    <p id='sampletext' style={{color: color}}>{username}</p>
                </div>
            </Modal>
        </div>
    )
}

export default Chat;