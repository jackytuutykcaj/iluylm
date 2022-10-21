import React from 'react';
import './Navbar.css'

function Navbar() {
    return (
        <div className='Navbar'>
            <img className='logo' src={require('../../assets/logo.png')}/>
            <div className='Navigation'>
                <a href='/' style={{borderRight: '1px solid #6a6a6a'}}>Home</a>
                <div className='dropdown'>
                    <a className='drpbtn' style={{borderRight: '1px solid #6a6a6a'}}>Games</a>
                    <div className='menu-content'>
                        <a href='/test'>Test</a>
                    </div>
                </div>
                <a style={{borderRight: '1px solid #6a6a6a'}}>News</a>
                <a>About</a>
            </div>
        </div>
    )
}

export default Navbar;