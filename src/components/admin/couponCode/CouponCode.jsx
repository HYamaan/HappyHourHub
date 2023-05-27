import Title from "../../UI/Title";
import React, {useEffect, useState} from "react";
import CreateCouponCode from "./CreateCouponCode";
import axios from "axios";
import moment from "moment";
import Image from "next/image";


const CouponCode = () => {

    const [showCreateCouponCode, setShowCreateCouponCode] = useState(false);
    const [showProductCouponCode,setShowProductCouponCode]=useState(false);
    const [showAmountCouponCode,setShowAmountCouponCode]=useState(true);
    const [products, setProducts] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [couponsWithProduct, setCouponsWithProduct] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const products = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
                if (products.status === 200) {
                    setProducts([])
                    products.data.length > 0 && products.data.map(item => {
                        if (item.stock > 0) {
                            setProducts((prev) => [...prev, {_id: item._id, image: item.image, title: item.title}])
                        }
                    })
                }
            } catch (err) {
                console.log(err);
            }
        }
        getProducts();
    }, [])

    useEffect(() => {
        const getCouponsCode = async () => {
            try {
                const coupon = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/couponCode/get-coupon-code`);
                if (coupon.status === 200) {
                    setCouponsWithProduct([]);
                    setCoupons([]);
                    console.log(coupon.data)
                    coupon.data.map(item => {
                        if (item.hasOwnProperty("productId")) {
                            setCouponsWithProduct((prev) => [...prev, item])
                        } else {
                            setCoupons((prev) => [...prev, item]);
                        }
                    })
                }
            } catch (err) {
                console.log(err);
            }
        }
        getCouponsCode();
    }, [showCreateCouponCode])

    return <>
        <div className="lg:min-w-[1000px] leading-6 tracking-wide ">

            <div className="h-full w-full pl-4 mb-6 font-workSans ">
                <Title className="text-[40px] mt-4  border-b-2 w-[115%]">Coupon Code</Title>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-center w-58 bg-primary px-4 py-2 my-4
             rounded-2xl leading-6 text-left tracking-wide  lg:text-base text-sm cursor-pointer"
                             onClick={() => {
                                 setShowCreateCouponCode(true)
                             }}
                        ><i className="fa-solid fa-plus mr-2"></i> Create Coupon Code
                        </div>
                        <div className="flex items-center justify-between gap-6">
                            <div className={`flex items-center justify-center w-52 px-4 py-2 my-4
             rounded-2xl leading-6 text-left tracking-wide  lg:text-base text-sm cursor-pointer
             ${showAmountCouponCode ? "bg-primaryBold text-tertiary font-semibold" :"bg-primary "}
             `}


                            onClick={()=> {
                                setShowAmountCouponCode(true)
                                setShowProductCouponCode(false)
                            }
                            }
                            >
                                Fiyatlı Kupon Kodu
                            </div>
                            <div className={`flex items-center justify-center w-52 px-4 py-2 my-4
             rounded-2xl leading-6 text-left tracking-wide  lg:text-base text-sm cursor-pointer
             ${showProductCouponCode ? "bg-primaryBold text-tertiary font-semibold" :"bg-primary "}
             `}
                                 onClick={()=> {
                                     setShowAmountCouponCode(false)
                                     setShowProductCouponCode(true)
                                 }}>
                                Ürünlü Kupon Kodu
                            </div>
                        </div>
                    </div>
                { showAmountCouponCode && <div className="lg:w-full w-ful flex  flex-col ">
                    <div className="flex   gap-2 text-[14px] py-4 font-semibold text-cadetGray border-b-[1.11px]">
                        <p className="basis-2/5">Kupon Kodu</p>
                        <p className="basis-1/5">Kupon Yaratılma Tarihi</p>
                        <p className="basis-1/5">Kupon Son Geçerlilik Tarihi</p>
                        <p className="basis-1/5">Kupon Fiyatı</p>

                    </div>
                    <div className={`max-h-[30rem] overflow-y-auto no-scrollbar`}>
                        {coupons.reverse().map((coupon) => {
                            return <div key={coupon._id}>
                                <div className="flex flex-row  gap-2 py-4 text-payneGray border-b-[1.11px]">
                                    <p className="basis-2/5  overflow-x-auto no-scrollbar pl-2">{coupon.code}</p>
                                    <p className="basis-1/5">{moment(coupon.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                                    <p className="basis-1/5">{moment(coupon.expiryDate).format('YYYY-MM-DD HH:mm:ss')}</p>
                                    <p className="basis-1/5"> {new Intl.NumberFormat('tr-TR', {
                                        style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                                    }).format((coupon.discountAmount))}</p>

                                </div>
                            </div>
                        })
                        }
                    </div>
                </div>}
                {showProductCouponCode && <div className="lg:w-full w-ful flex  flex-col ">
                    <div className="flex   gap-2 text-[14px] py-4 font-semibold text-cadetGray border-b-[1.11px]">
                        <p className="basis-1/5">Kupon Kodu</p>
                        <p className="basis-1/5">Kupon Yaratılma Tarihi</p>
                        <p className="basis-1/5">Kupon Son Geçerlilik Tarihi</p>
                        <p className="basis-1/5">Product Image</p>
                        <p className="basis-1/5">Product Title</p>

                    </div>
                    <div className={`max-h-[30rem] overflow-y-auto no-scrollbar`}>
                        {couponsWithProduct.reverse().map((coupon) => {
                            return <div key={coupon._id}>
                                <div className="flex flex-row  gap-2  text-payneGray border-b-[1.11px]">
                                    <p className="basis-1/5  overflow-x-auto no-scrollbar pl-2 py-4">{coupon.code}</p>
                                    <p className="basis-1/5 py-4">{moment(coupon.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                                    <p className="basis-1/5 py-4">{moment(coupon.expiryDate).format('YYYY-MM-DD HH:mm:ss')}</p>
                                    <p className="basis-1/5 mt-2"><Image src={coupon.productId.image}
                                                                         alt={coupon.productId.image.toString()}
                                                                         priority={true}
                                                                         width={65}
                                                                         height={65}
                                                                         style={{objectFit: "cover"}}
                                                                         sizes="w-full h-full"
                                    /></p>
                                    <p className="basis-1/5 my-4">{coupon.productId.title}</p>
                                </div>
                            </div>
                        })
                        }
                    </div>
                </div>}
            </div>


        </div>
        {showCreateCouponCode && <CreateCouponCode
            setShowCreateCouponCode={setShowCreateCouponCode}
            products={products}
        />}
    </>
}
export default CouponCode;