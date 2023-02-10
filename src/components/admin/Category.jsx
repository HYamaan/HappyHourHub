import React, {useState} from "react";
import Title from "../UI/Title";
import Input from "../form/Input";

const Category = () => {
    const [inputText, setInputText] = useState("");
    const [categories, setCategories] = useState(["pizza"]);

    return (<div className=" flex-1 lg:p-8 lg:mt-0 mt-5">
        <Title className="text-[40px]">Category</Title>
        <div className="mt-5">
            <div className="flex gap-4 flex-1 items-center">
                <Input placeholder="Add a new Category..." onChange={(e) => setInputText(e.target.value)}
                       value={inputText}/>
                <button
                    className="btn-primary"
                    onClick={() => {
                        setCategories([...categories, inputText]);
                        setInputText("");
                    }}>
                    Add
                </button>
            </div>
            <div className="mt-10">
                  {categories.map((item,index)=>
                      <div className="flex justify-between mt-4" key={index}>
                          <b className="text-xl">{item}</b>
                          <button className="btn-primary !bg-danger"
                          onClick={()=>setCategories(categories.filter(el=>el !== item))}>Delete</button>
                      </div>
                  )}

            </div>
        </div>
    </div>);
}
export default Category;