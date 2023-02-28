import React from "react";
import Image from "next/image";
import Title from "../../components/UI/Title";
import {useSelector,useDispatch} from "react-redux";
import {cartActions} from "../../redux/cartSlice";


const Cart = () => {
    const dispatch=useDispatch();
    const cart = useSelector(state=>state.cart);
    console.log("cart",cart)

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
                          <tr className=" border-b border-gray-700 bg-secondary
                    hover:bg-primary hover:border-primary transition-all " key={index}>
                              <td className="py-2 px-6 font-medium whitespace-nowrap hover:text-white flex items-center justify-center gap-x-2">
                                  <Image
                                      src={product.image}
                                      alt={product.image}
                                      width={50}
                                      height={50}
                                      priority={true}
                                  /> <span>{product.title}</span></td>
                              <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                  {product.extras.map(item=><span key={item._id}>{item.text}</span>)}</td>
                              <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">${product.price}</td>
                              <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">1</td>
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
                <button className="btn-primary mt-4 md:w-auto w-52 text-center self-center" onClick={()=>dispatch(cartActions.reset())}>CHECKOUT NOW!</button>
            </div>
        </div>
    </div>
}

export default Cart;