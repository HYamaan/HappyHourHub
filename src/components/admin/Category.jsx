import React, {useEffect, useState} from "react";
import Title from "../UI/Title";
import Input from "../form/Input";
import axios from "axios";

const Category = () => {
    const [inputText, setInputText] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
                console.log(res)
                setCategories(res?.data);
            } catch (err) {
                console.log(err);
            }
        }
        getCategories();
    }, []);
    const handleCreate = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/categories`,{title:inputText});
            setCategories([...categories,res]);
            setInputText("");

        } catch (err) {
            console.log("CategoryAdmin", err);
        }
    }
    const handleDelete=async (id)=>{
        try {
            if(confirm("Are you sure you want to delete this category?")){
                const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`);
                setCategories(categories.filter(el=>el._id !== id));
            }

        }catch (err){
            console.log(err);
        }
    }


    return (<div className=" flex-1 lg:p-8 lg:mt-0 mt-5">
        <Title className="text-[40px]">Category</Title>
        <div className="mt-5 ">
            <div className="flex gap-4 flex-1 items-center">
                <Input placeholder="Add a new Category..." onChange={(e) => setInputText(e.target.value)}
                       value={inputText}/>
                <button
                    className="btn-primary"
                    onClick={() => {
                        handleCreate()
                    }}>
                    Add
                </button>
            </div>
            <div className="mt-10 max-h-[210px] overflow-auto">
                {categories.map((category) =>
                    <div className="flex justify-between mt-4" key={category._id}>
                        <b className="text-xl">{category.title}</b>
                        <button className="btn-primary !bg-danger"
                                onClick={() =>handleDelete( category._id)}>Delete
                        </button>
                    </div>
                )}

            </div>
        </div>
    </div>);
}
export default Category;