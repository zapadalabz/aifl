import React, { useState } from "react";
import "../styles/sidenav.css"

const RightSideNav = ({selectedModel, setSelectedModel}) => {
    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
    };

    return(
        <div className="sidenav right">
            <div className="sidebarContent">
                <div className="navBrand">
                    <span style={{color: "red"}}>Model</span>
                </div>
                <hr></hr>
                <div className="itemContainer">
                    <form>
                        <input
                            type="radio"
                            id="model1"
                            name="modelList"
                            value="GPT40"
                            checked={selectedModel === 'GPT40'}
                            onChange={handleModelChange}
                        />
                        <label htmlFor="model1" className="modelLabel">GPT 4.0</label>
                        <br />
                        <input
                            type="radio"
                            id="model2"
                            name="modelList"
                            value="GPT4"
                            checked={selectedModel === 'GPT4'}
                            onChange={handleModelChange}
                        />
                        <label htmlFor="model2" className="modelLabel">GPT 4.0 Turbo</label>
                        <br />
                        <input
                            type="radio"
                            id="model3"
                            name="modelList"
                            value="GPT432K"
                            checked={selectedModel === 'GPT432K'}
                            onChange={handleModelChange}
                        />
                        <label htmlFor="model3" className="modelLabel">GPT 4.0 32K</label>
                    </form>         
                </div>
            </div>
        </div>
    );
}

export default RightSideNav