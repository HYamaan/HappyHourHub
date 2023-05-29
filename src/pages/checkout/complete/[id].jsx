import axios from "axios";
import {AiFillCheckCircle} from "react-icons/ai";
import {useRouter} from "next/router";
import {useState} from "react";

import AddOrderComment from "../../../components/order/addOrderComment";

const Complete = ({order}) => {

    console.log("order", order)
    const router =useRouter();
    const [isProductModal,setIsProductModal]=useState(false);
    const [showComments,setIsShowComments]=useState(order.isComment);
    const handleClickMyOrderClick=async ()=>{
    await router.push("/profile")
    }
    const handleClickMainPage=async ()=>{
       await router.push("/");
    }
    const handleClickCommentPopUp=async ()=>{
        setIsProductModal(true)

    }

    return <>
      <div className="lg:w-2/6 w-62 lg:mx-auto mx-4 lg:h-[30rem] flex flex-col gap-4 items-center justify-center my-10">
            <div className="flex flex-col gap-4 items-center text-[#5cc465]">
                <p><AiFillCheckCircle className="text-[4rem] "/></p>
                <p className="text-xl font-semibold">Siparişiniz Oluşturuldu!</p>
            </div>
            <div className="text-center">
                <p>
                    <span className="text-lg font-semibold">HHH{order._id.slice(0, 6)}</span>
                    <span className="text-sm ml-2">numaralı siparişiniz başarıyla oluşturuldu!</span>
                </p>
            </div>
            <div className="w-full flex lg:flex-row flex-col items-center justify-between gap-2 ">
                <div className="border-[1.1px] border-primary w-full p-2 rounded-lg text-center text-sm font-semibold text-primary cursor-pointer"
                     onClick={handleClickMyOrderClick}
                >Siparişlerim</div>
                <div className="bg-primary w-full p-2 rounded-lg text-center text-sm font-semibold text-tertiary cursor-pointer"
                     onClick={handleClickMainPage}
                >Ana Sayfaya Git</div>
                {  !showComments &&  <div
                    className="border-[1.1px] border-primary w-full p-2 rounded-lg text-center text-sm font-semibold text-primary cursor-pointer"
                    onClick={handleClickCommentPopUp}
                >Yorum Yap</div>}

            </div>
          {isProductModal && (<AddOrderComment userEmail={order.email} setIsProductModal={setIsProductModal} setIsShowComments={setIsShowComments} orderId={order._id}/>)}
        </div>

    </>
}

export const getServerSideProps = async ({params}) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders?paymentId=${params.id}`);
    return {
        props: {
            order: res.data ? res.data[0] : [],
        }
    }
}
export default Complete;