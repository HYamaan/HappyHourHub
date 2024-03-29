import Title from "../../UI/Title";
import React, {useEffect, useState} from "react";
import axios from "axios";
import moment from "moment/moment";
import NewOrderProductDetails from "./newOrderDetails";
import PacmanLoader from "react-spinners/PacmanLoader";
import CancellationRequest from "./cancellationRequest";


const NewOrder = () => {
    const [usersOrders, setUsersOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState(true);
    const [orderInformation, setOrderInformation] = useState({});
    const [selectOrderInformation, setSelectOrderInformation] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showCancelRequest, setShowCancelRequest] = useState(false);
    const [cancelRequestOrderDetails,setCancelRequestOrderDetails]=useState([]);
    console.log("selectOrder", selectOrderInformation)
    useEffect(() => {

        const getOrders = async () => {
            try {
                setIsLoading(false);
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders?status=${selectOrderInformation}`);
                setUsersOrders(res.data)
                setIsLoading(true);
            } catch (err) {
                console.log(err);
            }
        }
        getOrders();
    }, [selectOrderInformation])


    const statusInformation = {
        "-9": "Iptal Edildi",
        "-1": "Ödeme Yapılmadı",
        "0": "Ödeme Tamamlandı",
        "1": "Siparişiniz Hazırlanıyor",
        "2": "Kargo",
        "3": "Teslim Edildi"

    }
    const paymentInformation = {
        "true": "Ödeme Tamamlandı",
        "false": "Ödeme Bekliyor "
    }

    const handleClickDetails = (order) => {
        setOrderInformation({...order});
        setOrderDetails(false);
    };


    return <div className="lg:min-w-[1200px]">
        {
            orderDetails ?
                (<>
                    <div className="h-full w-full pl-4 mb-6 font-workSans ">
                        <div className=" border-b-2 w-[115%] pb-4">
                            <Title className="text-[40px] mt-4 w-[115%]">Order Page</Title>
                            <div className="flex lg:flex-row flex-col items-center lg:gap-10">
                                <select
                                    id="select"
                                    value={selectOrderInformation}
                                    onChange={(e) => {setSelectOrderInformation(e.target.value)
                                    setShowCancelRequest(false)}}
                                    className="  p-4 bg-gray border-gray-300
                             rounded-md shadow-sm focus:outline-none focus:ring-opacity-50 shadow-2xl shadow-cadetGray"
                                >
                                    {Object.entries(statusInformation).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                                <div className={`flex items-center justify-center w-52 px-4 py-2 my-4
             rounded-2xl leading-6 text-left tracking-wide  lg:text-base text-sm cursor-pointer
             ${showCancelRequest ? "bg-primaryBold text-tertiary font-semibold" :"bg-primary "}
             `}
                                onClick={()=>{setShowCancelRequest(true)}}

                                >
                                    İptal İstekleri
                                </div>
                            </div>

                        </div>
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
                                {isLoading ? (
                                    <>
                                        {
                                            !showCancelRequest ? (<>   {usersOrders.reverse().map((order) => {
                                                return <div key={order._id}
                                                            className={`border-l-8  ${order.status !== 3 ? "border-primary" : "border-danger"}`}>
                                                    <div className="flex flex-row  gap-2 py-4 text-payneGray border-b-[1.11px]">
                                                        <p className="basis-[15.09%] cursor-pointer hover:underline  pl-2"
                                                           onClick={() => {
                                                               handleClickDetails(order)
                                                           }}
                                                        > HHP{order.conversationId.slice(0, 6)}</p>
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
                                                           onClick={() => {
                                                               handleClickDetails(order)
                                                           }}
                                                        >Detay</p>
                                                    </div>
                                                </div>
                                            })}</>) :
                                                (<CancellationRequest
                                                    statusInformation={statusInformation}
                                                    paymentInformation={paymentInformation}
                                                    handleClickDetails={handleClickDetails}
                                                    setCancelRequestOrderDetails={setCancelRequestOrderDetails}
                                                />)
                                        }
                                 </>) :
                                    (<div className="flex items-center justify-center w-full h-[20rem]">
                                    <PacmanLoader
                                        color="#fff200"
                                        cssOverride={{}}
                                        loading
                                        margin={2}
                                        size={52}
                                        speedMultiplier={1}
                                    /></div>)}
                            </div>
                        </div>
                        <div className="w-full lg:hidden flex flex-col justify-between  border-b-[1.11px] py-4">
                            {isLoading ? (<> {usersOrders.reverse().map((order) => {
                                return <div key={order._id} className="flex flex-row border-b-[1.11px] py-4">
                                    <div
                                        className="basis-1/2 flex flex-col gap-4 text-[14px] py-5 font-semibold text-cadetGray">
                                        <p className="">Sipariş Numarası</p>
                                        <p className="">Sipariş Tarihi</p>
                                        <p className="">Sipariş Durumu</p>
                                        <p className="">Ödeme Durumu</p>
                                        <p className="">Sipariş Toplamı</p>
                                        <p className="">Detay</p>
                                    </div>
                                    <div className="basis-1/2 flex flex-col gap-4 text-[14px] py-6  text-payneGray">
                                        <p className=" cursor-pointer hover:underline"
                                        > HHP{order.conversationId.slice(0, 6)}</p>
                                        <p className="">{moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                                        <p className="">{statusInformation[order.status]}</p>
                                        <p className="">{paymentInformation[String(order.completed)]}</p>
                                        <p className="">{`${new Intl.NumberFormat('tr-TR', {
                                            style: 'currency',
                                            currency: order.currency,
                                            minimumFractionDigits: 2
                                        }).format((order.price))} `}</p>
                                        <p className=" flex items-center justify-center  border-[1.11px] border-primary rounded-xl text-primary p-2.5 cursor-pointer"
                                           onClick={() => {
                                               handleClickDetails(order)
                                           }}
                                        >Detay</p>
                                    </div>
                                </div>
                            })}</>):(<div className="flex items-center justify-center w-full h-[20rem]">
                                <PacmanLoader
                                    color="#fff200"
                                    cssOverride={{}}
                                    loading
                                    margin={2}
                                    size={32}
                                    speedMultiplier={1}
                                /></div>)}
                        </div>
                    </div>
                </>) :
                (<NewOrderProductDetails
                    cancelRequestOrderDetails={cancelRequestOrderDetails}
                    showCancelRequest={showCancelRequest}
                    oldOrder={orderInformation}
                    statusInformation={statusInformation}
                    paymentInformation={paymentInformation}
                />)
        }
    </div>
}
export default NewOrder;