import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import Feed from "../ProfileContent/Feed";
import Overview from '../ProfileContent/Overview'
import Stats from '../ProfileContent/Stats'
import Achievements from '../ProfileContent/Achievements'
import './Profile.css'
import Settings from "../ProfileContent/Settings";
import ChangeImage from "../ChangeImage/ChangeImage";

Modal.setAppElement('#root')

const customStyle = {
    content: {
        top: '20%',
        bottom: '20%',
        left: '30%',
        right: '30%',
        borderRadius: '15px'
    }
}

function Profile({ token, setToken }) {
    const [username, setusername] = useState('');
    const [show, enableContent] = useState('overview');
    const [modalIsOpen, setOpen] = useState(false);
    const [profilePicID, setProfilePicID] = useState('default.png');
    const url = "http://153.92.214.195:8082/";

    useEffect(() => {
        document.title = "ILUYLM - Profile"
        fetchData('http://153.92.214.195:8080/getprofile', { token })
            .then(data => {
                if (data.err) {
                    window.localStorage.removeItem('token');
                    window.localStorage.clear();
                    window.location.href = '/';
                    return false;
                } else {
                    if (!data.guest) {
                        var username = data.username;
                        setusername(username);
                        fetchData('http://153.92.214.195:8082/getimage', { username })
                            .then(result => {
                                if (result.exists) {
                                    setProfilePicID(result.name + '.png');
                                }
                            })
                    }else{
                        window.location.href = '/';
                    }
                }
            }).catch(error => {
                window.localStorage.removeItem('token')
                window.location.href = '/';
                return false;
            })
    }, [token])

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

    function showContent(e) {
        enableContent(e.currentTarget.id);
    }

    function openModal() {
        setOpen(true);
    }

    function closeModal() {
        setOpen(false);
    }

    function changeAvatar() {
        openModal();
    }

    const close = (data) => {
        setOpen(data);
        window.location.href = 'profile';
    }

    return (
        <div className="Profile">
            <div className="panel">
                <div className="innerpanel">
                    <div className="leftpanel">
                        <div className="topofleftpanel">
                            <img src={`${url}${profilePicID}`} className="profilepic" onClick={changeAvatar} style={{ width: '90px' }} />
                            <h1 className="name">{username}</h1>
                        </div>
                        <div className="menu">
                            <ul>
                                <li onClick={showContent} id="overview" className="menuitem"><a href="#">Overview</a></li>
                                <li onClick={showContent} id="feed" className="menuitem"><a href="#">Activity Feed</a></li>
                                <li onClick={showContent} id="stats" className="menuitem"><a href="#">Stats</a></li>
                                <li onClick={showContent} id="achievements" className="menuitem"><a href="#">Achievements</a></li>
                                <li onClick={showContent} id="settings" className="menuitem"><a href="#">Settings</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="rightpanel">
                        {(show === 'overview') && <Overview token={token} profilePicID={profilePicID} />}
                        {(show === 'feed') && <Feed />}
                        {(show === 'stats') && <Stats />}
                        {(show === 'achievements') && <Achievements />}
                        {(show === 'settings') && <Settings token={token} setToken={setToken} />}
                    </div>
                </div>
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyle}>
                <ChangeImage username={username} close={close} />
            </Modal>
        </div>
    )
}

export default Profile;