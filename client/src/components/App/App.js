import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../Home/Home';
import Loginbar from '../Loginbar/Loginbar';
import Navbar from '../Navbar/Navbar';
import Profilebar from '../Profilebar/Profilebar';
import './App.css';
import useToken from '../../useToken';
import Profile from '../Profile/Profile';
import Bottombar from '../Bottombar/Bottombar';
import Game from '../TicTacToe/TicTacToe';
import Notifbar from '../NotifBar/Notifbar';

function App() {
  const { token, setToken } = useToken();
  const { io } = require('socket.io-client');
  const showAlert = useRef(null);

  useEffect(()=>{
  }, [])
  let bar;
  if (!token) {
    //no token
    bar = <Loginbar setToken={setToken} createAlert={createAlert} />
    window.localStorage.setItem('guest', 'true');
  } else {
    //yes token
    if(window.localStorage.getItem('guest') != 'true'){
      bar = <Profilebar token={token} createAlert={createAlert} />
    }else{
      bar = <Loginbar setToken={setToken} createAlert={createAlert} />
    }
  }

  function createAlert(text){
    showAlert.current(text);
  }

  return (
    <div className='App'>
      <Notifbar token={token} showAlert={showAlert}/>
      <div className='topbar'>
        <Navbar />
        {bar}
      </div>
      <div className='main-content'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Profile token={token} setToken={setToken} createAlert={createAlert}/>} />
            <Route path='/test' element={<Game io={io} token={token}/>} />
            <Route path="*" element = {<Home/>}/>
          </Routes>
        </BrowserRouter>
      </div>
      <div className='bottom-bar'>
        <Bottombar token={token} createAlert={createAlert}/>
      </div>
    </div>
  )
}

export default App;