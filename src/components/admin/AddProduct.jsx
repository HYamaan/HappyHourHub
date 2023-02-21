
import React, {useState} from "react";
import OutsideClickHandler from "react-outside-click-handler";


import {GiCancel} from "react-icons/gi"
import Title from "../UI/Title";
import axios from "axios";

function AddProduct({setIsProductModal}) {
    const[file,setFile]=useState();
    const[imageSrc,setImageSrc]=useState();

    const handleOnChange = (changeEvent)=>{
        const reader = new FileReader();
        console.log("FileReader",reader)
        reader.onload = function (onLoadEvent){
            //console.log("onLoadEvent",onLoadEvent);
            setImageSrc(onLoadEvent.target.result); //Base64 formatın da data döndü.
            setFile(changeEvent.target.files[0]);
        }
        reader.readAsDataURL(changeEvent.target.files[0])
        console.log( "changeEvent.target.files[0]",changeEvent.target.files[0]); // type=file içindeki veriler
    }
    const handleCreate = async ()=>{
    const data= new FormData();
    data.append("file",file);
    data.append("upload_preset","fast-food");
    try {
        const uploadRes= await axios.post("https://api.cloudinary.com/v1_1/dqotmpx6v/image/upload",data);
    }catch (err){
        console.log(err);
    }

    }
    return (<div
        className="fixed w-screen h-screen z-50 top-0 left-0
    after:content-[''] after:w-screen after:h-screen after:bg-white
    after:opacity-60 after:absolute after:top-0 after:left-0  grid place-content-center"
    >
        <OutsideClickHandler onOutsideClick={() => setIsProductModal(false)}>
            <div className="w-full h-full grid place-content-center ">
                <div className="relative z-50 md:w-[37.5rem] w-[23.125rem]
           bg-white border-2 p-8 shadow-lg rounded-3xl">
                    <Title className="text-center text-[40px]">Search</Title>
                    <div className="flex flex-col text-sm mt-3">
                        <label className="flex items-center gap-4" >
                            <input type="file"
                                   name="image"
                                   id="image"
                                   className="hidden"
                                   onChange={(e)=>handleOnChange(e)}
                                   />
                            <button className="btn-primary !rounded-none !bg-blue-600 pointer-events-none cursor-pointer">Choose an Image</button>
                            {imageSrc && <img src={imageSrc} width={48} height={48} className="rounded-full "/>}
                        </label>

                    </div>

                    <div className="flex flex-col text-sm mt-3">
                        <label htmlFor="title"
                               className="font-semibold mb-[2px]">Title</label>
                        <input type="text" name="title"
                               className="border-2 px-1 outline-none" placeholder="Write a title..."/>

                    </div>

                    <div className="flex flex-col text-sm mt-3">
                        <label htmlFor="description" className="font-semibold mb-[2px]">Description</label>
                        <textarea type="text" name="description"
                                  className="border-2 px-1 outline-none resize-none w-full h-16"
                                  placeholder="Write a title..."/>
                    </div>

                    <div className="flex flex-col text-sm mt-3">
                        <label htmlFor="Category" className="font-semibold mb-[2px]">Description</label>
                        <select type="text" name="Category"
                                className="border-2 px-1 outline-none" placeholder="Write a title...">
                            <option value="1">Category 1</option>
                            <option value="2">Category 2</option>
                            <option value="3">Category 3</option>
                            <option value="4">Category 4</option>
                        </select>
                    </div>

                    <div className="flex flex-col text-sm mt-3">
                        <p className="font-semibold mb-[2px]">Title</p>
                        <div className="flex flex-between gap-2 w-full md:flex-nowrap flex-wrap">
                            <input type="number" name="small"
                                   className="border-1 px-1 outline-none shadow-md" placeholder="small"/>

                            <input type="number" name="medium"
                                   className="border-1 px-1 outline-none  shadow-md" placeholder="medium"/>

                            <input type="number" name="large"
                                   className="border-1 px-1 outline-none shadow-md" placeholder="large"/>

                        </div>
                    </div>
                    <div className="flex flex-col text-sm mt-3">
                        <p className="font-semibold mb-[2px]">Extras</p>
                        <div className="flex items-center flex-between gap-2 w-full md:flex-nowrap flex-wrap">

                            <input type="number" name="item"
                                   className="border-1 px-1 outline-none shadow-md" placeholder="item"/>

                            <input type="number" name="price"
                                   className="border-1 px-1 outline-none  shadow-md" placeholder="Price"/>

                            <button className="btn-primary ml-auto">Add</button>
                        </div>
                    </div>

                   <div className="flex justify-between">
                       <div className="mt-2">
                           <span className="inline-block border-orange-400 text-orange-300 p-1 border rounded-3xl text-xs">Ketçap</span>
                       </div>
                       <button className="btn-primary !bg-success mt-2" onClick={handleCreate}>Create</button>
                   </div>
                    <button className="absolute top-4 right-4"
                            onClick={() => setIsProductModal(false)}>
                        <GiCancel
                            size={30}
                            className="hover:text-primary transition-all"
                        />
                    </button>
                </div>
            </div>
        </OutsideClickHandler>
    </div>);
}

export default AddProduct;
