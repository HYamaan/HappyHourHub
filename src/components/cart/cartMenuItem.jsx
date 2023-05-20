import Slider from "react-slick";

import MenuItem from "../products/MenuItem";
import {useEffect, useState} from "react";
import axios from "axios";
import {useSession} from "next-auth/react";
import {useSelector} from "react-redux";

const CartMenuItem = ({productList}) => {
    const {data: session} = useSession();
    const [likes, setLikes] = useState([]);
    const cart = useSelector(state => state.cart);
    const [mostRepeatProducts, setMostRepeatProducts] = useState([]);

    useEffect(() => {
        const getFavoriteProducts = async () => {
            try {
                const queryParams = `userId=${session?.user.id}`;
                const url = `${process.env.NEXT_PUBLIC_API_URL}/userProductList/user-favorite-list/${queryParams}`;
                if (session) {
                    const res = await axios.get(url);
                    setLikes(res.data?.products.map(item => item._id))

                }

            } catch (err) {
                console.log(err);
            }
        }
        getFavoriteProducts();
    }, [session, setLikes])
    console.log(JSON.parse(JSON.parse(localStorage.getItem("persist:root")).cart))
    const categories = cart.products.map((item) => item.category);
    const counts = {};

    categories.forEach((category) => {
        counts[category] = counts[category] ? counts[category] + 1 : 1;
    });

    let mostRepeatedCategory = null;
    let maxCount = 0;

    for (const category in counts) {
        if (counts[category] > maxCount) {
            maxCount = counts[category];
            mostRepeatedCategory = category;
        }
    }


    useEffect(() => {
        const getProducts = async () => {
            try {
                if (mostRepeatedCategory) {
                    console.log(mostRepeatedCategory)
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=10&mostRepeatedCategory=${mostRepeatedCategory}`)
                    console.log("res", res);
                    setMostRepeatProducts(res.data);
                }
            } catch (err) {
                console.log(err);
            }
        }
        getProducts();
    }, [cart])


    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1140,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: false,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const SliderComponent=(itemList)=>{
        return   <Slider {...settings} >
            {itemList.map(product => {
                return <div key={product._id} className="px-5 pb-4 z-0">
                    <MenuItem
                        {...product}
                        setLikes={setLikes}
                        likeProd={likes}/>
                </div>
            })}
        </Slider>
    }

    return <div className="w-full ">
        <div>
            <div className="w-full h-full  flex items-center justify-center text-2xl font-workSans mb-3 ">Sepete EnÇok Eklenenler</div>
            {SliderComponent(productList)}
        </div>
        {
            mostRepeatedCategory && (
                <div>
                <div className="w-full h-full mt-20 flex items-center justify-center text-2xl font-workSans mb-3 ">Önerilen Ürünler</div>
                    {SliderComponent(mostRepeatProducts)}
            </div>
            )
        }

    </div>

}
export default CartMenuItem;