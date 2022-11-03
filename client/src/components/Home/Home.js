import React, { useEffect } from "react";
import './Home.css'

function Home() {
    useEffect(() => {
        document.title = "ILUYLM - Home"
    }, [])

    function changeImage(e){
        e.preventDefault();
        if(e.currentTarget.id == "image1"){
            console.log(document.getElementById('spotlight').style.backgroundImage);
        }
        if(e.currentTarget.id == "image2"){
            console.log("image1");
        }
        if(e.currentTarget.id == "image3"){
            console.log("image1");
        }
        if(e.currentTarget.id == "image4"){
            console.log("image1");
        }
    }
    return (
        <div className="Home">
            <div className="spotlight" id="spotlight">
                <ul>
                    <li><a onClick={changeImage} id="image1">1</a></li>
                    <li><a onClick={changeImage} id="image2">1</a></li>
                    <li><a onClick={changeImage} id="image3">1</a></li>
                    <li><a onClick={changeImage} id="image4">1</a></li>
                </ul>
            </div>
            <div className="friends">

            </div>
            <div className="lobby">

            </div>
        </div>
    )
}

export default Home;