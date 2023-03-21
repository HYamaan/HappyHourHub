import Image from "next/image";
import React, {useEffect, useState} from "react";
import OutsideClickHandler from "react-outside-click-handler";

import Title from "./Title";
import {GiCancel} from "react-icons/gi"
import axios from "axios";
import Input from "../form/Input";
import {useRouter} from "next/router";
import PacmanLoader from "react-spinners/PacmanLoader";

function Search(props) {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [search,setSearch]=useState("");
    const [filtered,setFiltered]=useState([]);

    const[iconsPackman,setIconsPackman]=useState(true);


    useEffect(() => {
        const getProducts = async () => {
            try {
                const products = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
                setProducts(products.data);
                setFiltered(products.data.slice(0,5));
            } catch (err) {
                console.log(err);
            }
        }
       setTimeout( ()=>{
           getProducts();
           setIconsPackman(true);
       },1000);
    }, []);
    const handleSearch = (e)=>{
        setSearch(e.target.value);
        const searchFilter = products.filter((products)=>products.title.toLowerCase().includes(e.target.value.toLowerCase())).slice(0,5);
        setFiltered(searchFilter);

        if(searchFilter.length ===0){
            setIconsPackman(true);
        }
    }
    useEffect(()=>{
       setTimeout( ()=>{
            setIconsPackman(false);
        },1000);
    },[handleSearch])

    return (
        <div
            className="fixed w-screen h-screen z-50 top-0 left-0
    after:content-[''] after:w-screen after:h-screen after:bg-white
    after:opacity-60 after:absolute after:top-0 after:left-0  grid place-content-center"
        >
            <OutsideClickHandler onOutsideClick={() => props.setIsSearchModal(false)}>
                <div className="w-full h-full grid place-content-center ">
                    <div className="relative z-50 md:w-[37.5rem] w-[23.125rem]
           bg-white border-2 p-5 shadow-lg rounded-3xl">
                        <Title className="text-center text-3xl ">Search</Title>
                        <Input type="text" placeholder="Search..."
                               className=" mb-8 mt-2 !h-10"
                                onChange={handleSearch}
                        />
                        {filtered.length > 0 ? (
                                <ul>
                                    {filtered.map((product)=>
                                      (  <li className="flex items-center justify-between
                                         p-1 hover:bg-primary transition-all cursor-pointer" key={product._id}
                                             onClick={()=> {
                                                 router.push(`/product/${product?._id}`);
                                                 props.setIsSearchModal(false)
                                             }}
                                      >
                                            <div className="relative flex">
                                                <Image
                                                    src={product?.image}
                                                    alt={product?.title}
                                                    width={48}
                                                    height={48}
                                                    className="w-auto h-auto"
                                                />
                                            </div>
                                            <span className="font-bold">{product?.title}</span>
                                            <span className="font-bold">${product?.prices[0]}</span>
                                        </li>)
                                    )}

                                </ul>)
                            : (iconsPackman ?(<div className="flex justify-center items-center mt-3">
                                    <PacmanLoader
                                        color="#fff200"
                                        cssOverride={{}}
                                        loading
                                        margin={2}
                                        size={16}
                                        speedMultiplier={1}
                                    />
                            </div>) : ( <div className="text-center text-primary"> No result found</div>  ))

                        }
                        <button className="absolute top-4 right-4"
                                onClick={() => props.setIsSearchModal(false)}>
                            <GiCancel
                                size={30}
                                className="hover:text-primary transition-all"
                            />
                        </button>
                    </div>
                </div>
            </OutsideClickHandler>
        </div>
    );
}

export default Search;
