import React, { useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";

import Title from "../UI/Title";
import axios from "axios";
import {useSession} from "next-auth/react";
import Image from "next/image";
import {useRouter} from "next/router";
import PacmanLoader from "react-spinners/PacmanLoader";
import {BiArrowBack} from "react-icons/bi";
import {useGetOrdersData} from "../../hooks/useGetOrdersData";


const Order = () => {
    const {data: session} = useSession();
    const router = useRouter();

    const status = ["Preparing", "On the way", "Delivered"];
    const [currentUser, setCurrentUser] = useState([]);
    const [showProducts, setShowProducts] = useState(false);
    const [orderProductsID, setOrderProductsID] = useState("");



    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
                setCurrentUser(user.data.filter((existUser) => existUser.email === session?.user?.email)[0]);
            } catch (err) {
                console.log(err);
            }
        }
        getUser();
    }, [session]);

    const handleShowOrdersProducts = (userId) => {
        setOrderProductsID(userId);
    };
    const {data:products,refetch:getProduct} = useQuery({
        queryKey:['get-Product'],
        queryFn : () => {
            return  axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderProductsID}`);
        }
    });

    useEffect(()=>{
        getProduct();
    },[orderProductsID])

    const showProductMenu = (productId) => {
        router.push(`/product/${productId.toString()}`);
    }

    const {isLoading:orderIsLoading,data:orders} =useGetOrdersData(currentUser);

    const backOrders=()=>{
    setShowProducts(!showProducts);
    products.data="";
}

const loadingPackman =(
    <div className="flex justify-center items-center mt-3  h-[375px]">
        <PacmanLoader
            color="#fff200"
            cssOverride={{}}
            loading
            margin={2}
            size={46}
            speedMultiplier={1}
        />
    </div>)



    return <>

        <form className=" flex-1 lg:p-8 lg:mt-0 mt-5 ">
            <div className="flex justify-between mb-1">
                <Title className="text-[40px]">Orders</Title>
                {
                    showProducts &&
                    <div className="flex items-center justify-center">
                        <div className="btn-primary !px-3" onClick={backOrders}>
                            <BiArrowBack/>
                        </div>
                    </div>
                }
            </div>
            <div className="overflow-y-auto h-[475px]">
                {
                    !orderIsLoading ? (<div className="overflow-x-auto w-full h-max-[575px]">
                            {!showProducts ?
                                (<table className="w-full text-sm text-center text-gray-500 min-w-[1000px]">
                                    <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                                    <tr>
                                        <th scope="col" className="py-3 px-6">ID</th>
                                        <th scope="col" className="py-3 px-6">ADRESS</th>
                                        <th scope="col" className="py-3 px-6">DATE</th>
                                        <th scope="col" className="py-3 px-6">TOTAL</th>
                                        <th scope="col" className="py-3 px-6">STATUS</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        orders?.data?.length > 0 &&
                                        orders?.data?.map((order) => (
                                            <tr className=" border-b border-gray-700 bg-secondary
                    hover:bg-primary hover:border-primary transition-all" key={order._id} onClick={() => {
                                                handleShowOrdersProducts(order._id);
                                                setShowProducts(true);
                                            }}>
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center justify-center gap-x-2"
                                                >
                                                    <i className="fa-solid fa-arrow-down mr-2"></i>
                                                    <span>{order._id.substring(0, 5)}...</span></td>
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white ">
                                                    <span>{order?.address}</span></td>
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{order?.updatedAt.slice(0, 10)}</td>
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{order?.quantity}</td>
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{status[order.status]}</td>

                                            </tr>
                                        ))
                                    }


                                    </tbody>
                                </table>)
                                :
                                (<table className="w-full text-sm text-center text-gray-500 min-w-[1000px] ">
                                    <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                                    <tr>
                                        <th scope="col" className="py-3 px-6">PRODUCT</th>
                                        <th scope="col" className="py-3 px-6">EXTRAS</th>
                                        <th scope="col" className="py-3 px-6">PRICE</th>
                                        <th scope="col" className="py-3 px-6">QUANTITY</th>
                                        <th scope="col" className="py-3 px-6">STATUS</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        products?.data?.productOrder?.length > 0 &&
                                        products?.data?.productOrder.map((orderProduct) => (
                                            <tr className=" border-b border-gray-700 bg-secondary
                    hover:bg-primary hover:border-primary transition-all"
                                                key={Math.random()}
                                                onClick={() => {
                                                    showProductMenu(orderProduct.orderId)
                                                }}
                                            >
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center justify-center gap-x-2">
                                                    <Image
                                                        src={orderProduct.image}
                                                        alt={orderProduct.image}
                                                        width={30}
                                                        height={30}
                                                        priority={true}
                                                        className="w-auto h-auto"
                                                    /> <span>{orderProduct.title}</span>
                                                </td>
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                    <span>
                                        {
                                            orderProduct.extras?.length > 0
                                                ?
                                                (orderProduct.extras.map(item => <span
                                                    key={item._id}>{item.text}</span>))
                                                :
                                                ("Empty")
                                        }
                                    </span>
                                                </td>
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{orderProduct.price}</td>
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{orderProduct?.quantity}</td>
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{status[products?.data?.status]}</td>
                                            </tr>
                                        ))
                                    }


                                    </tbody>
                                </table>)
                            }
                        </div>) :loadingPackman

                }


            </div>
        </form>

    </>
}
export default Order;