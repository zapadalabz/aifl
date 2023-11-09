import React, { forwardRef, useRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { prefix } from "./settings";

const ButtonAF = ({
  children,
  className,
  icon,
  border,
  labelPosition,
  attachState,
  ...rest
}, ref) => {
  const cName = `${prefix}-button`;
  const attachRef = useRef();

  useImperativeHandle(ref, () => ({
    get button(){
      return attachRef.current;
    }
  }));
  

  const lPos = typeof labelPosition !== "undefined" ? labelPosition : "right";
  const labelPositionClassName =
    React.Children.count(children) > 0 ? `${cName}--${lPos}` : "";
  const borderClassName = border === true ? `${cName}--border` : "";

  return (
    <>
    <button ref={attachRef}
      {...rest}
      className={classNames(
        cName,
        labelPositionClassName,
        borderClassName,
        className
      )}
    >
      {lPos === "left" && children}
      <span className="fa-layers fa-fw">
        {icon}
        {attachState.count>0?<span className="fa-layers-counter fa-2x fa-layers-bottom-right attachCounter">{attachState.count}</span>:""}
      </span>
      {lPos === "right" && children}
    </button>
    
    </>
  );
};

const ButtonA = forwardRef(ButtonAF);

ButtonA.propTypes = {
  /** Primary content */
  children: PropTypes.node,
  /** Additional classes. */
  className: PropTypes.string,
  icon: PropTypes.node,
  labelPosition: PropTypes.oneOf(["left", "right"]),
  border: PropTypes.bool,
};

ButtonA.defaultProps = {
  children: undefined,
  className: "",
  icon: undefined,
  labelPosition: undefined,
  border: false,
};

export default ButtonA;