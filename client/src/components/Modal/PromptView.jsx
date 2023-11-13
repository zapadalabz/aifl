import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons/faPenToSquare";
import { faStar as regStar} from "@fortawesome/free-regular-svg-icons/faStar";
import { faStar as solidStar} from "@fortawesome/free-solid-svg-icons/faStar";
import { faCopy as regCopy} from "@fortawesome/free-regular-svg-icons/faCopy";
import { faCopy as solidCopy} from "@fortawesome/free-solid-svg-icons/faCopy";

const PromptView = ({promptList, handleEditClick, handleRemoveFavClick, handleToggleFav, user}) => {
    const [copied, setCopied] = useState(null);

    const inUserFav = (_id) =>{
        if(user.favPrompts.indexOf(_id) >= 0){
            return true;
        }else{
            return false;
        }
    }

    const handleCopied = (prompt, id) => {
        navigator.clipboard.writeText(prompt);
        setCopied(id);
    }

    return(
    <div className="promptList">
        {promptList.map((prompt,i)=>{
            return(<div key = {prompt._id} className="promptItem d-flex">
                <div className="promptContent">
                    <FontAwesomeIcon className="fa-1x favMenuIcon mx-2" icon={copied === prompt._id ? solidCopy: regCopy} onClick={() => handleCopied(prompt.prompt, prompt._id)}/>
                    <div className="promptPreview">
                        {prompt.prompt}
                    </div>                               
                </div>  
                <div className="promptIconMenu">                        
                        {user.email === prompt.authorID && <FontAwesomeIcon className="fa-1x favMenuIcon mx-2" icon={faPenToSquare} onClick={() => handleEditClick(i)}/>}
                        {user.email === prompt.authorID && <FontAwesomeIcon className="fa-1x favMenuIcon" icon={faTrash} onClick={() => handleRemoveFavClick(i)}/>}
                        <FontAwesomeIcon className="fa-1x favMenuIcon mx-2" icon={inUserFav(prompt._id) ? solidStar: regStar} onClick={() => handleToggleFav(prompt._id)}/>
                    </div> 
                         
            </div>)
        })
        }

    </div>);
}

export { PromptView };