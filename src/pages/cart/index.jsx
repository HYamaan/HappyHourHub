import React, {useEffect, useState} from "react";
import Image from "next/image";
import Title from "../../components/UI/Title";
import {useSelector,useDispatch} from "react-redux";
import {cartActions} from "../../redux/cartSlice";
import axios from "axios";
import {useSession} from "next-auth/react";
import {toast} from "react-toastify";
import {useRouter} from "next/router";

const Cart = ({userList}) => {

    const {data:session}=useSession();
    const dispatch=useDispatch();
    const router = useRouter();
    let cart = useSelector(state=>state.cart);
    const user = userList?.find((user)=>user.email === session?.user?.email);
    const [cartProduct,setCartProduct]=useState([]);




       const cartProducts=()=> cart.products.forEach((item)=>{
            const products={
                image:item.image,
                title:item.title,
                extras:item.extras,
                price:item.price,
                productQuantity:item.productQuantity
            };
            setCartProduct((prev)=>[...prev,products]);
        });


    useEffect(()=>{
        cartProducts();
        console.log("cartProduct",cartProduct);
    },[cart.products.length])

    const newOrder= {
        email:user?.email,
        customer:user?.fullName,
        address:user?.address ? user?.address : "No address",
        quantity:cart.totalQuantity,
        total:cart.total,
        method:0,
        productOrder:cartProduct,

    }

    const createOrder = async ()=>{
        try {
            if(session){
                if(confirm("Are you sure to order?")){
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`,newOrder);
                    if(res.status === 201){
                        dispatch(cartActions.reset())
                        toast.success("Order created successfully",{autoClose:1000});
                        toast.success("Order created successfully",{autoClose:1000});
                        await router.push(`/order/${res.data._id}`);

                    }
                }
            }else{
                throw new Error();

            }
        }catch (err){
            toast.error("Please login first.",{autoClose:1000})
            console.log(err);
        }
    }

    const increaseItemHandler = (item)=>{
        dispatch(cartActions.increaseProduct(item));

    }
    const decreaseItemHandler=(item)=>{
        dispatch(cartActions.decreaseProduct(item));

    }
    const removeItemHandler=(item)=>{
        dispatch(cartActions.removeProduct(item));

    }

    const productPageHandler=(pathName)=>{
        router.push("/product/"+pathName._id.toString());

    }
    console.log(cart.products.map(item=>console.log(item)));

    return <div  className="min-h-[calc(100vh_-_433px)]">
        <div className="flex justify-between items-center md:flex-row flex-col">
            <div className="md:min-h-[calc(100vh_-_433px)] flex items-center flex-1 px-10 overflow-y-auto w-full h-full ">
              <div className="h-[360px] overflow-y-scroll w-full">
                  <table className="w-full text-sm text-center text-gray-500 min-w-[1000px] ">
                      <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                      <tr>
                          <th scope="col" className="py-3 px-6">PRODUCT</th>
                          <th scope="col" className="py-3 px-6">EXTRAS</th>
                          <th scope="col" className="py-3 px-6">PRICE</th>
                          <th scope="col" className="py-3 px-6">QUANTITY</th>
                      </tr>
                      </thead>
                      <tbody className=" ">
                      {cart.products.map((product,index)=>
                          <tr className=" border-b border-gray-700 bg-secondary cursor-pointer
                    hover:bg-primary hover:border-primary transition-all " key={index} >
                              <td className="py-2 px-6 font-medium whitespace-nowrap hover:text-white flex items-center justify-center gap-x-2"
                                  onClick={()=>{productPageHandler(product)}}
                              >
                                  <Image
                                      src={product.image}
                                      alt={product.image}
                                      width={50}
                                      height={50}
                                      priority={true}
                                      className="w-auto h-auto"
                                  /> <span>{product.title}</span></td>
                              <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                  {
                                     product.extras?.length >0 ?  (product.extras.map(item=><span key={item._id}>{item.text}</span>)) : ("Empty")
                                  }</td>
                              <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">${product.price}</td>
                              <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">

                               <div className="flex items-center justify-center gap-2 flex-row">
                                   <button className="border w-4 h-4 rounded-full text-md flex items-center justify-center"
                                    onClick={()=>increaseItemHandler(product)}
                                   >+</button>
                                   <p>{product.productTotal}</p>
                                   <button className="border w-4 h-4 rounded-full text-md flex items-center justify-center"
                                   onClick={()=>decreaseItemHandler(product)}
                                   >-</button>
                                   <div className="ml-4 cursor-pointer" >  <i className="fa-solid fa-trash" onClick={()=>removeItemHandler(product)}></i></div>
                               </div>
                              </td>
                          </tr>
                      )}
                      </tbody>
                  </table>
              </div>
            </div>
            <div className="bg-secondary min-h-[calc(100vh_-_433px)] flex flex-col
             justify-center text-white p-12 md:w-auto w-full   md:text-start !text-center">
                <Title className="text-[40px] md:mt-0 mt-10 ">CART TOTAL</Title>
                <div className="text-sm font-sans self-start text-left">
                    <div><span className="font-bold">Subtotal:</span>${cart.total}</div>
                    <div><span className="font-bold">Discount:</span>$0.00</div>
                    <div><span className="font-bold">Total:</span>${cart.total}</div>
                </div>
                <button className="btn-primary mt-4 md:w-auto w-52 text-center self-center"
                        onClick={createOrder}>CHECKOUT NOW!</button>
            </div>
        </div>
    </div>
}
export const getServerSideProps = async ()=>{
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    return{
        props:{
            userList:res.data ? res.data : [],
        }
    }
}
export default Cart;