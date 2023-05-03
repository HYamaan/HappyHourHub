import {useQuery} from "@tanstack/react-query";
import axios from "axios";


export const useGetOrdersData = (currentUser)=>{
    return useQuery({
        queryKey:['get-Orders'],
        enabled:currentUser.email !==undefined,
        queryFn : () => {
            return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/""?email=${currentUser.email}`);
        }
    });
}