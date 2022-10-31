import './Bottombar.css'
function Bottombar(){
    return(
        <div className="Bottombar">
            <span style={{float: "left"}}><span>Level # <progress value={"0"}></progress></span></span>
            <span style={{float: "right", width: "5%"}}>Chat</span>
        </div>
    )
}

export default Bottombar;