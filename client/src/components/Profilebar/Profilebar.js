import React, { useEffect, useState } from 'react';
import './Profilebar.css'

function Profilebar({ token, createAlert }) {
    const [username, setusername] = useState('');

    useEffect(() => {
        fetchData('http://153.92.214.195:8080/getprofile', { token })
            .then(data => {
                if (data.err) {
                    window.localStorage.removeItem('token')
                    window.location.href = '/';
                    return false;
                } else {
                    setusername(data.username);
                    if(window.location.pathname == '/'){
                        createAlert("Welcome " + data.username);
                    }
                }
            }).catch(error =>{
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

    function logout() {
        window.localStorage.removeItem('token');
        window.location.href = '/';
        
        return false;
    }

    return (
        <div className='Profilebar'>
            <div className='dropdown'>
                <a className='dropbtn'>{username}</a>
                <div className='menu-content'>
                    <a href='/profile'>Profile</a>
                    <a href='#' onClick={logout}>Logout</a>
                </div>
            </div>
        </div>
    )
}

export default Profilebar;