import React, {useEffect, useState} from "react";
import Title from "../UI/Title";
import Input from "../form/Input";
import axios from "axios";

const Category = () => {
    const [inputText, setInputText] = useState("");
    const [categories, setCategories] = useState([]);
    const [createCategory,setCreateCategory]=useState(false);


    const handleCreate = async () => {
        try {
            const inputTitle = inputText.charAt(0).toUpperCase() + inputText.slice(1);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {title: inputTitle});
            if (res.status === 200) {

                setCategories([...categories, res]);
                setInputText("");
                setCreateCategory(true)
            }

        } catch (err) {
            console.log("CategoryAdmin", err);
        }
    }
    const handleDelete = async (id) => {
        try {
            if (confirm("Are you sure you want to delete this category?")) {
                 await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`);
                setCategories(categories.filter(el => el._id !== id));
            }

        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
                if (res.status === 200) {
                    setCategories(res.data);
                    setCreateCategory(false)
                }
            } catch (err) {
                console.log(err);
            }
        }
        getCategories();
    }, [createCategory]);


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
                {categories.map((category,index) =>
                    <div key={category._id || index} className="flex justify-between mt-4"
                         >
                        <b className="text-xl">{category.title}</b>
                        <button className="btn-primary !bg-danger"
                                onClick={() => handleDelete(category._id)}>Delete
                         </button>
                    </div>
                )}

            </div>
        </div>
    </div>);
}
export default Category;