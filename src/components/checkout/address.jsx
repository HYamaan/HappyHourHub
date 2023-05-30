import React, {useEffect, useRef, useState} from "react";
import {AiFillCheckCircle, AiOutlineCheckCircle} from "react-icons/ai";
import {FiEdit,FiTrash} from "react-icons/fi";
import {CiTrash} from "react-icons/ci";
import {RxCircle} from "react-icons/rx";
import axios from "axios";
import UploadNewAddresses from "../profile/MyAddress/uploadNewAddress";
import {useDispatch} from "react-redux";
import {ShoppingOrderActions} from "../../redux/shoppingOrder";



const CheckOutAddress = ({
                             userId,
                             setCheckOutAddressInformation,
                             setCheckOutPaymentInformation,
                             isLoading,
                             setIsLoading,
                             addressSectionRef,
                             setCompleteAddress
                         }) => {


    const dispatch = useDispatch();
    const [isOnMouseEnteredTrash, setOnMouseLeaveTrash] = useState(-1);
    const [isOnMouseEnteredEdit, setOnMouseLeaveEdit] = useState(-1);
    const [isCheckCargoAddress, setIsCheckCargoAddress] = useState(-1);
    const [getCargoAddress, setGetCargoAddress] = useState({});
    const [isCheckE_invoice, setIsCheckE_invoice] = useState(-1);
    const [getE_invoice, setGetE_invoice] = useState({});

    const [userAddresses, setUserAddresses] = useState([]);
    const [addNewAddress, setAddNewAddress] = useState(false);
    const [updateAddress, setUpdateAddress] = useState("");

    const newAddressSectionRef = useRef(null);
    const [buttonDisable,setButtonDisable]=useState(true);



    useEffect(() => {

        if((isCheckCargoAddress !== -1) && (isCheckE_invoice !== -1)){

            setButtonDisable(false);
        }else{
            setButtonDisable(true);
        }
    }, [isCheckE_invoice, isCheckCargoAddress])

    useEffect(() => {
        if (addNewAddress === true) {
            if (newAddressSectionRef.current) {
                newAddressSectionRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        } else {
            if (addressSectionRef.current) {
                addressSectionRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }

    }, [addNewAddress]);

    useEffect(() => {
        setCompleteAddress(false);
        const getUser = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/userAddress/userId=${userId}`
                );
                setUserAddresses(() => res.data?.address)
                setIsLoading(false)
            } catch (err) {
                console.log(err);
            }
        }
        getUser();
    }, [setIsLoading,isLoading, userId]);


    const handleEditingClick = async (addressId) => {
        setIsLoading(true);
        setTimeout(async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/userAddress/userId=${userId}/addressId=${addressId}`);
                setAddNewAddress(true)
                setUpdateAddress(res.data);

            } catch (err) {
                console.log(err)
            }
        }, 1000);
    }
    const deleteAddress = async (addressId) => {

        setTimeout(async () => {
            setIsLoading(true);
            try {
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/userAddress/userId=${userId}/addressId=${addressId}`);
                setUpdateAddress("");

            } catch (err) {

                console.log(err);
            }
        }, 1000);
    }

    const handleCompleteOrder = () => {
        if(isCheckCargoAddress !== "-1" && isCheckE_invoice !== "-1"){
            setCheckOutAddressInformation(false);
            setCheckOutPaymentInformation(true)
            setCompleteAddress(true);
            dispatch(ShoppingOrderActions.addShoppingOrder({...getE_invoice, ...getCargoAddress}))
        }
    };

    const onClickCargoAddress = (mapAddress, index) => {

        setGetCargoAddress( {
            cargoAddress: {
                name:mapAddress.customerFullName.split(" ")[0],
                surName:mapAddress.customerFullName.split(" ")[1],
                email:mapAddress.addressEmail,
                address: mapAddress.address1,
                district: mapAddress.district,
                city: mapAddress.city,
                country: mapAddress.country,
                phoneNumber: mapAddress.phoneNumber
            }
        });
        setIsCheckCargoAddress(index)
    }
    const onClickE_Invoice = (mapAddress, index) => {

        setGetE_invoice( {
            e_invoice: {
                name:mapAddress.customerFullName.split(" ")[0],
                surName:mapAddress.customerFullName.split(" ")[1],
                email:mapAddress.addressEmail,
                address: mapAddress.address1,
                district: mapAddress.district,
                city: mapAddress.city,
                country: mapAddress.country,
                phoneNumber: mapAddress.phoneNumber
            }
        });
        setIsCheckE_invoice(index)
    }

    return <div >
        <div
            className="lg:grid hidden gap-3 lg:grid-cols-[12.939rem,6.095rem,6.345rem,8.853rem,8.979rem] h-[5.158rem] text-[0.75rem] pb-5 border-b-2 text-sm font-semibold ">
            <div className="place-self-start pt-5 px-4">Adreslerim</div>
            <div className="place-self-center pt-5 px-4 ml-3">Kargo Adresi</div>
            <div className="place-self-center pt-5 px-4 ml-3">Fatura Adresi</div>
        </div>

        {userAddresses.map((mapAddress, index) => {
            return <div key={mapAddress._id} className="w-full grid lg:grid-cols-[12.939rem,7.095rem,7.345rem,9.853rem,8.979rem]
                 lg:grid-rows-1  grid-cols-4 place-items-start
              mt-4 text-sm  border-b-2">
                <div className="place-self-start lg:pt-5 p-2.5 lg:col-span-1 col-span-full">
                    <div className="flex flex-col items-start gap-[4px] text-sm font-workSans font-light">
                        {/*<p className="font-semibold mb-4">Ev</p>*/}
                        <p className="font-semibold">{mapAddress.customerFullName}</p>
                        <p> {mapAddress.address1}</p>
                        <p>{mapAddress.district}, {mapAddress.city}</p>
                        <p>{mapAddress.country}</p>
                        <p>{mapAddress.phoneNumber}</p>
                    </div>
                </div>
                {/*adress bölümünde adress kısmı bulunuyorsa check olması gerekli bulunmuyorsa non-check*/}

                <div className="place-self-start w-full  lg:pt-5 p-2.5"
                     onClick={() => onClickCargoAddress(mapAddress, index)}>
                    <div className="w-full flex items-center justify-center gap-2" >
                        {(isCheckCargoAddress === index) ? (
                             <>
                                 <AiFillCheckCircle className="text-primaryBold text-xl lg:hidden"/>
                                 <AiOutlineCheckCircle className="text-primaryBold text-xl lg:block hidden"/>
                             </> )
                            : (<RxCircle className="text-payneGray text-xl"/>)}
                        <span className="lg:hidden block text-xs">Kargo</span>
                    </div>
                </div>

                <div className="place-self-start  w-full lg:pt-5 p-2.5 "
                     onClick={() => onClickE_Invoice(mapAddress, index)}>
                    <div className=" w-full flex items-center justify-center gap-2">{
                        (isCheckE_invoice === index) ?
                            (    <>
                                <AiFillCheckCircle className="text-primaryBold text-xl lg:hidden"/>
                                <AiOutlineCheckCircle className="text-primaryBold text-xl lg:block hidden"/>
                            </>) :
                            (<RxCircle className="text-payneGray text-xl"/>)}
                        <span className="lg:hidden block text-xs">Fatura</span>
                    </div>
                </div>

                <div className="place-self-start  lg:p-5 p-2.5 text-payneGray  cursor-pointer"
                     onMouseLeave={() => setOnMouseLeaveEdit(-1)}
                     onMouseEnter={() => setOnMouseLeaveEdit(index)}
                >
                    <div className="  flex lg:items-center items-end justify-center gap-1 align-baseline"
                         onClick={() => handleEditingClick(mapAddress._id)}
                    >
                        <FiEdit className="lg:text-2xl text-xl lg:ml-4 text-payneGray font-light "/>
                        <span className="lg:flex hidden">
                            {(isOnMouseEnteredEdit === index) && <span>Düzenle</span>}
                        </span>
                        <div className="lg:hidden flex ">
                            <span className="text-xs ">Düzenle</span>
                        </div>
                    </div>
                </div>

                <div className={`place-self-start lg:pt-5 p-2.5 text-frenchGray  lg:ml-0 ml-6 
                 ${isCheckCargoAddress === index || isCheckE_invoice === index ? "text-frenchGray !cursor-not-allowed" :"text-payneGray cursor-pointer" }`}

                     onMouseLeave={() => setOnMouseLeaveTrash(-1)}
                     onMouseEnter={() => setOnMouseLeaveTrash(index)}
                     onClick={() => deleteAddress(mapAddress._id)}
                >
                    <div className="  flex lg:items-center items-end justify-center gap-1  align-baseline "
                    >
                        <CiTrash
                            className={`lg:text-2xl text-xl lg:ml-4 `}
                        />
                        <span className="lg:flex hidden">
                            {(isOnMouseEnteredTrash === index) && <span>Sil</span>}
                                 </span>
                        <div className="lg:hidden flex">
                            <span className="text-xs">Sil</span>
                        </div>

                    </div>

                </div>

            </div>

        })}

        <div className="mt-5 pb-5 border-b-2">
            <div className="flex items-center justify-between w-full lg:gap-12 gap-6 ">
                <button className="basis-1/2 flex justify-center uppercase py-3 lg:px-10  bg-transparent lg:border-2 border-[1px] border-primary
                 cursor-pointer rounded-lg lg:text-sm text-xs  text-primary lg:font-semibold tracking-wide outline-0
                 focus:outline focus:outline-offset-[1.5px] focus:outline-4"
                        onClick={() => setAddNewAddress(true)}
                > Yeni Adress Ekle
                </button>
                <button className={`basis-1/2 flex justify-center uppercase py-3 lg:px-10  
                 rounded-lg lg:text-sm text-xs  text-tertiary lg:font-semibold tracking-wide ${buttonDisable ? "bg-stateGray cursor-not-allowed" : "bg-primary hover:bg-primaryBold cursor-pointer"}`}
                        onClick={() => handleCompleteOrder()}
                        disabled={buttonDisable}
                > Siparişi Tamamla
                </button>
            </div>

            {addNewAddress && (<>
                <div className="lg:p-4 lg:mt-0 mt-5 font-semibold text-lg " ref={newAddressSectionRef}>Adres Formu
                </div>
                <UploadNewAddresses
                    user={{_id: userId}}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    updateAddress={updateAddress}
                    setAddNewAddress={setAddNewAddress}
                    setUpdateAddress={setUpdateAddress}
                    checkout={true}
                />
            </>)}

        </div>

    </div>
}
export default CheckOutAddress;
