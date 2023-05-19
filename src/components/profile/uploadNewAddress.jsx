import React, {useEffect, useState} from "react";
import dataCity from "../../libs/countryData/CityAndDistrictData.json";
import axios from "axios";
import {toast} from "react-toastify";
import {useFormik} from "formik";
import {addAddresses} from "../../schema/addAddresses";

import Input from "../form/Input";


const UploadNewAddresses=(props)=>{

    const [country,setCountry]=useState([{id:1,name:"Türkiye"}]);
    const [countryText,setCountryText]=useState(props.updateAddress?.country|| "");
    const [city,setCity]=useState([]);
    const [cityText,setCityText]=useState(props.updateAddress?.city || "");
    const [district,setDistrict]=useState([]);
    const [districtText,setDistrictText]=useState(props.updateAddress?.district || "");


    useEffect(()=>{
        const getCityAndDistrict=async ()=>{
            if(countryText==="Türkiye"){
                setCity([]);
                setDistrict([]);
                dataCity.data.map(item=>{
                    setCity((prev)=>[...prev,{alan_kodu:item.alan_kodu,city:item.il_adi}])
                })


                if(cityText && cityText !== "city"){
                    const districtCity =dataCity.data.find(item=>item.il_adi === cityText)
                    JSON.stringify(districtCity);

                    districtCity &&  districtCity.ilceler.map(item=>
                        setDistrict((prev=>[...prev,{ilce_kodu:item.ilce_kodu,ilce_adi:item.ilce_adi}])));
                }else{
                    setDistrict([]);
                }
            }else{
                setCity(()=>[]);
                setDistrict([]);
            }
        };
        getCityAndDistrict();
    },[countryText,cityText,districtText]);

    const onSubmit = async (values, actions) => {
        try { if (!countryText || countryText === "Ülke Seçiniz") {
            actions.setFieldError("country", "Please select a country");
            return;
        }
            if (!cityText || cityText === "city") {
                actions.setFieldError("city", "Please select a city");
                return;
            }
            if (!districtText || districtText === "districtCity") {
                actions.setFieldError("district", "Please select a district");
                return;
            }
            values.phoneNumber= values.phoneNumber.replace(/[^\d]/g, '');
            const newValues = {
                addressType:values.caption,
                customerFullName:values.customerFullName,
                country: countryText,
                city: cityText,
                district: districtText,
                email:values.email,
                phoneNumber:values.phoneNumber,
                address1:values.address
            };
            console.log("props.updateAddress",props.updateAddress)
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/userAddress/userId=${props.user._id}${props.updateAddress && `/addressId=${props.updateAddress?._id}`}`,
                {
                   newValues
                }
            );
            if(res.status===200){
                props.setIsLoading(!props.isLoading)
                toast.success("Profile successfuly updated")
                props.setAddNewAddress(false)

            }

        } catch (err) {
            console.log(err);
        }

    };

    const { values, errors, touched, handleSubmit, handleChange, handleBlur } =
        useFormik({
            enableReinitialize: true,
            initialValues: {
                caption: props.updateAddress?.addressType || "",
                customerFullName: props.updateAddress?.customerFullName || "",
                phoneNumber: props.updateAddress?.phoneNumber || "",
                email:props.updateAddress?.addressEmail || "",
                address:props.updateAddress?.address1 || ""

            },
            onSubmit,
            validationSchema: addAddresses,
        });



    return (  <>
            <form className="lg:p-4 flex-1 lg:mt-0 mt-3.5" onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-4">
                    <Input id={1}
                           name="caption"
                           type="text"
                           placeholder="Caption"
                           value={values.caption}
                           onChange={handleChange}
                           onBlur={handleBlur}
                           errorMessage={errors.caption}
                           touched={touched.caption}
                           className="col-span-2"
                    />
                    <Input
                        id={2}
                        name="customerFullName"
                        type="text"
                        placeholder="Your Full Name"
                        value={values.customerFullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errorMessage={errors.customerFullName}
                        touched={touched.customerFullName}
                        className="col-span-2"
                    />
                    <Input
                        id={3}
                        name="email"
                        type="text"
                        placeholder="Your E-mail"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errorMessage={errors.email}
                        touched={touched.email}
                        className="lg:col-span-1 col-span-2"
                    />
                    <Input
                        id={4}
                        name="phoneNumber"
                        type="tel"
                        mask="(999) 999 9999"
                        placeholder="Your Phone Number"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errorMessage={errors.phoneNumber}
                        touched={touched.phoneNumber}
                        className="lg:col-span-1 col-span-2"
                    />

                    <div className="flex items-centre justify-between lg:flex-row flex-col  w-full col-span-2 gap-4">

                        <div className="w-full">
                            <select id="select"
                                    value={countryText}
                                    onChange={(e)=>setCountryText(e.target.value)}
                                    className="block w-full p-4 bg-gray border-gray-300 rounded-md shadow-sm focus:outline-none
                                  focus:ring-opacity-50 shadow-2xl shadow-primary"

                            >
                                <option key={1} value="Ülke Seçiniz">Ülke Seçiniz</option>
                                {country.map((option) => (
                                    <option key={option.id} value={option.name}>
                                        {option.name}
                                    </option>
                                ))}

                            </select>
                            {countryText === "Ülke Seçiniz" && <p className="text-danger text-sm">Please select a country</p>}

                        </div>

                        <div className="w-full">
                            <select id="select" value={cityText} onChange={(e)=>setCityText(e.target.value)}
                                    className="block w-full p-4 bg-gray border-gray-300 rounded-md shadow-sm focus:outline-none
                                  focus:ring-opacity-50 shadow-2xl shadow-primary"
                            >
                                <option key={0} value="city">
                                    Şehir Seçiniz
                                </option>
                                {  city.length>0 && (city.map((option) => (
                                    <option key={option.alan_kodu} value={option.city}>
                                        {option.city}
                                    </option>
                                )))
                                }
                            </select>
                            {cityText === "city" && <p className="text-danger text-sm">Please select a city</p>}
                        </div>

                        <div className="w-full">
                            <select id="select" value={districtText} onChange={(e)=>setDistrictText(e.target.value)}
                                    className="block w-full p-4 bg-gray border-gray-300 rounded-md shadow-sm focus:outline-none
                                  focus:ring-opacity-50 shadow-2xl shadow-primary"
                            >
                                <option key={0} value="districtCity">
                                    İlçe Seçiniz
                                </option>
                                {  district.length>0 && (district.map((option) => (
                                    <option key={option.ilce_kodu} value={option.ilce_adi}>
                                        {option.ilce_adi}
                                    </option>
                                )))
                                }
                            </select>
                            {districtText === "districtCity" && <p className="text-danger text-sm">Please select a district</p>}
                        </div>
                    </div>
                    <Input id={5}
                           name="address"
                           type="text"
                           placeholder="Address"
                           value={values.address}
                           onChange={handleChange}
                           onBlur={handleBlur}
                           errorMessage={errors.address}
                           touched={touched.address}
                           className="col-span-2"
                    />


                </div>
                {props.checkout ? (
                    <>

                            <div className="flex items-center justify-between gap-8 mt-6">
                                <div className="basis-1/2 flex justify-center uppercase py-3 px-10 bg-transparent border-2 border-primary
                             cursor-pointer rounded-lg text-sm  text-primary font-semibold tracking-wide outline-0"
                                        onClick={()=> {
                                            props.setUpdateAddress("");
                                            props.setAddNewAddress(false)
                                        }}

                                > Vazgeç</div>

                                <button className=" basis-1/2 bg-primary hover:bg-primaryBold hover:ease-in w-[18.438rem]
                 h-[2.688rem] px-[1rem] py-[0.65rem]  rounded-lg text-tertiary font-semibold text-sm" type="submit">
                                    KAYDET
                                </button>
                            </div>

                    </>
                ) : ( <button className="  bg-primary hover:bg-primaryBold hover:ease-in w-[18.438rem]
                 h-[2.688rem] px-[1rem] py-[0.65rem] mt-6 rounded-lg text-tertiary font-semibold text-sm" type="submit">
                    KAYDET
                </button>)

                }
            </form>
    </> );

}
export default UploadNewAddresses