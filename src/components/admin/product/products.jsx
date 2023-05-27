import Image from "next/image";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Title from "../../UI/Title";
import {FaEdit} from "react-icons/fa";
import {BiTrash} from "react-icons/bi";
import {toast} from "react-toastify";


const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const products = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
                setProducts(products.data);
            } catch (err) {
                console.log(err);
            }
        }
        getProducts();
    }, [setProducts])

    const onHandleDeleteProduct = async (id) => {
        try {
            if (confirm("Are you sure you want to delete this products?")){
                const deleteProduct = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
                if (deleteProduct.status===200){
                    toast.success("Successes to delete product");
                    setProducts((prev)=>prev.filter((item)=>item._id !== id));
                }
            }
        } catch (err) {
            toast.error("Failed to delete product")
        }
    }

    const onHandleEditProduct =  (product)=>{
        console.log("PRODUCT",product);
    }

    return <div className=" ">
        <Title className="text-[40px] mt-4  border-b-2 ">Products Page</Title>
        <div className="w-[750px] lg:max-h-[40rem] max-h-[25rem] overflow-y-auto no-scrollbar">
            {products.map((product, index) => {
                return <div key={index}
                            className="flex items-start w-full h-[7.375rem] mt-4 border-secondary border-b-[1px] border-opacity-40">
                    <Image src={product.image}
                           alt={`${product.image}`}
                           className=" md:pr-4 pr-1 "
                           width={100}
                           height={100}
                           priority={true}
                    />
                    <div className="flex md:flex-row flex-col w-full h-full md:static relative">
                        <div
                            className="flex flex-col  items-start text-xs font-semibold font-workSans text-cadetGray ml-2 md:w-full w-[8.5rem]  top-2 md:basis-[43.635%]">
                            <p className="text-base font-semibold text-secondary md:mb-0 mb-1 md:w-ful hover:underline cursor-pointer"
                            >{product.title}</p>
                            <p className="text-cadetGray md:mb-0 mb-1">
                                            <span
                                                className="text-stateGray font-workSans font-semibold md:w-full max-w-[8.5rem]">
                                        {product.extraOptions.length > 0 ? "Options:" : ""}</span>
                                {product.extraOptions.map(ext => ext.text).join(', ')}
                            </p>
                            <p className="capitalize md:mb-0 mb-2">Category: {product.category}</p>
                        </div>
                        <div
                            className="flex flex-col md:flex-row md:gap-0 gap-2 items-start
                             md:h-full w-full justify-center md:basis-[56.365%] md:mr-2 md:mt-0 mt-2">
                            <div className="flex items-center justify-center md:h-full flex-row gap-4">
                                    <div><FaEdit className="lg:w-5 w-3  lg:h-5 h-3 cursor-pointer"
                                                 onClick={()=>onHandleEditProduct(product)}
                                    /></div>
                                    <div><BiTrash className="lg:w-5 w-3 lg:h-5 h-3 cursor-pointer text-secondary hover:text-danger"
                                                  onClick={()=>onHandleDeleteProduct(product._id)}
                                    /></div>
                            </div>
                        </div>
                    </div>

                </div>
            })}
        </div>
    </div>

}
export default Products;