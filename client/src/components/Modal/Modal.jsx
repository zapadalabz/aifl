import React from 'react';
import '../../styles/modal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons/faCircleXmark";

const Modal = ({ show, handleClose, children }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <div className="">
          <FontAwesomeIcon className="fa-2x modal-close-btn" icon={faCircleXmark} onClick={handleClose}/>
        </div>
      </section>
    </div>
  );
};

export default Modal;
