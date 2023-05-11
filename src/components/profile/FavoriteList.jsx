import axios from "axios";
import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import Title from "../UI/Title";
import {toast} from "react-toastify";


const FavoriteList = ({user}) => {
    const [likes, setLikes] = useState([]);
    const router = useRouter();
    const [isLoading,setIsLoading]=useState(false);
    useEffect(() => {
        const getFavoriteProducts = async () => {
            try {
                const queryParams = `userId=${user._id}`;
                const url = `${process.env.NEXT_PUBLIC_API_URL}/userFavoriteListapi/${queryParams}`;
                if (user) {
                    const res = await axios.get(url);
                    setLikes(res.data.products)
                }
            } catch (err) {
                console.log(err);
            }
        }
        getFavoriteProducts();
    }, [user, setLikes,isLoading])

    console.log("PROD", likes)
    const productPageHandler = async (productId) => {
       await router.push(`/product/${productId}`)
    }
    const deleteProductLike= async (productId)=>{
        const queryParams = `userId=${user._id}/productId=${productId}`;
        const url = `${process.env.NEXT_PUBLIC_API_URL}/userFavoriteListapi/${queryParams}`;
        try {
            setIsLoading(true);
            const res=await axios.delete(url);
            setIsLoading(false);
            if(res.status===200){
                toast.success("The product has been successfully removed")
            }
        }catch (err){
            console.log(err);
        }
    }

    return <>
        <div className="h-full w-full pl-4 mb-6 font-workSans">
        <Title className="text-[40px] mt-4  border-b-2 w-full">Favorite List</Title>
        {likes.length > 0 ?
            (
                likes.map(product=>{
                    return  <div key={product._id} className="flex flex-col items-center w-full pb-4 border-b-2">
                        <div className="flex mt-4 w-full h-[5.5rem] gap-4">
                            <div className="flex items-center justify-center md:basis-1/5 basis-3/12  w-full ">
                                <Image
                                    src={product?.image}
                                    alt="client1.jpg"
                                    width={100}
                                    height={100}
                                    priority={true}
                                    className="rounded-full cursor-pointer "
                                    onClick={()=>productPageHandler(product._id)}
                                />
                            </div>
                            <div className="md:basis-4/5 basis-9/12 ml-2 flex items-start md:flex-row flex-col  md:justify-between h-full w-full h-full">
                                <div className=" text-stateGray text-sm">
                                    <span className="capitalize">{product.title}</span>
                                    <span> - </span>
                                    <span className="capitalize">{product.category}</span>
                                </div>
                                <div className="flex md:flex-col flex-row
                                      md:items-center  md:justify-between md:h-full ">
                                    <div
                                        className="flex items-center justify-center w-full md:items-end md:flex-col flex-row md:gap-1 gap-4">

                                    <span
                                        className="line-through text-base md:text-sm text-cadetGray">{new Intl.NumberFormat('tr-TR', {
                                        style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                                    }).format((product.prices[0] * 111.43 / 100))}₺
                                    </span>
                                        <span
                                            className="font-semibold font-workSans text-base md:text-[1.2rem] text-primary">
                                                {new Intl.NumberFormat('tr-TR', {
                                                    style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                                                }).format((product.prices[0]))}₺
                                        </span>
                                    </div>
                                </div>
                            </div>


                        </div>
                        <div className=" w-full mt-4 grid grid-cols-7 grid-rows-1  ">
                            <div className="md:col-start-4 md:col-end-5 md:justify-self-end col-start-2 col-end-4 justify-self-start   self-center
                                  cursor-pointer">
                                <i className="fa-solid fa-trash-can text-stateGray mr-2"></i>
                                <span className="text-secondary text-sm"
                                      onClick={()=>{deleteProductLike(product._id)}}
                                >Ürünü Sil</span>
                            </div>
                            <div className="grid md:col-start-6 md:col-end-8 col-start-5 col-end-8 place-content-center
                                md:px-16 py-2  rounded-xl bg-primary hover:bg-primaryBold uppercase cursor-pointer
                                text-tertiary font-semibold text-sm"
                                 onClick={()=>productPageHandler(product._id)}
                            >ürüne git</div>
                        </div>
                    </div>
                })


        ) : (<div>Şu anda ürün bulunmuyor</div>)}
        </div>
    </>


}
export default FavoriteList;