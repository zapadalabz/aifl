import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons/faPenToSquare";
import { faStar as regStar} from "@fortawesome/free-regular-svg-icons/faStar";
import { faStar as solidStar} from "@fortawesome/free-solid-svg-icons/faStar";

const SearchView = ({promptList, handleEditClick, handleRemoveFavClick, handleToggleFav, user}) => {

    const inUserFav = (_id) =>{
        if(user.favPrompts.indexOf(_id) >= 0){
            return true;
        }else{
            return false;
        }
    }

    return(
    <div className="promptList">
        {promptList.map((prompt,i)=>{
            return(<div key = {prompt._id} className="promptItem d-flex align-items-center justify-content-between">
                <div className="promptContent">
                    {prompt.prompt}           
                </div>  
                <div className="promptIconMenu">
                        <FontAwesomeIcon className="fa-1x favMenuIcon mx-2" icon={inUserFav(prompt._id) ? solidStar: regStar} onClick={() => handleToggleFav(prompt._id)}/>
                        {user.email === prompt.authorID && <FontAwesomeIcon className="fa-1x favMenuIcon mx-2" icon={faPenToSquare} onClick={() => handleEditClick(i)}/>}
                        {user.email === prompt.authorID && <FontAwesomeIcon className="fa-1x favMenuIcon" icon={faTrash} onClick={() => handleRemoveFavClick(i)}/>}

                    </div> 
                         
            </div>)
        })
        }

    </div>);
}

export { SearchView };