import React, { useState } from 'react';
import '../styles/floating_menu.css';

const FloatingMenu = ({ menuItems, setView }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMouseEnter = () => {
        setIsMenuOpen(true);
    };

    const handleMouseLeave = () => {
        setIsMenuOpen(false);
    };

    const handleMenuClick = (key) => {
        console.log(key);
        setView(key);
    }

    return (
        <div 
            className="floating-menu" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
        >
            <div className="menu-icon"/>
            {isMenuOpen && (
                <div className="menu-items">
                    {Object.keys(menuItems).map((key) => (
                        <div key={key} className="menu-item" onClick={()=>handleMenuClick(key)}>
                            {menuItems[key]}
                            <div className="menu-item-label">{key}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FloatingMenu;