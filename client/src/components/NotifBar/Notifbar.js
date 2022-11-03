import React, { useEffect, useState } from 'react';
import './Notifbar.css'

function Notifbar({ token, showAlert }) {
    const [notificationText, setNotificationText] = useState("");

    useEffect(() => {
        showAlert.current = alert;
    }, [])

    function alert(text){
        document.getElementById("Notifbar").style.display = 'flex';
        setNotificationText(text);
        setTimeout(()=>{
            hide();
        }, 5000)
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

    function hide() {
        document.getElementById("Notifbar").style.display = 'none';
    }

    return (
        <div className="Notifbar" id="Notifbar" style={{ display: 'none' }}>
            <span className="notification-text" id="notification-text">{notificationText}</span>
        </div>
    )
}

export default Notifbar;