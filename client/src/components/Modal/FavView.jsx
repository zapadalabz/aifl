import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons/faPenToSquare";

const FavView = ({promptList, handleEditClick, handleRemoveFavClick}) => {

    return(
    <div className="promptList">
        {promptList.map((prompt,i)=>{
            return(<div key = {prompt._id} className="promptItem d-flex align-items-center justify-content-between">
                <div className="promptContent">
                    {prompt.prompt}           
                </div>  
                <div className="promptIconMenu">
                        <FontAwesomeIcon className="fa-1x favMenuIcon mx-2" icon={faPenToSquare} onClick={() => handleEditClick(i)}/>
                        <FontAwesomeIcon className="fa-1x favMenuIcon" icon={faTrash} onClick={() => handleRemoveFavClick(i)}/>
                    </div> 
                         
            </div>)
        })
        }

    </div>);
}

export { FavView };