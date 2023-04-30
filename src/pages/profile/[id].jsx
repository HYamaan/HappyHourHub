import React, {useEffect, useState} from "react";

import Image from "next/image";
import Account from "../../components/profile/Account";
import Password from "../../components/profile/Password";
import Order from "../../components/profile/Order";
import UploadImage from "../../components/profile/UploadImage";
import {getSession, signOut} from "next-auth/react";
import {useRouter} from "next/router";
import axios from "axios";
import {toast} from "react-toastify";




const Profile = ({ user }) => {
    const  [uploadImageShow,setUploadImageShow]=useState(false);
    const  [uploadImageArr,setUploadImageArr]=useState(user);

    const [tabs, setTabs] = useState(0);
    const { push } = useRouter();
    useEffect(()=> {
        const getImage=async ()=>{
            user = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}`);
            setUploadImageArr(user.data);
        }
        getImage();
    },[uploadImageShow]);
    const handleSignOut =  async () => {
        if (confirm("Are you sure you want to sign out?")) {
            toast.success("You have successfully exited.")
             await signOut({ redirect: false });
             await push("/auth/login");
        }
    };


    return (<>
        <div className="flex px-10 min-h-[calc(100vh_-_233px)] lg:flex-row flex-col lg:mb-0 mb-10">
            <div className="lg:w-80 w-100 flex-shrink-0">
                <div className="relative flex flex-col items-center px-10 py-5 border border-b-0">
                        <Image
                            src={uploadImageArr?.image ? uploadImageArr.image : "/images/client2.jpg"}
                            alt={uploadImageArr?.image ? uploadImageArr.image : "/images/client2.jpg"}
                            width={100}
                            height={100}
                            style={{objectFit:"cover"}}
                            priority={true}
                            className="rounded-full cursor-pointer hover:opacity-50"
                            onClick={()=>setUploadImageShow(!uploadImageShow)}
                        />
                    <b className="text-2xl mt-1">{user?.fullName}</b>
                </div>
                <ul className="text-center font-semibold">
                    <li
                        className={`border w-full p-3 cursor-pointer 
                        hover:bg-primary hover:text-white transition-all ${
                            tabs === 0 && "bg-primary text-white"
                        }`}
                        onClick={() => setTabs(0)}
                    >
                        <i className="fa fa-home"></i>
                        <button className="ml-1 ">Account</button>
                    </li>
                    <li
                        className={`border border-t-0 w-full p-3 cursor-pointer 
                        hover:bg-primary hover:text-white transition-all ${
                            tabs === 1 && "bg-primary text-white"
                        }`}
                        onClick={() => setTabs(1)}
                    >
                        <i className="fa fa-key"></i>
                        <button className="ml-1">Password</button>
                    </li>
                    <li
                        className={`border border-t-0 w-full p-3 cursor-pointer
                         hover:bg-primary hover:text-white transition-all ${
                            tabs === 2 && "bg-primary text-white"
                        }`}
                        onClick={() => setTabs(2)}
                    >
                        <i className="fa fa-motorcycle"></i>
                        <button className="ml-1">Orders</button>
                    </li>
                    <li
                        className={`border border-t-0 w-full p-3 cursor-pointer
                         hover:bg-primary hover:text-white transition-all`}
                        onClick={handleSignOut}
                    >
                        <i className="fa fa-sign-out"></i>
                        <button className="ml-1">Exit</button>
                    </li>
                </ul>
            </div>
            {tabs === 0 && <Account user={user} />}
            {tabs === 1 && <Password user={user} />}
            {tabs === 2 && <Order />}
        </div>
            {
                uploadImageShow &&
                <UploadImage setUploadImageShow={setUploadImageShow} user={user}/>
            }
        </>
    );
};

export async function getServerSideProps({ req,query:{id}}) {
    const session = await getSession({ req })
    if(session){
        const user = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`
        );

        return {
            props: {
                user: user?.data ? user.data : null,
            },
        };
    }
    return {
        redirect: {
            destination: "/auth/login",
            permanent: false,
        },
    };
}

export default Profile;