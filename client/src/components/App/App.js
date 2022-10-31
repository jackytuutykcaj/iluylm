import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from '../Chat/Chat';
import Home from '../Home/Home';
import Loginbar from '../Loginbar/Loginbar';
import Navbar from '../Navbar/Navbar';
import Profilebar from '../Profilebar/Profilebar';
import './App.css';
import useToken from '../../useToken';
import Profile from '../Profile/Profile';
import Bottombar from '../Bottombar/Bottombar';
import Game from '../TicTacToe/TicTacToe';

function App() {
  const { token, setToken } = useToken();
  const { io } = require('socket.io-client');

  useEffect(()=>{

  }, [])
  let bar;
  if (!token) {
    //no token
    bar = <Loginbar setToken={setToken} />
  } else {
    //yes token
    bar = <Profilebar token={token} />
  }
  return (
    <div className='App'>
      <div className='topbar'>
        <Navbar />
        {bar}
      </div>
      <div className='main-content'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/chat' element={<Chat io={io} token={token}/>} />
            <Route path='/profile' element={<Profile token={token} setToken={setToken}/>} />
            <Route path='/test' element={<Game io={io} token={token}/>} />
          </Routes>
        </BrowserRouter>
      </div>
      <div className='bottom-bar'>
        <Bottombar/>
      </div>
    </div>
  )
}

export default App;