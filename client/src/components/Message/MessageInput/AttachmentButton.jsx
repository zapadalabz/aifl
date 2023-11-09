import React, { forwardRef, useRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { prefix } from "./settings";
import ButtonA from "./ButtonA";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons/faPaperclip";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";

const AttachmentButtonF = ({ className, children, ...rest }, ref) => {
  const cName = `${prefix}-button--attachment`;
  const attachRef = useRef(null);

  useImperativeHandle(ref, () => ({
    get buttonA(){
      return attachRef.current;
    }
  }));

  var currentIcon = <FontAwesomeIcon icon={faPaperclip}/>;

  if(rest.attachState.icon === "Loading"){
    currentIcon = <FontAwesomeIcon icon={faSpinner} spin/>;
  }

  return (
    <>
    <ButtonA ref = {attachRef}
      {...rest}
      className={classNames(cName, className)}
      icon={currentIcon}
    >
      {children}
    </ButtonA>
    </>
  );
};

const AttachmentButton = forwardRef(AttachmentButtonF);

AttachmentButton.propTypes = {
  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,
};

AttachmentButton.defaultProps = {
  className: "",
};

export default AttachmentButton;
