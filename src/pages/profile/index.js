import React, {useEffect} from "react";
import {getSession, useSession} from "next-auth/react";
import {Router} from "next/router";
import axios from "axios";

const Profile =()=>{
    const {status,data}=useSession();
    useEffect(()=>{
        if(status === "unauthenticated") Router.replace("/auth/login");
    },[status]);

}

export async function getServerSideProps({req}) {
    const session = await getSession({req});

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    const user = res.data?.find((user) => user.email === session?.user.email);

    if (session && user) {
        return {
            redirect: {
                destination: "/profile/" + user._id,
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };

}

export default Profile;
