import React, { forwardRef, useRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { prefix } from "./settings";
import ButtonS from "./ButtonS";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";

const SettingsButtonF = ({ className, children, ...rest }, ref) => {
  const cName = `${prefix}-button--attachment`;
  const settingsRef = useRef(null);

  useImperativeHandle(ref, () => ({
    get buttonS(){
      return settingsRef.current;
    }
  }));

  return (
    <>
    <ButtonS ref = {settingsRef}
      {...rest}
      className={classNames(cName, className)}
      icon={<FontAwesomeIcon icon={faCog} 
      />}
    >
      {children}
    </ButtonS>
    </>
  );
};

const SettingsButton = forwardRef(SettingsButtonF);

SettingsButton.propTypes = {
  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,
};

SettingsButton.defaultProps = {
  className: "",
};

export default SettingsButton;
