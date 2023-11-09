import React, {useState, useEffect} from 'react';
import Modal from './Modal';
import "../../styles/modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as regStar} from "@fortawesome/free-regular-svg-icons/faStar";
import { faStar as solidStar} from "@fortawesome/free-solid-svg-icons/faStar";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { EditView } from './EditView';
import { PromptView } from './PromptView';
import * as mongo from '../../scripts/mongo.js';



const FavModal = ({showFav, setShowFav, handleResponse, setUser, user}) => {
    const emptyPrompt = {
        _id: '',
        prompt: '',
        authorID: user.email,
        public: true,
        numFavs: 0,
        tags: [],
        dateCreated: null,
        lastEditDate: null,
    }

    useEffect(()=>{
        mongo.upsertUser(user);
    },[user])

    const [editPrompt, setEditPrompt] = useState(emptyPrompt);
    const [promptList, setPromptList] = useState([]);
    const [view, setView] = useState("fav");//fav, search, add

    useEffect(()=>{
        mongo.getUserFavourites(user.favPrompts).then((prompts)=>{
            setPromptList(prompts);
        })
        // eslint-disable-next-line
    },[]);

    const handleClose = () => {
        //setPost(empty object)
        setShowFav(false);
    }

    const handleStarClick = () => {
        mongo.getUserFavourites(user.favPrompts).then((prompts)=>{
            setPromptList(prompts);
        })
        setView("fav");
    }

    const handleSearchClick = () => {
        mongo.getPrompts().then((prompts)=>{
            setPromptList(prompts);
        })
        setView("search");
    }

    const handlePlusClick = () => {
        setEditPrompt(emptyPrompt);
        setView("add");
    }

    const handleToggleFav = (_id) => {//add or remove from user's favourites
        const index = user.favPrompts.indexOf(_id);
        let tempArray = user.favPrompts;

        if(index === -1){
            tempArray.push(_id);
        }else{
            tempArray.splice(index,1);
        }
        setUser(prevState => ({...prevState, favPrompts: tempArray}));
    }

    const handleSubmit = (prompt) => { //add or update prompt
        if(prompt._id === ''){
            mongo.addPrompt(prompt).then((res)=>console.log(res));
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
        setPromptList(promptList.filter((_,i) => i !== index));
        mongo.deletePrompt(promptList[index]._id);
    }

    return (
        <div>
            <Modal show={showFav} handleClose={handleClose}>
                <div className='favModal'>
                    <div className="favModalTopBar">
                        <div className='favMenu'>
                            <FontAwesomeIcon className="fa-2x favMenuIcon float-start" icon={view==="fav"? solidStar:regStar} onClick={handleStarClick}/>
                            <FontAwesomeIcon className="fa-2x favMenuIcon float-start" icon={faMagnifyingGlass} onClick={handleSearchClick}/>
                            <FontAwesomeIcon className="fa-2x favMenuIcon float-end" icon={faPlus} onClick={handlePlusClick}/>
                        </div>
                    </div>
                    <div className='favViews'>
                        {view === "fav"&&
                            <PromptView promptList={promptList} handleEditClick={handleEditClick} handleRemoveFavClick={handleRemoveFavClick} handleToggleFav={handleToggleFav} user={user}/>
                        }
                        {view === "search"&&
                            <PromptView promptList={promptList} handleEditClick={handleEditClick} handleRemoveFavClick={handleRemoveFavClick} handleToggleFav={handleToggleFav} user={user}/>
                        }
                        {view === "add"&&<EditView editPrompt={editPrompt} handleSubmit={handleSubmit}/>}   
                    </div>
                                    
                </div>                
            </Modal>
        </div>
        
    );
}

export default FavModal;