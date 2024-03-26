import React, { useContext, useEffect } from "react";
import AppContext from "./Context/AppContext";
import '../styles/alert.css';

export default function Notification() {
    const [app_state, app_dispatch] = useContext(AppContext);

    const handleClose = () => {
        app_dispatch({
            type: 'HIDE_NOTIFICATION',
            payload: {
                visible: false,
            }
        });
    };

    // Animate the alert box when app_state.visible changes
    useEffect(() => {
        const alertBox = document.querySelector('.alert');
        if (app_state.visible && alertBox) {
            alertBox.style.top = '0'; // Slide down from the top
            alertBox.style.opacity = '1'; // Fade in
        } else if (!app_state.visible && alertBox) {
            alertBox.style.top = '-3rem'; // Slide up out of the view
            alertBox.style.opacity = '0'; // Fade out
            // No need to change display property
        }
    }, [app_state.visible]);

    return (
        <div className={`alert alert-${app_state.type} alert-dismissible`} role="alert">
            {app_state.message}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={handleClose}></button>
        </div>
    );
}