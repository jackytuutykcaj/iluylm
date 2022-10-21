import React from "react";
import styles from './Lobby.module.css'

function Lobby({playNow, createRoom}){
    function play(){
        playNow();
    }

    function create(){
        createRoom();
    }
    return(
        <div className={styles.Lobby}>
            <div className={styles.mainpanel}>
                <div className={styles.buttons}>
                    <h3 className={styles.playnow} onClick={play}>Play Now</h3>
                    <h4 className={styles.createroom} onClick={create}>Create Room</h4>
                </div>
            </div>
            <div className={styles.rightpanel}>
                <ul className={styles.roomlist}>
                    <li className={styles.room}>
                        <h3>Room Name</h3>
                        <p>Players: 1/3</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Lobby;