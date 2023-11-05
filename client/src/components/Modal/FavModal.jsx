import React, {useState, useEffect} from 'react';
import Modal from './Modal';
import "../../styles/modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { PromptView } from './PromptView';
import { FavView } from './FavView';
import * as mongo from '../../scripts/mongo.js';

const emptyPrompt = {
    _id: '',
    prompt: '',
    authorID: '',
    public: true,
    numFavs: 0,
    tags: [],
    dateCreated: null,
    lastEditDate: null,
}

const FavModal = ({showFav, setShowFav, handleResponse}) => {
    const [editPrompt, setEditPrompt] = useState(emptyPrompt);
    const [promptList, setPromptList] = useState([]);
    const [view, setView] = useState("fav");//fav, search, add

    useEffect(()=>{
        mongo.getPrompts().then((prompts)=>{
            setPromptList(prompts);
        })
    },[]);

    const handleClose = () => {
        //setPost(empty object)
        setShowFav(false);
    }

    const handleStarClick = () => {
        mongo.getPrompts().then((prompts)=>{
            setPromptList(prompts);
        })
        setView("fav");
    }

    const handleSearchClick = () => {
        console.log("Search");
        setView("search");
    }

    const handlePlusClick = () => {
        setEditPrompt(emptyPrompt);
        setView("add");
    }

    const handleSubmit = (prompt) => { //add or update prompt
        if(prompt._id === ''){
            mongo.addPrompt(prompt);
        }else{
            mongo.updatePrompt(prompt);
        }
        setEditPrompt(emptyPrompt);
        handleStarClick();
      };

    const handleEditClick = (index) => {
        setEditPrompt(promptList[index]);
        setView("add");
    }

    const handleRemoveFavClick = (index) => {
        setPromptList(promptList.filter((_,i) => i != index));
        mongo.deletePrompt(promptList[index]._id);
    }

    return (
        <div>
            <Modal show={showFav} handleClose={handleClose}>
                <div className='favModal'>
                    <div className="favModalTopBar">
                        <div className='favMenu'>
                            <FontAwesomeIcon className="fa-2x favMenuIcon float-start" icon={faStar} onClick={handleStarClick}/>
                            <FontAwesomeIcon className="fa-2x favMenuIcon float-start" icon={faMagnifyingGlass} onClick={handleSearchClick}/>
                            <FontAwesomeIcon className="fa-2x favMenuIcon float-end" icon={faPlus} onClick={handlePlusClick}/>
                        </div>
                    </div>
                    <div className='favViews'>
                        {view === "fav"&&
                            <FavView promptList={promptList} handleEditClick={handleEditClick} handleRemoveFavClick={handleRemoveFavClick}/>
                        }
                        {view === "add"&&<PromptView editPrompt={editPrompt} handleSubmit={handleSubmit}/>}   
                    </div>
                                    
                </div>                
            </Modal>
        </div>
        
    );
}

export default FavModal;