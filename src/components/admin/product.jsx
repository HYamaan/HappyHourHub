import React, {useEffect, useState} from "react";
import Image from "next/image";
import Title from "../UI/Title";
import axios from "axios";
import {toast} from "react-toastify";

const Product = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
          try {
              const products = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
              setProducts(products.data);
          }catch (err){
              console.log(err);
          }
        }
        getProducts();
    }, [setProducts])
    //console.log("products", products);

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
    return <>
            <div className=" flex-1 lg:p-8 lg:mt-0 mt-5">

                <Title className="text-[40px]">Account Settings</Title>
                   <div className="overflow-x-auto w-full max-h-[327px] ">
                       <table className="w-full text-sm text-center text-gray-500  break-words w-full break-words ">
                           <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                           <tr>
                               <th scope="col" className="py-3 px-6 uppercase">Image</th>
                               <th scope="col" className="py-3 px-6 uppercase">id</th>
                               <th scope="col" className="py-3 px-6 uppercase">title</th>
                               <th scope="col" className="py-3 px-6 uppercase">price</th>
                               <th scope="col" className="py-3 px-6 uppercase">action</th>
                           </tr>
                           </thead>
                           <tbody>
                           {products.map((product, index) => (
                               <tr className=" border-b border-gray-700 bg-secondary
                    hover:bg-primary hover:border-primary transition-all" key={product._id}>
                                   <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center justify-center gap-x-2">
                                       <Image
                                           src={product.image}
                                           alt={product.image}
                                           width={50}
                                           height={50}
                                           className="w-auto h-auto"

                                       /></td>
                                   <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                       {product.extraOptions.map((item, index) => (<span key={index}>{item.text} </span>))}
                                   </td>
                                   <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                       <span>{product.title}</span></td>
                                   <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">${product.prices[0]}</td>
                                   <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                       <button className="btn-primary !bg-[#FF0000]"
                                               onClick={()=>onHandleDeleteProduct(product._id)}
                                       >
                                           Delete
                                       </button>
                                   </td>
                               </tr>
                           ))}
                           </tbody>
                       </table>

                   </div>
               </div>
    </>
}
export default Product;