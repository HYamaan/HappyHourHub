import React from "react";
import Reservation from "../../components/Reservation";
import ChatBox from "../../components/layout/ChatBox";


const ReservationIndex=()=>{
    return <React.Fragment>
        <div className="mt-10">
            <Reservation/>
        </div>
        <ChatBox/>
    </React.Fragment>
}
export default ReservationIndex;