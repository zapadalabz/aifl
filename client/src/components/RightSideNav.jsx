import React from "react";
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
                        <br />
                        <input
                            type="radio"
                            id="model2"
                            name="modelList"
                            value="gpt-4o-mini"
                            checked={selectedModel === 'gpt-4o-mini'}
                            onChange={handleModelChange}
                        />
                        <label htmlFor="model2" className="modelLabel">GPT4o-mini</label>
                        <br />
                        <input
                            type="radio"
                            id="model3"
                            name="modelList"
                            value="GPT4o"
                            checked={selectedModel === 'GPT4o'}
                            onChange={handleModelChange}
                        />
                        <label htmlFor="model3" className="modelLabel">GPT4o</label>
                    </form>         
                </div>
            </div>
        </div>
    );
}

export default RightSideNav