import React, { useEffect } from "react";
import './Home.css'

function Home(){
    useEffect(()=>{
        document.title = "ILUYLM - Home"
    },[])
    return(
        <div className="Home">
            <div className="spotlight">
                
            </div>
            <div className="friends">

            </div>
            <div className="lobby">

            </div>
        </div>
    )
}

export default Home;