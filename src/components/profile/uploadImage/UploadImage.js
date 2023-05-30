import React, { useState} from "react";
import OutsideClickHandler from "react-outside-click-handler";


import PacmanLoader from "react-spinners/PacmanLoader";
import axios from "axios";
import {toast} from "react-toastify";



const UploadImage=({setUploadImageShow,user,setUploadImage})=>{
    const [file, setFile] = useState();
    const [isLoading,setIsLoading]=useState(false);

    const handleUpload = async (changeEvent) => {
        const reader = new FileReader();
        reader.onload = function (onLoadEvent) {
            setFile(changeEvent.target.files[0]);
        }
        reader.readAsDataURL(changeEvent.target.files[0]);
    }
    const handleChangeImage= async ()=>{
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "fast-food");
        try {
            setIsLoading(true);
            const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dqotmpx6v/image/upload", formData);
            const {url} = uploadRes.data;
            const img={
                image:url
            }
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}`,
                img
            );


            setIsLoading(false);
            if (res.status === 200) {

                setUploadImageShow(false);
                toast.success("Product created successfully");
                setUploadImage(true);
            }
        }catch (err){
            console.log(err);
        }
    }


    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen z-40
            after:w-screen after:h-screen after:bg-white after:absolute after:top-0 after:left-0 after:opacity-60 grid place-content-center">
            {!isLoading ?
                (  <OutsideClickHandler onOutsideClick={() => setUploadImageShow(false)}>
                    <div className="w-full h-full grid place-content-center relative">
                        <div className="relative z-50 w-[300px] md:w-[600px] w-[570px]  bg-white border-2 p-10 rounded-3xl">
                            <form className="flex flex-wrap justify-center items-center space-x-6 ">
                                <div className="shrink-0">
                                    <img className="h-16 w-16 object-cover rounded-full mb-2 md:mb-0"
                                         src={user.image}
                                         alt="Current profile photo"/>
                                </div>
                                <label className="md:block flex flex-row">
                                    <span className="sr-only ">Choose profile photo</span>
                                    <input type="file"
                                           onChange={(e)=>handleUpload(e)}
                                           className="block w-full text-sm text-slate-500
                                                   file:cursor-pointer
                                                  file:mr-4 file:py-2 file:px-4
                                                  file:rounded-full file:border-0
                                                  file:text-sm file:font-semibold
                                                  file:bg-primary file:text-tertiary
                                                  hover:brightness-75

                                                "
                                    />
                                </label>
                                <button className="btn-primary !bg-success mt-2 md:mt-0 "
                                        onClick={handleChangeImage}>Create
                                </button>
                            </form>

                        </div>
                    </div>
                </OutsideClickHandler>)
                :
                (<div className="flex justify-center items-center mt-3 z-50">
                    <PacmanLoader
                        color="#fff200"
                        cssOverride={{}}
                        loading
                        margin={2}
                        size={36}
                        speedMultiplier={1}
                    />
                </div>)}
        </div>);

}
export default UploadImage;