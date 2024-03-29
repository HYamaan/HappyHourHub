import Image from "next/image";
import React, {useEffect, useState} from "react";
import OutsideClickHandler from "react-outside-click-handler";
import Title from "../../UI/Title";
import {GiCancel} from "react-icons/gi";
import axios from "axios";
import {toast} from "react-toastify";
import PacmanLoader from "react-spinners/PacmanLoader";

const AddProduct = (props) => {
    const {setIsProductModal,...prop}=props
    const [file, setFile] = useState();
    const [imageSrc, setImageSrc] = useState();

    const [title, setTitle] = useState("");
    const [productType, setProductType] = useState("");
    const [desc, setDesc] = useState("");
    const [descForMenu, setDescForMenu] = useState("");
    const [category, setCategory] = useState("");
    const [prices, setPrices] = useState([]);
    const [kdv,setKDV]=useState("");
    const [totalQuantity,setTotalQuantity] =useState(0);

    const [extra, setExtra] = useState("");
    const [extraOptions, setExtraOptions] = useState([]);

    const [categories,setCategories] = useState("");

    const [isloading,setLoading]=useState(false)




    useEffect(()=>{
        const getProducts = async ()=>{
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
                setCategories(res.data);
            }catch (err){
                console.log(err);
            }
        }
        getProducts();
    },[]);
    const handleExtra = () => {
        if (extra) {
            if (extra.text && extra.price) {
                setExtraOptions([...extraOptions, extra]);
            }
        }
    }

    const handleOnChange = (changeEvent) => {
        const reader = new FileReader();

        reader.onload = function (onLoadEvent) {
            setImageSrc(onLoadEvent.target.result);
            setFile(changeEvent.target.files[0]);
        }
        reader?.readAsDataURL(changeEvent.target.files[0]);
    }


    const time=() =>{
        return new Promise(resolve => setTimeout(resolve,5000));
    }



    const handleCrate = async () => {

        let formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "fast-food");

        if(formData){
            try {
                setLoading(true);
                const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dqotmpx6v/image/upload", formData);
                setLoading(false);
                const {url} = uploadRes.data;

                const newProduct = {
                    image: url,
                    title,
                    productType,
                    desc,
                    descForMenu,
                    category: category.toLowerCase(),
                    prices,
                    stock:totalQuantity,
                    kdv:kdv,
                    extraOptions,
                };

                setLoading(true);
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, newProduct);
                setLoading(false);
                if (res.status === 200) {
                    setIsProductModal(false);
                    setExtra("")
                    setExtraOptions([])
                    setCategories("")
                    setTotalQuantity(0)
                    setKDV("")
                    setPrices([])
                    setCategory("")
                    setDescForMenu("")
                    setDesc("")
                    setTitle("");
                    setProductType("")

                    toast.success("Product created successfully");

                }else{
                    setLoading(false);
                    setIsProductModal(false);
                    throw new Error();
                }

            } catch (err) {
                setIsProductModal(false);
                setLoading(false);
                toast.error("Failed to load for unknown reason!!")
                console.log(err);
            }
        }
    }



        const changePrice = (e, index) => {
            const currentPrices = prices;
            currentPrices[index] = e.target.value;
            setPrices(currentPrices);
        }


        return (<div
            className="fixed lg:top-15 left-0 w-screen h-screen
            after:w-screen after:h-screen after:bg-white after:absolute after:top-0
            after:left-0 after:opacity-60 grid place-content-center">
            {!isloading ?
                (  <OutsideClickHandler onOutsideClick={() => setIsProductModal(false)}>
                    <div className="w-full h-[1rem]]   mt-10 grid place-content-center relative">
                        <div className="relative z-50 md:w-[600px] w-[370px] h-3/4 overflow-y-auto no-scrollbar  bg-white border-2 p-10 rounded-3xl">
                            <Title className="text-[40px] text-center">Add a New Product</Title>

                            <div className="flex flex-col text-sm mt-6">
                                <label className="flex gap-2 items-center">
                                    <input type="file" onChange={(e) => handleOnChange(e)} className="hidden"/>
                                    <button className="btn-primary !rounded-none bg-blue-500 pointer-events-none"> Choose an
                                        Image
                                    </button>
                                    {imageSrc && (<img src={imageSrc} className="rounded-full w-20 h-20 object-contain" alt=""/>)}
                                </label>
                            </div>
                            <div className="flex flex-col text-sm mt-4">
                                <span className="font-semibold mb-[2px]">Title</span>
                                <input
                                    type="text"
                                    className="border-2 p-1 text-sm px-1 outline-none"
                                    placeholder="Write a title..."
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col text-sm mt-4">
                                <span className="font-semibold mb-[2px]">Product Type</span>
                                <input
                                    type="text"
                                    className="border-2 p-1 text-sm px-1 outline-none"
                                    placeholder="Write a Product Type..."
                                    onChange={(e) => setProductType(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col text-sm mt-4">
                                <span className="font-semibold mb-[2px]">Description For Menu</span>
                                <textarea
                                    className="border-2 p-1 text-sm px-1 outline-none"
                                    placeholder="Write a description Menu..."
                                    onChange={(e) => setDescForMenu(e.target.value)}
                                    maxLength={140}
                                />
                            </div>

                            <div className="flex flex-col text-sm mt-4">
                                <span className="font-semibold mb-[2px]">Description</span>
                                <textarea
                                    className="border-2 p-1 text-sm px-1 outline-none"
                                    placeholder="Write a description..."
                                    onChange={(e) => setDesc(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col text-sm mt-4">
                                <span className="font-semibold mb-[2px]">Select Category</span>
                                <select
                                    className="border-2 p-1 text-sm px-1 outline-none"
                                    placeholder="Choose a category"
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option defaultValue="Choose here.." selected disabled hidden>Choose here</option>
                                    {categories.length>0 && categories.map((categoryItem)=>(
                                        <option value={categoryItem.title} key={categoryItem._id}>{categoryItem.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col text-sm mt-4 w-full">
                                <span className="font-semibold mb-[2px]">Prices</span>
                                {category==="pizza" ? (
                                    <div className="flex justify-between gap-6 w-full md:flex-nowrap flex-wrap">
                                        <input
                                            type="number"
                                            className="border-b-2 p-1 pl-0 text-sm px-1 outline-none w-36"
                                            placeholder="small"
                                            onChange={(e) => changePrice(e, 0)}
                                        />
                                        <input
                                            type="number"
                                            className="border-b-2 p-1 pl-0 text-sm px-1 outline-none w-36"
                                            placeholder="medium"
                                            onChange={(e) => changePrice(e, 1)}
                                        />
                                        <input
                                            type="number"
                                            className="border-b-2 p-1 pl-0 text-sm px-1 outline-none w-36"
                                            placeholder="large"
                                            onChange={(e) => changePrice(e, 2)}
                                        />
                                    </div>
                                ) :(
                                    <div className="flex justify-between gap-6 w-full md:flex-nowrap flex-wrap">
                                        <input
                                            type="number"
                                            className="border-b-2 p-1 pl-0 text-sm px-1 outline-none w-36"
                                            placeholder="small"
                                            onChange={(e) => changePrice(e, 0)}
                                        />
                                    </div>
                                ) }
                            </div>
                            <div className="flex gap-6">
                                <div className="flex flex-col text-sm mt-4">
                                    <span className="font-semibold mb-[2px]">KDV</span>
                                    <input
                                        type="text"
                                        className="border-2 p-1 text-sm px-1 outline-none w-36"
                                        placeholder="KDV"
                                        onChange={(e) => setKDV(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col text-sm mt-4">
                                    <span className="font-semibold mb-[2px]">Adet</span>
                                    <input
                                        type="Number"
                                        className="border-2 p-1 text-sm px-1 outline-none w-36"
                                        placeholder="Adet"
                                        onChange={(e) => setTotalQuantity(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col text-sm mt-4 w-full">
                                <span className="font-semibold mb-[2px]">Extra</span>
                                <div className="flex  gap-6 w-full md:flex-nowrap flex-wrap">
                                    <input
                                        type="text"
                                        className="border-b-2 p-1 pl-0 text-sm px-1 outline-none w-36"
                                        placeholder="item"
                                        name="text"
                                        onChange={(e) =>
                                            setExtra((prev) => ({...prev, [e.target.name]: e.target.value}))
                                        }
                                    />
                                    <input
                                        type="number"
                                        className="border-b-2 p-1 pl-0 text-sm px-1 outline-none w-36"
                                        placeholder="price"
                                        name="price"
                                        onChange={(e) =>
                                            setExtra((prev) => ({...prev, [e.target.name]: e.target.value}))
                                        }
                                    />
                                    <button className="btn-primary ml-auto" onClick={handleExtra}>Add</button>
                                </div>

                                <div className="mt-2 flex gap-2 items-start">
                                    {extraOptions.map((item, index) =>
                                        (
                                            <span
                                                className="inline-block border border-orange-500 text-orange-500  p-1 rounded-xl text-xs cursor-pointer"
                                                key={index}
                                                onClick={() => {
                                                    setExtraOptions(extraOptions.filter((_, i) => i !== index))
                                                }}
                                            >
                                            {item.text}
                                        </span>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className="btn-primary !bg-success "
                                        onClick={handleCrate}>Create
                                </button>
                            </div>
                            <button
                                className="absolute  top-4 right-4"
                                onClick={() => setIsProductModal(false)}
                            >
                                <GiCancel size={25} className=" transition-all"/>
                            </button>
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

export default AddProduct;