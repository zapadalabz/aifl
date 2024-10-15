import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faMagnifyingGlass, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../../styles/bbmenu.css';

import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from 'react-bootstrap/Button';

// Sample icons for demonstration
const icons = [faPlus, faEye, faMagnifyingGlass];

const BBMenu = ({ items, user }) => {
    const [currentMenu, setCurrentMenu] = useState("main");

    const onClick = (item) => {
        setCurrentMenu(item);
    };

    const goBack = () => {
        setCurrentMenu("main");
    };

    if (currentMenu === "main") {
        return (
            <div className="menu-container">
                {items.map((item, index) => (
                    <div key={index} className="menu-item" onClick={() => onClick(item)}>
                        <FontAwesomeIcon icon={icons[index % icons.length]} size="lg" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
        );
    }

    const CreateNewChatbot = () => {
        const [temperature, setTemperature] = useState(0.7);
        const [systemMessage, setSystemMessage] = useState("You are an experienced teacher that responds using Markdown.");
        const [selectedSections, setSelectedSections] = useState({});
        
        const handleCheckboxChange = (section) => {
            setSelectedSections((prevSelectedSections) => ({
                ...prevSelectedSections,
                [section]: !prevSelectedSections[section],
            }));
        };

        const temperatureCategory = (temperature) => {
        if (temperature < 0.2) {
            return "Predictable";
        }if (temperature < 0.4) {
            return "Conservative";
        }if (temperature < 0.6) {
            return "Balanced";
        }if (temperature < 0.8) {
            return "Creative";
        }if (temperature < 1.0) {
            return "Unpredictable";
        }if (temperature < 1.5) {
            return "Crazy Talk";
        }
            return "Nonsense";
        }
        
        return(
        <div className="welcomeMessage">

        <FloatingLabel controlId="sys_msg" label="System Message">
          <Form.Control
            className="systemMessageInput"
            as="textarea"
            placeholder="System Message"
            value = {systemMessage}
            onChange={(e) => setSystemMessage(e.target.value)}
          />
          </FloatingLabel>
            
        <Form.Label><strong>Temperature:</strong> {temperature} ({temperatureCategory(temperature)})</Form.Label>
        <Form.Range 
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          min={0}
          max={2}
          step={0.1}
        />
        <br/>
        <div className="d-flex justify-content-between align-items-center">
          <em>
            Which Courses have access to this Chatbot?            
          </em>
          <div className="sections-container">
                {Object.keys(user.sections).map((section) => (
                    <div key={section} className="checkbox-item">
                        <input
                            type="checkbox"
                            id={section}
                            checked={!!selectedSections[section]}
                            onChange={() => handleCheckboxChange(section)}
                        />
                        <label htmlFor={section}>{user.sections[section]}</label>
                    </div>
                ))}
            </div>
          <Button variant="outline-secondary">Save</Button>
        </div>
        
      </div>);
    }

    return (
        <div className="menu-container">
            <div className="back-button" onClick={goBack}>
                <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                <span>Back</span>
            </div>
            {currentMenu === "New" && <CreateNewChatbot/>}
            {currentMenu === "View" && <div>View ChatBots</div>}
            {currentMenu === "Search" && <div>Search ChatBots</div>}
        </div>
    );
};

export default BBMenu;