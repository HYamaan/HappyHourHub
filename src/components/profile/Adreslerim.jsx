import React, {useEffect, useState} from "react";

import UploadNewAddresses from "./uploadNewAddress";
import axios from "axios";
import Title from "../UI/Title";

const Addresses = ({ user }) => {
    const [userAddresses,setUserAddresses]=useState([]);
    const [addNewAddress,setAddNewAddress]=useState(false);
    const [updateAddress,setUpdateAddress]=useState("");
    const [isLoading,setIsLoading]=useState(false);


    useEffect(()=>{
        const getUser=async ()=>{
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/userAddress/userId=${user._id}${updateAddress && `/addressId=${updateAddress?._id}`}`
                );
                setUserAddresses(()=>res.data?.address)

            }catch (err){
                console.log(err);
            }
        }
        getUser();
    },[isLoading,user,updateAddress,setUserAddresses]);

    const handleEditingClick=async (addressId)=>{

        try {
            setIsLoading(!isLoading);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/userAddress/userId=${user._id}/addressId=${addressId}`);
            setUpdateAddress(res.data);
            console.log(res.data)
            setAddNewAddress(true)

        }catch (err){
            console.log(err)
        }
    }

    const deleteAddress = async (addressId)=>{

        try {
            setIsLoading(!isLoading)
             await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/userAddress/userId=${user._id}/addressId=${addressId}`);
            setUpdateAddress("");

        }catch (err){

            console.log(err);
        }

    }

    return<>
        {
            !addNewAddress && (
                <div className="w-full ml-5 mt-1  font-workSans">
                    <Title className="text-[40px] mt-4 border-b-2 w-full">Addresses</Title>
                    {userAddresses.length >0 ? (
                        userAddresses.map((address,index)=>(
                            <div key={address._id ? address._id : index} className="flex lg:flex-row flex-col items-center justify-center mt-4 border-b-[1px] border-secondary pb-4 border-opacity-30 ">
                                <div className="flex flex-col items-start gap-[1px] basis-8/12 text-sm font-workSans">
                                    <p className="font-semibold mb-4">{address.addressType}</p>
                                    <p>{user.fullName}</p>
                                    <p>{address.address1}</p>
                                    <p>{`${address.district}, ${address.city}`}</p>
                                    <p>{address.country}</p>
                                    <p>{address.phoneNumber}</p>
                                </div>
                                <div className="flex items-center w-full justify-between basis-5/12">
                                    <div className="flex items-center justify-center gap-2 cursor-pointer ml-5"
                                    onClick={()=>deleteAddress(address._id)}
                                    >
                                        <i className="fa-regular fa-trash-can text-cadetGray"></i>
                                        <span className="text-sm">Adresi Sil</span>
                                    </div>
                                    <div className="justify-items-end py-1.5 px-8 border-2 border-primary rounded-lg text-primaryBold cursor-pointer"
                                         onClick={()=>handleEditingClick(address._id)}
                                    >Düzenle</div>
                                </div>

                            </div>
                        ))
                    ):(   <div className="text-[0.95rem] text-[#212529] py-5">Adres defterinizde henüz kayıtlı bir adresiniz bulunmamaktadır.</div>)}



                    <div className="w-[16.188rem] h-[2.688rem] mt-5 bg-primary hover:bg-primaryBold hover:out-expo uppercase flex items-center
            justify-center rounded-lg cursor-pointer text-xs text-tertiary font-semibold"
                    onClick={()=>setAddNewAddress(!addNewAddress)}
                    >Yeni Adress Ekle</div>
                </div>
            )
        }
        {addNewAddress &&  <UploadNewAddresses user={user} setIsLoading={setIsLoading} isLoading={isLoading}  updateAddress={updateAddress} setAddNewAddress={setAddNewAddress}/>}
    </>
};

export default Addresses;
