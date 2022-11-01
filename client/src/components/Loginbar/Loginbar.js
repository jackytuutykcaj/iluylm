import React, { useEffect, useState } from 'react';
import Proptypes from 'prop-types';
import './Loginbar.css'
import Modal from 'react-modal';

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

function Loginbar({setToken}) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [signinmodal, setsigninmodalopen] = useState(false);
    const [registermodal, setregistermodalopen] = useState(false);
    const [error, setError] = useState('');

    useEffect(()=>{
        if(!window.localStorage.getItem('token')){
            //get a guest token
            fetchData('http://153.92.214.195:8080/guesttoken', {})
            .then(data=>{
                setToken(data)
            })
        }
    }, [])

    function opensigninmodal() {
        setsigninmodalopen(true);
        setError('');
    }

    function closesigninmodal() {
        setsigninmodalopen(false);
    }

    function openregistermodal() {
        setregistermodalopen(true);
        setError('');
    }

    function closeregistermodal() {
        setregistermodalopen(false);
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

    async function fetchsignin(credentials){
        return fetch('http://153.92.214.195:8080/auth', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(data => data.json())
    }

    async function fetchregister(credentials){
        return fetch('http://153.92.214.195:8080/register', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(data => data.json())
    }

    const signin = async e =>{
        e.preventDefault();
        const token = await fetchsignin({
            email,
            password
        })
        if(token.err){
            setError(token.err);
        }else{
            window.localStorage.clear();
            setToken(token);
        }
    }

    const register = async e =>{
        e.preventDefault();
        const success = await fetchregister({
            username,
            password,
            email
        })
        if(success.err){
            setError(success.err);
        }else{
            window.localStorage.clear();
            setToken(success);
        }
    }

    return (
        <div className='Loginbar'>
            <a onClick={opensigninmodal} style={{borderRight: '1px solid #6a6a6a'}}>Signin</a>
            <a onClick={openregistermodal}>Register</a>
            <Modal isOpen={signinmodal} onRequestClose={closesigninmodal} style={customStyle}>
                <div className='login'>
                    <h1>Signin</h1>
                    <form onSubmit={signin}>
                        <input placeholder='Email' type='text' onChange={e => setEmail(e.target.value)}></input><br />
                        <input placeholder='Password' type='password' onChange={e => setPassword(e.target.value)}></input><br />
                        <button type='submit'>Login</button>
                        <p>{error}</p>
                    </form>
                </div>
            </Modal>
            <Modal isOpen={registermodal} onRequestClose={closeregistermodal} style={customStyle}>
                <div className='register'>
                    <h1>Register</h1>
                    <form onSubmit={register}>
                        <input placeholder='Username' type='text' onChange={e => setUserName(e.target.value)}></input><br />
                        <input placeholder='Email' type='text' onChange={e => setEmail(e.target.value)}></input><br />
                        <input placeholder='Password' type='password' onChange={e => setPassword(e.target.value)}></input><br />
                        <button type='submit'>Register</button>
                        <p>{error}</p>
                    </form>
                </div>
            </Modal>
        </div>
    )
}

Loginbar.propTypes = {
    setToken: Proptypes.func.isRequired
}

export default Loginbar;