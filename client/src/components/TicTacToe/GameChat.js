import { useEffect } from "react";
import styles from './GameChat.module.css'

function GameChat({ socket }) {
    useEffect(() => {
        socket.on('chatmessage', (message, user) => {
            var item = document.createElement('li');
            var chatlog = document.getElementById('gamechatlog');
            var username = document.createElement('div');
            username.id = styles.username
            var msg = document.createElement('div');
            msg.id = 'message';
            username.textContent = user;
            msg.textContent = `: ${message}`;
            item.appendChild(username);
            item.appendChild(msg);
            chatlog.appendChild(item);
        })
        socket.on('winner', (name)=>{
            var item = document.createElement('li');
            var chatlog = document.getElementById('gamechatlog');
            var msg = document.createElement('div');
            msg.id = 'message';
            msg.textContent = `${name} wins!`;
            item.appendChild(msg);
            chatlog.appendChild(item);
        })

        socket.on('turn', (name)=>{
            var item = document.createElement('li');
            var chatlog = document.getElementById('gamechatlog');
            var msg = document.createElement('div');
            msg.id = 'message';
            msg.textContent = `${name}'s turn`;
            item.appendChild(msg);
            chatlog.appendChild(item);
        })
    }, [])
    function onEnterPress(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            var inputbox = document.getElementById('gameinput-box');
            socket.emit('send-message', inputbox.value);
            inputbox.value = "";
        }
    }
    return (
        <div className={styles.GameChat}>
                <ul id='gamechatlog' className={styles.chatlog}>
                    <li>Welcome!</li>
                </ul>
            <textarea className={styles.inputbox} id="gameinput-box" onKeyDown={onEnterPress} />
        </div>
    )
}

export default GameChat;