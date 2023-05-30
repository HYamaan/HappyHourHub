import Title from "../../UI/Title";
import moment from "moment";
import 'moment/locale/tr';
import Image from "next/image";
import React, {useEffect, useState} from "react";
import axios from "axios";
import CancelOrder from "../../profile/Orders/cancelOrder";
import {toast} from "react-toastify";


const NewOrderProductDetails = ({oldOrder, statusInformation, paymentInformation,showCancelRequest,cancelRequestOrderDetails}) => {

    const productStatusInformation = {
        "-1": "Ödeme Yapılmadı",
        "0": "işleme Alındı",
        "1": "Siparişiniz Hazırlanıyor",
        "2": "Kargo",
        "3": "Teslim Edildi",
        "-9": "Iptal Edildi"
    }
    const productActionStep = {
        "1": "Sipari Hazırla",
        "2": "Kargo'ya Teslim Et",
        "3": "Teslim Edildi",
    }
    const cargoStatusInformation = {
        "-1": "Henüz Kargolanmadı",
        "0": "Henüz Kargolanmadı",
        "1": "Henüz Kargolanmadı",
        "2": "Kargo'ya verildi",
        "3": "Teslim Edildi",
    }

    //const [actionStep,setActionStep]=useState(productActionStep[order.status + 1]);
    const [order,setOrder]=useState(oldOrder);
    const [statusFalse,setStatusFalse]=useState(false);
    const [orderStatus,setOrderStatus]=useState(order.status);
    const [cartPaymentLog, setCartPaymentLog] = useState({});
    const [cancelOrder, setCancelOrder] = useState(false);
    const [userIp,setUserIp]=useState("");


    const statusControl = orderStatus < Object.keys(productActionStep).length;

    const KDV = order.productOrder.reduce((totalKdv, item) => {
        const kdv = parseFloat(item.product.kdv).toFixed(2) * parseFloat(item.price).toFixed(2);
        return totalKdv + kdv;
    }, 0);
    const CargoPrice = order.cargoPrice;
    const price = order.price;
    const MainPrice = parseFloat(order.paidPrice) + KDV;


    useEffect(() => {
        const paymentInformation = async () => {
            try {

                if (order.paymentSuccessId) {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payment-success/${order.paymentSuccessId}`)


                    if (res.status === 200) {
                        const cartPaymentLog = {};
                        cartPaymentLog.cartType = res.data.log.cardType;
                        cartPaymentLog.cardAssociation = res.data.log.cardAssociation;
                        cartPaymentLog.lastFourDigits = res.data.log.lastFourDigits;
                        setCartPaymentLog(cartPaymentLog)
                    }

                }
            } catch (err) {
                console.log(err);
            }
        }
        paymentInformation();
    }, [order])


    const nextStepOrder = async () => {
        try {
            if(statusControl){
                const id=order._id
                const status = order.status < Object.keys(productActionStep).length ? order.status += 1 : order.status;
                const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
                    order:order,
                    status:status
                });
                if(res.status === 200){
                    setOrder(res.data);
                    //setActionStep(productActionStep[res.data.status + 1])
                }
            }
        }catch (err){
            console.log(err);
        }
    }


    useEffect(()=>{
        const getUser = async ()=>{
            try {
                const user = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users?basketId=${order.email}`)
                if(user.status === 200){
                    setUserIp(user.data[0].ip)
                }
            }catch (err){
                console.log(err);
            }
        }
        getUser();
    },[order])

    const cancelOrderPage =async ()=>{
        if(!showCancelRequest){

            setCancelOrder(true)
        }else{
            try {
                setStatusFalse(true);
                const cancel= await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payment/cancel?paymentSuccessId=${order.paymentSuccessId}`,{
                    userIp:userIp,
                    orderId:order._id,
                    conversationId:order.conversationId,
                    reason:cancelRequestOrderDetails[0].reason,
                    description:cancelRequestOrderDetails[0].description
                });
                console.log("cancel",cancel)
                if(cancel.status===200){
                    await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/orders/cancelOrder/${order._id}`)
                    toast.success("Sipariş iptal edildi.")
                    setOrderStatus(-9);
                }
            }catch (err){
                console.log(err)
            }

        }
    }
    console.log("order",order)

    return <div className="flex flex-col h-full w-full lg:px-4">

        <div className="h-full w-full pl-4 mb-6 font-workSans ">
            <Title className="lg:text-[40px] text-[32px] mt-4  border-b-2 w-full">Sipariş Özeti</Title>
            <div className="lg:w-full w-full lg:flex hidden flex-col ">
                <div className="flex   gap-2 text-[14px] py-8 font-semibold text-cadetGray border-b-[1.11px]">
                    <p className="basis-[23.7675%]">Sipariş Numarası</p>
                    <p className="basis-[25.45%]">Sipariş Tarihi</p>
                    <p className="basis-[23.45%]">Sipariş Durumu</p>
                    <p className="basis-[21.45%] lg:pl-4">Ödeme Durumu</p>
                    <p className="basis-[17.71%]">Sipariş Toplamı</p>
                </div>

                <div className="flex flex-row  gap-2 py-6 text-payneGray border-b-[1.11px]">
                    <p className="basis-[18.09%] cursor-pointer hover:underline">HHP{order.conversationId.slice(0, 6)}</p>
                    <p className="basis-[23.45%]">{moment(order.createdAt).locale('tr').format('YYYY-MM-DD dddd')}</p>
                    <p className="basis-[21.45%]">{statusInformation[orderStatus]}</p>
                    <p className="basis-[21.45%]">{paymentInformation[String(order.completed)]}</p>
                    <p className="basis-[13.71%]">{`${new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: order.currency,
                        minimumFractionDigits: 2
                    }).format((order.price))} `}</p>
                </div>
                {
                    showCancelRequest && (<>
                        <div className="flex   gap-2 text-[14px] py-8 font-semibold text-cadetGray border-b-[1.11px]">
                            <p className="basis-[23.7675%]">Reason</p>
                            <p className="basis-[25.45%]">Description</p>
                        </div>

                        <div className="flex flex-row  gap-2 py-6 text-payneGray border-b-[1.11px]">
                            <p className="basis-[18.09%] cursor-pointer hover:underline">{cancelRequestOrderDetails[0].reason}</p>
                            <p className="basis-[23.45%]">{cancelRequestOrderDetails[0].description}</p>
                        </div></>)
                }

                {orderStatus !== -9
                    && (
                    <div className="flex items-center justify-between w-full ">
                        {
                             statusControl && !showCancelRequest && (
                                <div className="w-full flex items-center justify-start mt-5">
                                    <p className="flex items-center justify-center py-3 px-4 font-light rounded-xl
                    border-primary  text-tertiary font-semibold cursor-pointer bg-success  hover:bg-opacity-60  "
                                       onClick={() => {
                                           nextStepOrder()
                                       }}
                                    >{productActionStep[order.status + 1]}</p>
                                </div>
                            )
                        }
                        {
                            statusControl && (

                                <div className="w-full flex items-center justify-end mt-5">
                                <p className="flex items-center justify-center py-3 px-4 font-light rounded-xl
                    border-primary  text-tertiary cursor-pointer bg-primary hover:bg-primaryBold "
                                   onClick={cancelOrderPage }
                                >SİPARİŞ İPTALİ</p>
                            </div>)
                        }
                    </div>)
                }


            </div>
            <div className="w-full lg:hidden flex flex-col justify-between  border-b-[1.11px] py-4">
                {
                    <>
                        <div className="flex flex-row border-b-[1.11px] py-2 mb-4 border-b-2">
                            <div
                                className="basis-1/2 flex flex-col gap-4 text-[14px] py-5 font-semibold text-cadetGray">
                                <p className="">Sipariş Numarası</p>
                                <p className="">Sipariş Tarihi</p>
                                <p className="">Sipariş Durumu</p>
                                <p className="">Ödeme Durumu</p>
                                <p className="">Gönderim Durumu</p>
                                <p className="">Sipariş Toplamı</p>

                            </div>
                            <div className="basis-1/2 flex flex-col gap-4 text-[14px] py-5  text-payneGray">
                                <p className=" cursor-pointer hover:underline">HHP{order.conversationId.slice(0, 6)}</p>
                                <p className="">{moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                                <p className="">{statusInformation[orderStatus]}</p>
                                <p className="">{paymentInformation[String(order.completed)]}</p>
                                <p className="">{`${new Intl.NumberFormat('tr-TR', {
                                    style: 'currency',
                                    currency: order.currency,
                                    minimumFractionDigits: 2
                                }).format((order.price))} `}</p>
                                <p>{cargoStatusInformation[orderStatus]}</p>

                            </div>
                        </div>

                            <div>
                                {
                                    statusControl && !showCancelRequest && (
                                        <div className="w-full flex items-center justify-start mt-5">
                                            <p className="flex items-center justify-center py-3 px-4 font-light rounded-xl
                    border-primary  text-tertiary font-semibold cursor-pointer bg-success  hover:bg-opacity-60  "
                                               onClick={() => {
                                                   nextStepOrder()
                                               }}
                                            >{productActionStep[order.status + 1]}</p>
                                        </div>
                                    )
                                }
                                {
                                    statusControl && ( <div
                                        className=" flex items-center justify-center  rounded-xl text-tertiary bg-primaryBold  p-2.5 cursor-pointer"
                                        onClick={cancelOrderPage}
                                    >SİPARİŞ İPTALİ
                                    </div>)
                                }
                            </div>
                    </>
                }
            </div>
        </div>


        <div className="w-full h-full flex flex-col  px-2 font-workSans mb-4">
            <Title className="lg:text-[40px] text-[32px] mt-4  border-b-2 border-stateGray w-full">Ürünler</Title>
            <div
                className="lg:flex hidden items-center flex-row w-full gap-5 text-cadetGray font-semibold text-sm  pt-5 pb-6 border-b-2">
                <div className="basis-6/12 text-left">ÜRÜN</div>
                <div className="basis-1/12 ">BİRİM FİYAT</div>
                <div className="basis-1/12 ">ADET</div>
                <div className="basis-1/12 text-left">TOPLAM</div>
                <div className="basis-2/12 text-left">Durum</div>
                <div className="basis-1/12 text-left">Fatura</div>
            </div>
            {
                order.productOrder.map((item) => {
                    return <div key={item._id}
                                className="lg:flex hidden items-center lg:flex-row w-full h-[10.625rem]  text-sm  border-b-2">
                        <div className="basis-6/12 flex flex-row  text-left mx-2.5">
                            <div>
                                <Image
                                    src={item.product.image}
                                    alt={item.product.image.toString()}
                                    width={100}
                                    height={100}
                                    priority={true}
                                    style={{objectFit: "cover"}}
                                    className="rounded-full object-contain"
                                />
                            </div>
                            <div className="max-w-[12.063rem] pt-1 pl-2 pb-4 self-start tracking-normal">
                                <p className="max-w-[10.063rem] text-secondary mr-2 font-semibold">MEN BASIC KOTON -
                                    SİYAH</p>
                                <p className="my-1">Ürün Kodu: <span>HHH{item.sku}</span></p>
                                <p>Options:<span> {item.extras.length > 0 ? `${item.extras.map(ext => ext.text).join(', ')}` : "STD"}</span>
                                </p>
                            </div>
                        </div>
                        <div className="basis-1/12 self-start mt-8 tracking-normal mx-2.5">
                            {new Intl.NumberFormat('tr-TR', {
                                style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                            }).format((item.price))}</div>
                        <div
                            className="basis-1/12 self-start mt-8 tracking-normal pl-3 mx-2.5">{item.productTotal}</div>
                        <div className="basis-1/12 flex  tracking-normal border-r-4 h-full mx-3">
                            <span className="w-full h-full mt-8 self-start tracking-normal">
                                {new Intl.NumberFormat('tr-TR', {
                                    style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                                }).format((item.price * item.productTotal))}</span>

                        </div>
                        <div
                            className="basis-1/12 self-center mt-8 tracking-normal  ">{productStatusInformation[item.status]}

                        </div>
                        <div className="basis-2/12 self-start mt-8 tracking-normal mx-2.5"></div>
                    </div>
                })
            }

            <div className="h-full w-full lg:hidden flex flex-col pt-2 pb-7 font-workSans font-light text-sm">
                {
                    order.productOrder.map((item) => {
                        return <div key={item._id} className="flex flex-row h-[8.438rem]  border-b-2">
                            <div className="flex items-center h-full">
                                <Image
                                    src={item.product.image}
                                    alt={item.product.image.toString()}
                                    width={100}
                                    height={100}
                                    priority={true}
                                    style={{objectFit: "cover"}}
                                    className="rounded-full object-contain"
                                />
                            </div>
                            <div className="max-w-[12.063rem] p-3 self-start tracking-normal text-xs">
                                <p className="my-1">      {new Intl.NumberFormat('tr-TR', {
                                    style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                                }).format((item.price))}</p>
                                <p className="max-w-[10.063rem] text-secondary mr-2 font-semibold">MEN BASIC KOTON -
                                    SİYAH</p>
                                <p className="my-1">Ürün Kodu: <span>HHH{item.sku}</span></p>
                                <p>Options:<span> {item.extras.length > 0 ? `${item.extras.map(ext => ext.text).join(', ')}` : "STD"}</span>
                                </p>
                                <p>Adet: <span>{item.productTotal}</span></p>
                            </div>

                        </div>
                    })

                }


            </div>
            <div className="lg:w-full  lg:flex lg:justify-end">
                <div className=" h-full w-full lg:w-72 ">
                    <div className="basis-1/2 flex flex-row  pt-5 pb-3  border-b-2  px-4 ">
                        <div className=" basis-1/2 font-semibold flex flex-col gap-5 ">
                            <p>Ara Toplam</p>
                            <p> Kargo Ücreti</p>
                            <p> KDV</p>
                        </div>
                        <div className="lg:w-full basis-1/2 flex  items-center flex-col gap-5 font-light ml-5 ">
                            <p> {new Intl.NumberFormat('tr-TR', {
                                style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                            }).format((price))}</p>
                            <p> {CargoPrice === 0 ? "Ücretsiz Kargo" : (<>{new Intl.NumberFormat('tr-TR', {
                                style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                            }).format((CargoPrice))}</>)}</p>
                            <p> {new Intl.NumberFormat('tr-TR', {
                                style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                            }).format((KDV))}</p>
                        </div>
                    </div>
                    <div className=" flex flex-row  border-b-2  py-5 px-4 ">
                        <div className="basis-1/2 font-semibold">
                            <p>Sipariş Toplamı</p>
                        </div>
                        <div className="basis-1/2 flex flex-col items-center font-extralight">
                            <p>  {new Intl.NumberFormat('tr-TR', {
                                style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                            }).format((MainPrice))}</p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
        <div className="h-full w-full pl-4 mb-6 font-workSans ">
            <Title className="text-[40px] mt-4  border-b-2 w-full">Ödeme Bilgileri</Title>
            <div className="flex lg:flex-row flex-col gap-4 mt-8">
                <div className="flex flex-col gap-1">
                    <div className="font-semibold py-4">Fatura Adresi</div>
                    <div>{order.e_invoiceAddress.name} {order.e_invoiceAddress.surname}</div>
                    <div>{order.e_invoiceAddress?.email || order.email}</div>
                    <div>{order.e_invoiceAddress.address1}</div>
                    <div>{order.e_invoiceAddress.country}</div>
                    <div>{order.e_invoiceAddress.city}</div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="font-semibold py-4">Teslimat Adresi</div>
                    <div>{order.cargoAddress.name} {order.cargoAddress.surname}</div>
                    <div>{order.cargoAddress?.email || order.email}</div>
                    <div>{order.cargoAddress.address1}</div>
                    <div>{order.cargoAddress.country}</div>
                    <div>{order.cargoAddress.city}</div>
                </div>
                <div className="flex flex-col gap-1 w-64">
                    <div className="font-semibold py-4">Kargo Bilgileri</div>
                    <div>{order.cargo} </div>
                    <div>{cargoStatusInformation[orderStatus]}</div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="font-semibold py-4">Kargo Bilgileri</div>
                    <div>Cart Type: {cartPaymentLog.cartType} </div>
                    <div>Cart Association: {cartPaymentLog.cardAssociation} </div>
                    <div>Cart lastFourDigits: {cartPaymentLog.lastFourDigits} </div>

                </div>
            </div>

        </div>
        {cancelOrder && <CancelOrder setCancelOrder={setCancelOrder} order={order}/>}
    </div>

}
export default NewOrderProductDetails;