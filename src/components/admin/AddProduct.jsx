import React, {useState} from "react";
import OutsideClickHandler from "react-outside-click-handler";

import {GiCancel} from "react-icons/gi"
import Title from "../UI/Title";
import axios from "axios";
import {useFormik} from "formik";
import {addProductSchema} from "../../schema/addProductSchema";


function AddProduct({setIsProductModal}) {
    const [file, setFile] = useState();
    const [imageSrc, setImageSrc] = useState();
    const[imgControl,setImgControl] = useState(false);

    const handleOnChange = (changeEvent) => {
        console.log(changeEvent);
        const reader = new FileReader();
        console.log("FileReader", reader)
        reader.onload = function (onLoadEvent) {
            //console.log("onLoadEvent",onLoadEvent);
            setImageSrc(onLoadEvent.target.result); //Base64 formatın da data döndü.
            setFile(changeEvent.target.files[0]);
            setImgControl(false);
        }
        reader.readAsDataURL(changeEvent.target.files[0])
        console.log("changeEvent.target.files[0]", changeEvent.target.files[0]); // type=file içindeki veriler
    }
    const handleCreate = async () => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "fast-food");
        try {
            const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dqotmpx6v/image/upload", data);
        } catch (err) {
            console.log(err);
        }

    }

    const onSubmit =  async () => {
        if(!file || !imageSrc){
            setImgControl(true)
            await handleCreate();
        }
        console.log(imgControl);

    }

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            category: "Category 1",
            small: "",
            medium: "",
            large: "",
            item: "",
            price: "",
        },
        onSubmit,
        validationSchema: addProductSchema

    });



    return <React.Fragment>
        <div
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
                            <label className="flex items-center gap-4">
                                <input type="file"
                                       name="image"
                                       id="image"
                                       className="hidden"
                                       onBlur={formik.handleBlur}
                                       onChange={(event) =>  handleOnChange(event)}
                                />
                                <button
                                    className="btn-primary !rounded-none !bg-blue-600 pointer-events-none cursor-pointer">Choose
                                    an Image
                                </button>
                                {imageSrc && <img src={imageSrc} width={48} height={48} className="rounded-full "/>}
                                {imgControl && <div className="mt-[2px] -mb-[22px] text-danger">{'File is required'}</div>  }
                            </label>

                        </div>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="flex flex-col text-sm mt-3.5">
                                <label htmlFor="title"
                                       className="font-semibold mb-1">Title</label>
                                <input type="text" name="title"
                                       className="border-2 px-1 outline-none "
                                       placeholder="Write a title..."
                                       onChange={formik.handleChange}
                                       onBlur={formik.handleBlur}
                                       value={formik.values.title}
                                />
                                {formik.touched.title && formik.errors.title ?
                                    <div className="mt-[2px] -mb-[22px] text-danger">{formik.errors.title}</div> : null}

                            </div>

                            <div className="flex flex-col text-sm mt-5">
                                <label htmlFor="description" className="font-semibold mb-[2px]">Description</label>
                                <textarea  name="description"
                                          className="border-2 px-1 outline-none resize-none w-full h-16"
                                          placeholder="Write a title..."
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          value={formik.values.description}
                                />
                                { formik.touched.description &&  formik.errors.description ?
                                    <div className="mt-[2px] -mb-[22px] text-danger">{formik.errors.description}</div> : null}
                            </div>


                            <div className="flex flex-col text-sm mt-5">
                                <label htmlFor="category" className="font-semibold mb-[2px]">Category</label>
                                <select name="category"
                                        className="border-2 px-1 outline-none"
                                        placeholder="Write a title..."
                                        value={formik.values.category}
                                        onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}>
                                    <option value="1">Category 1</option>
                                    <option value="2">Category 2</option>
                                    <option value="3">Category 3</option>
                                    <option value="4">Category 4</option>
                                </select>
                                {formik.touched.category &&  formik.errors.category ?
                                    <div className="mt-[2px] -mb-[22px] text-danger">{formik.errors.category}</div> : null}
                            </div>

                            <div className="flex flex-col text-sm mt-3">
                                <p className="font-semibold mb-[2px]">Title</p>
                                <div className="flex flex-between gap-2 w-full md:flex-nowrap flex-wrap">
                                    <div className="flex flex-col">
                                        <input type="number" name="small"
                                               className="border-1 px-1 outline-none shadow-md"
                                               placeholder="small"
                                               onChange={formik.handleChange}
                                               onBlur={formik.handleBlur}/>
                                        {formik.touched.small && formik.errors.small ?
                                            <div className="mt-[2px] -mb-[22px] text-danger">{formik.errors.small}</div> : null}
                                    </div>

                                    <div className="flex flex-col">
                                        <input type="number" name="medium"
                                               className="border-1 px-1 outline-none  shadow-md"
                                               placeholder="medium"
                                               onChange={formik.handleChange}
                                               onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.medium && formik.errors.medium ?
                                            <div className="mt-[2px] -mb-[22px] text-danger">{formik.errors.medium}</div> : null}
                                    </div>

                                    <div className="flex flex-col">
                                        <input type="number" name="large"
                                               className="border-1 px-1 outline-none shadow-md"
                                               placeholder="large"
                                               onChange={formik.handleChange}
                                               onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.large && formik.errors.large ?
                                            <div className="mt-[2px] -mb-[22px] text-danger">{formik.errors.large}</div> : null}
                                    </div>

                                </div>
                            </div>
                            <div className="flex flex-col text-sm mt-4">
                                <p className="font-semibold mt-2 -mb-[2px] ">Extras</p>
                                <div className="flex items-center flex-between gap-2 w-full md:flex-nowrap flex-wrap">

                                    <div className="flex flex-col">
                                        <input type="number" name="item"
                                               className="border-1 px-1 outline-none shadow-md"
                                               placeholder="item"
                                               onChange={formik.handleChange}
                                               onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.item && formik.errors.item ?
                                            <div className="mt-[2px] -mb-[22px] text-danger">{formik.errors.item}</div> : null}
                                    </div>

                                    <div className="flex flex-col">
                                        <input type="number" name="price"
                                               className="border-1 px-1 outline-none  shadow-md"
                                               placeholder="Price"
                                               onChange={formik.handleChange}
                                               onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.price && formik.errors.price ?
                                            <div className="mt-[2px] -mb-[22px] text-danger">{formik.errors.price}</div> : null}
                                    </div>

                                    <button className="btn-primary ml-auto" type="submit">Add</button>
                                </div>
                            </div>

                            <div className="flex justify-between mt-2">
                                <div className="mt-2">
                                <span
                                    className="inline-block border-orange-400 text-orange-300 p-1 border rounded-3xl text-xs">Ketçap</span>
                                </div>
                                <button className="btn-primary !bg-success mt-2"
                                        type="submit">Create
                                </button>
                            </div>

                        </form>
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
        </div>
    </React.Fragment>;
}

export default AddProduct;
