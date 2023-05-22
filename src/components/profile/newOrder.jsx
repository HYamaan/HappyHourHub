import Title from "../UI/Title";
import {useEffect, useState} from "react";
import axios from "axios";
import moment from "moment/moment";
import OrderProduct from "./orderProduct";


const NewOrder = ({user}) => {
    const [userOrders,setUserOrders]=useState([]);
    const [orderDetails,setOrderDetails]=useState(true);
    const [orderInformation,setOrderInformation]=useState({});
    useEffect(()=>{

        const getOrders=async ()=>{
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${user._id}?email=${user.email}`);

                setUserOrders(res.data)
            }catch (err){
                console.log(err);
            }
        }
        getOrders();
    },[user])


    const statusInformation = {
        "-1":"Ödeme Yapılmadı",
        "0":"Ödeme Tamamlandı",
        "1":"Siparişiniz Hazırlanıyor",
        "2":"Kargo",
        "3":"Teslim Edildi",
        "-9":"Iptal Edildi"
    }
    const paymentInformation={
        "true":"Ödeme Tamamlandı",
        "false":"Ödeme Bekliyor "
    }

    const handleClickDetails= (order)=>{
        setOrderInformation({...order});
        setOrderDetails(false);
    };

    return <>
        {
            orderDetails ? (<>
                <div className="h-full w-full pl-4 mb-6 font-workSans ">
                    <Title className="text-[40px] mt-4  border-b-2 w-[115%]">Siparişlerim</Title>
                    <div className="lg:w-[115%] w-full lg:flex hidden flex-col ">
                        <div className="flex   gap-2 text-[14px] py-8 font-semibold text-cadetGray border-b-[1.11px]">
                            <p className="basis-[20.09%]">Sipariş Numarası</p>
                            <p className="basis-[22.45%]">Sipariş Tarihi</p>
                            <p className="basis-[20.45%]">Sipariş Durumu</p>
                            <p className="basis-[18.45%] lg:pl-4">Ödeme Durumu</p>
                            <p className="basis-[14.71%]">Sipariş Toplamı</p>
                            <p className="basis-[14.84%] lg:pl-7">Detay</p>
                        </div>
                        <div className={`max-h-[30rem] overflow-y-auto no-scrollbar`}>
                            {userOrders.reverse().map((order)=>{
                                return   <div key={order._id} className="flex flex-row  gap-2 py-4 text-payneGray border-b-[1.11px]">
                                    <p className="basis-[15.09%] cursor-pointer hover:underline">HHP{order.conversationId.slice(0,6)}</p>
                                    <p className="basis-[20.45%]">{moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                                    <p className="basis-[18.45%]">{statusInformation[order.status]}</p>
                                    <p className="basis-[18.45%]">{paymentInformation[String(order.completed)]}</p>
                                    <p className="basis-[10.71%]">{`${new Intl.NumberFormat('tr-TR', {
                                        style: 'currency',
                                        currency: order.currency,
                                        minimumFractionDigits: 2
                                    }).format((order.price))} `}</p>
                                    <p className="basis-[12.84%] flex items-center justify-center  border-[1.11px]
                    border-primary rounded-xl text-primary p-2.5 cursor-pointer"
                                       onClick={()=>{  handleClickDetails(order)}}
                                    >Detay</p>
                                </div>
                            })}
                        </div>
                    </div>
                    <div className="w-full lg:hidden flex flex-col justify-between  border-b-[1.11px] py-4">
                        {userOrders.reverse().map((order)=>{
                            return <div key={order._id} className="flex flex-row border-b-[1.11px] py-4">
                                <div className="basis-1/2 flex flex-col gap-4 text-[14px] py-5 font-semibold text-cadetGray">
                                    <p className="">Sipariş Numarası</p>
                                    <p className="">Sipariş Tarihi</p>
                                    <p className="">Sipariş Durumu</p>
                                    <p className="">Ödeme Durumu</p>
                                    <p className="">Sipariş Toplamı</p>
                                    <p className="">Detay</p>
                                </div>
                                <div className="basis-1/2 flex flex-col gap-4 text-[14px] py-6  text-payneGray">
                                    <p className=" cursor-pointer hover:underline">HHP{order.conversationId.slice(0,6)}</p>
                                    <p className="">{moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                                    <p className="">{statusInformation[order.status]}</p>
                                    <p className="">{paymentInformation[String(order.completed)]}</p>
                                    <p className="">{`${new Intl.NumberFormat('tr-TR', {
                                        style: 'currency',
                                        currency: order.currency,
                                        minimumFractionDigits: 2
                                    }).format((order.price))} `}</p>
                                    <p className=" flex items-center justify-center  border-[1.11px] border-primary rounded-xl text-primary p-2.5 cursor-pointer">Detay</p>
                                </div>
                            </div>
                        })}
                    </div>
                </div></>) :
                (<OrderProduct
                    user={user}
                    order={orderInformation}
                    statusInformation={statusInformation}
                     paymentInformation={paymentInformation}
                />)
        }


    </>
}
export default NewOrder;