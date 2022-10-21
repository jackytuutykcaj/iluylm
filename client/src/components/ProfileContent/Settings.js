import React, { useEffect, useState } from 'react';
import './Settings.css'

function Settings({ token, setToken }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [available, isAvailable] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        fetchData('http://153.92.214.195:8080/getaccount', { token })
            .then(result => {
                setUsername(result.username);
                setEmail(result.email);
            })
    }, [])

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

    function editUsername() {
        const username = document.getElementById('username');
        username.style.display = 'none';
        const editusername = document.getElementById('editusername');
        editusername.style.display = 'block'
    }

    function editEmail() {
        const email = document.getElementById('email');
        email.style.display = 'none';
        const editemail = document.getElementById('editemail');
        editemail.style.display = 'block'
    }

    function editPassword() {
        const password = document.getElementById('password');
        password.style.display = 'none';
        const editpassword = document.getElementById('editpassword');
        editpassword.style.display = 'block'
    }

    function checkAvailibility(e) {
        const username = e.target.value;
        if (username == '') {
            isAvailable('');
        } else {
            if (username.length < 5) {
                isAvailable('Username is too short')
            } else if (username.length > 12) {
                isAvailable("Username is too long");
            } else {
                fetchData('http://153.92.214.195:8080/checkavailable', { username })
                    .then(result => {
                        isAvailable(result.msg);
                    })
            }
        }
    }

    function cancel() {
        document.getElementById('username').style.display = 'block';
        document.getElementById('editusername').style.display = 'none';
        document.getElementById('email').style.display = 'block';
        document.getElementById('editemail').style.display = 'none';
        document.getElementById('password').style.display = 'block';
        document.getElementById('editpassword').style.display = 'none'
        document.getElementById('newUsername').value = '';
        document.getElementById('newEmail').value = '';
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        isAvailable('');
        setEmailError('');
        setPasswordError('');
    }

    function submitNewUsername() {
        const newUsername = document.getElementById('newUsername').value;
        fetchData('http://153.92.214.195:8080/updateaccount', { newUsername: newUsername, oldUsername: username, detail: 'username' })
            .then(result => {
                if(result.fail){
                    isAvailable(result.msg)
                }else{
                    setUsername(newUsername);
                    document.getElementById('username').style.display = 'block';
                    document.getElementById('editusername').style.display = 'none';
                    document.getElementById('newUsername').value = '';
                    setToken(result);
                }
            })
    }

    function submitNewEmail() {
        const newEmail = document.getElementById('newEmail').value;
        fetchData('http://153.92.214.195:8080/updateaccount', { newEmail: newEmail, oldEmail: email, detail: 'email' })
            .then(result => {
                if (result.success) {
                    document.getElementById('email').style.display = 'block';
                    document.getElementById('editemail').style.display = 'none';
                    document.getElementById('newEmail').value = '';
                    setEmailError('');
                    setEmail(newEmail);
                }else{
                    setEmailError('Email is already used');
                }
            })
    }

    function submitNewPassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        fetchData('http://153.92.214.195:8080/updatepassword', { username: username, currentPassword: currentPassword, newPassword: newPassword, confirmPassword: confirmPassword })
            .then(result => {
                if (result.success) {
                    document.getElementById('password').style.display = 'block';
                    document.getElementById('editpassword').style.display = 'none';
                    document.getElementById('currentPassword').value = '';
                    document.getElementById('newPassword').value = '';
                    document.getElementById('confirmPassword').value = '';
                    setPasswordError('');
                } else {
                    if (result.msg == 'Passwords do not match') {
                        setPasswordError(result.msg)
                    }
                    if (result.msg == 'Current password incorrect') {
                        setPasswordError(result.msg)
                    }
                }
            })
    }

    return (
        <div className='Settings'>
            <h2>Settings</h2>
            <h3>Username</h3>
            <p className='username' id='username'>{username} <i className='fa fa-pencil' id='pencil' onClick={editUsername} /></p>
            <div className='editusername' id='editusername'>
                <label>New username</label><br />
                <input onChange={checkAvailibility} id='newUsername'></input>{available}<br />
                <button onClick={submitNewUsername}>Save</button><button onClick={cancel}>Cancel</button>
            </div>
            <h3>Email</h3>
            <p className='email' id='email'>{email} <i className='fa fa-pencil' id='pencil' onClick={editEmail} /></p>
            <div className='editemail' id='editemail'>
                <label>New email</label><br />
                <input id='newEmail'></input><br />
                <button onClick={submitNewEmail}>Save</button><button onClick={cancel}>Cancel</button>
                <p>{emailError}</p>
            </div>
            <h3>Password</h3>
            <p><a className='password' id='password' href='#' onClick={editPassword}>Change Password</a></p>
            <div className='editpassword' id='editpassword'>
                <label>Current Password</label><br />
                <input id='currentPassword' type='password'></input><br />
                <label>New Password</label><br />
                <input id='newPassword' type='password'></input><br />
                <label>Confirm Password</label><br />
                <input id='confirmPassword' type='password'></input><br />
                <button onClick={submitNewPassword}>Save</button><button onClick={cancel}>Cancel</button>
                <p>{passwordError}</p>
            </div>
        </div>
    )
}

export default Settings;