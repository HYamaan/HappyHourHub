import React from "react";

const Input = (props) => {
    const {placeholder,errorMessage,touched, ...inputs} = props

    return <React.Fragment>
        <div className={`w-full ${props.className}`} >
            <label className="relative block cursor-text w-full">
                <input {...inputs}
                       className={`h-14 w-full border border outline-none px-4  peer
                       ${inputs.type !== "datetime-local" && "pt-2"}
                       ${errorMessage ? "border-red-600" : "border-primary"}`}
                       required

                />
                {inputs.type !== "datetime-local" && <span className={`
                    absolute top-0 left-0 px-4 text-sm 
                    flex items-center h-full
                    peer-focus:h-7 peer-focus:text-xs peer-focus:transition-all peer:focus:bg-tertiary
                    peer-valid:h-7 peer-valid:text-xs`} >
                    {placeholder}
                </span>}
            </label>
                {touched && <span className="text-xs text-red-600">{errorMessage}</span>}

        </div>
    </React.Fragment>

}

export default Input;
