import React, {useState} from "react";
import InputMask from "react-input-mask";
import {BsEye} from "react-icons/bs";

const Input = (props) => {


    const [showPasswordType,setShowPasswordType]=useState("");
    const [showPassword,setShowPassword]=useState(false);
    const ShowPassword = (id) => {
        if(showPassword){
            setShowPasswordType("")
            setShowPassword(false)
        }else{
            setShowPasswordType(id)
            setShowPassword(true)
        }
    }

    const {placeholder, errorMessage, touched, ...inputs} = props
    return <React.Fragment>
        <div className={`w-full ${props.className}`}>
            <label className="relative block cursor-text w-full">
                {inputs.type === "tel" ? (
                        <InputMask
                            {...inputs}
                            mask="(999) 999-9999"
                            maskplaceholder=" "
                            className={`h-14 w-full border border outline-none px-4 pt-2 peer ${
                                errorMessage ? "border-red-600" : "border-primary"
                            }`}
                            value={inputs?.value || ''}
                            required

                        />
                    ) :
                    (
                        <>
                            <input {...inputs}
                                   {...(inputs.type === "password" && showPasswordType === inputs.id && { type: "text" })}
                                   className={`h-14 w-full border border outline-none px-4  peer
                                 ${inputs.type !== "datetime-local" && "pt-2"}
                                     ${errorMessage ? "border-red-600" : "border-primary"}`}
                                   value={inputs?.value || ''}
                                   required

                            />
                            {inputs.type === "password" && <BsEye className=" outline-none absolute bg-transparent top-4 right-4 z-20 text-stateGray text-2xl cursor-pointer"
                                                                  onClick={()=>ShowPassword(inputs.id)}
                            />}
                        </>

                    )

                }
                {inputs.type !== "datetime-local" && <span className={`
                    absolute top-0 left-0 px-4 text-sm 
                    flex items-center h-full
                    peer-focus:h-7 peer-focus:text-xs peer-focus:transition-all peer:focus:bg-tertiary
                    peer-valid:h-7 peer-valid:text-xs ${inputs?.value?.length > 0 && "peer-invalid:h-7"}`}>
                    {placeholder}
                </span>}
            </label>
            {touched && <span className="text-xs text-red-600">{errorMessage}</span>}

        </div>
    </React.Fragment>

}

export default Input;
