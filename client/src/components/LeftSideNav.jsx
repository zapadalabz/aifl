import React from "react";
import "../styles/sidenav.css"

const LeftSideNav = ({setShowFav, handleLogOut}) => {

    return(
        <div className="sidenav left">
            <div className="sidebarContent">
                <div className="navBrand">
                    <span style={{color: "red"}}>A</span><span style={{color: "white"}}>i</span><span style={{color: "red"}}>FL</span>
                </div>
                <hr></hr>
                <div className="itemContainer">
                    <div className="navItem" onClick={()=> setShowFav(true)}>
                        Favourites
                    </div>
                    <div className="navItem" onClick={()=>handleLogOut()}>
                        Sign Out
                    </div>                    
                </div>
            </div>
            
            
        </div>
    );
}

export default LeftSideNav