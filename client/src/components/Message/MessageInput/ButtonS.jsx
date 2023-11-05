import React, { forwardRef, useRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { prefix } from "./settings";

const ButtonSF = ({
  children,
  className,
  icon,
  border,
  labelPosition,
  ...rest
}, ref) => {
  const cName = `${prefix}-button`;
  const settingsRef = useRef();

  useImperativeHandle(ref, () => ({
    get button(){
      return settingsRef.current;
    }
  }));
  

  const lPos = typeof labelPosition !== "undefined" ? labelPosition : "right";
  const labelPositionClassName =
    React.Children.count(children) > 0 ? `${cName}--${lPos}` : "";
  const borderClassName = border === true ? `${cName}--border` : "";

  return (
    <>
    <button ref={settingsRef}
      {...rest}
      className={classNames(
        cName,
        labelPositionClassName,
        borderClassName,
        className
      )}
    >
      {lPos === "left" && children}
        {icon}
      {lPos === "right" && children}
    </button>
    
    </>
  );
};

const ButtonS = forwardRef(ButtonSF);

ButtonS.propTypes = {
  /** Primary content */
  children: PropTypes.node,
  /** Additional classes. */
  className: PropTypes.string,
  icon: PropTypes.node,
  labelPosition: PropTypes.oneOf(["left", "right"]),
  border: PropTypes.bool,
};

ButtonS.defaultProps = {
  children: undefined,
  className: "",
  icon: undefined,
  labelPosition: undefined,
  border: false,
};

export default ButtonS;