import React from "react";
import Title from "../UI/Title";
import Input from "../form/Input";

const Account = (props)=>{
    return(
        <form className="flex-1 lg:p-8 lg:mt-0 mt-5"
              onSubmit={props.formik.handleSubmit}>
            <Title className="text-[40px]">Account Settings</Title>
            <div className="md:grid lg:grid-cols-2 grid-cols-1 md:gap-4 gap-x-11 mt-4">
                {props.inputsInf.map((input) => {
                    return <Input className="md:mt-0 mt-2"
                                  key={input.id}
                                  {...input}
                                  onChange={props.formik.handleChange}
                                  onBlur={props.formik.handleBlur}
                    />
                })}
            </div>
            <button className="btn-primary mt-4" type="submit">Update</button>
        </form>
    );
}
export default Account;