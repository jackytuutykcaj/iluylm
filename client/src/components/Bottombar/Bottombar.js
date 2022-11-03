import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Chat from '../Chat/Chat';
import './Bottombar.css'

Modal.setAppElement('#root')

const customStyle = {
    content: {
        top: '15%',
        bottom: '15%',
        left: '20%',
        right: '20%',
        borderRadius: '15px'
    }
}
const { io } = require('socket.io-client');

function Bottombar({ token, createAlert }){
    const [chatmodal, setchatmodalopen] = useState(false);
    const [socket, setSocket] = useState(() => createCon('http://153.92.214.195:8081'))

    function openchatmodal() {
        setchatmodalopen(true);
        setSocket(() => createCon('http://153.92.214.195:8081'))
        if(window.localStorage.getItem('guest')){
            createAlert('You are talking as a guest');
        }
    }

    function closechatmodal() {
        setchatmodalopen(false);
        socket.disconnect();
    }

    function createCon(url) {
        const socket = io(url, { transports: ['websocket'] });
        return socket;
    }

    return(
        <div className="Bottombar">
            <span style={{float: "left", marginLeft: "1%"}}><span>Level # <progress value={"0"}></progress></span></span>
            <span onClick={openchatmodal} style={{float: "right", marginRight: "1%"}}>Chat</span>
            <Modal isOpen={chatmodal} onRequestClose={closechatmodal} style={customStyle}>
                <Chat socket={socket} token={token}/>
            </Modal>
        </div>
    )
}

export default Bottombar;