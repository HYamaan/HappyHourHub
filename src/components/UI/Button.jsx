import React from "react";

const Button = (props) => {
    return <button
        className={`${props.children} btn-primary mt-[10px] !py-[10px] !px-[45px] `}>
        {props.children}</button>
}
export default Button;