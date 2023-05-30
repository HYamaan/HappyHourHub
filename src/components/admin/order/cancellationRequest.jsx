import moment from "moment";
import React, {useEffect, useState} from "react";
import axios from "axios";

const CancellationRequest = ({handleClickDetails,statusInformation,paymentInformation,setCancelRequestOrderDetails})=>{
    const [cancelOrders,setCancelOrders]=useState([]);

    useEffect(() => {
        const getCancelOrder = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/cancelStatus`)
                if (res.status === 200) {
                    setCancelOrders(res.data);
                }
            } catch (err) {
                console.log(err);
            }
        }
        getCancelOrder();
    }, [])

    return <>
        {cancelOrders?.length>0 ? (<> {cancelOrders?.reverse()?.map((item) => {
            return <div key={item.order._id}
                        className={`border-l-8  ${item.order.status !== 3 ? "border-primary" : "border-danger"}`}>
                <div className="flex flex-row  gap-2 py-4 text-payneGray border-b-[1.11px]">
                    <p className="basis-[15.09%] cursor-pointer hover:underline  pl-2"
                       onClick={() => {
                           handleClickDetails(item.order)
                       }}
                    > HHP{item.order.conversationId.slice(0, 6)}</p>
                    <p className="basis-[20.45%]">{moment(item.order.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                    <p className="basis-[18.45%]">{statusInformation[item.order.status]}</p>
                    <p className="basis-[18.45%]">{paymentInformation[String(item.order.completed)]}</p>
                    <p className="basis-[10.71%]">{`${new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: item.order.currency,
                        minimumFractionDigits: 2
                    }).format((item.order.price))} `}</p>
                    <p className="basis-[12.84%] flex items-center justify-center  border-[1.11px]
                    border-primary rounded-xl text-primary p-2.5 cursor-pointer"
                       onClick={() => {
                           setCancelRequestOrderDetails(()=>[{"reason":item.reason,"description":item.description}])
                           handleClickDetails(item.order)
                       }}
                    >Detay</p>
                </div>
            </div>
        })}</>):(<div>Henüz İptal isteği yok</div>)}
    </>
}
export default CancellationRequest;