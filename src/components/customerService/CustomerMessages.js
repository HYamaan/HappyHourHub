
import { useRef} from 'react';
const CustomerMessages =({topicId,conversation,setCurrentChat})=>{

    const inputRef = useRef(null);



  const newConversation= conversation?.filter((item)=>item.topic === topicId)


    return  <div className="max-h-[calc(100vh-6.8rem)]  min-w-[21.047rem] overflow-y-auto mt-4 pr-1">
            <div className="flex items-center m-2">
                <input
                    className="  border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    type="text" placeholder="Kullancı ismini veya mail ara"
                    ref={inputRef}
                />
                <i className="fas fa-paper-plane"></i>
            </div>
            <div className="flex flex-col items-center justify-content  ">
                {newConversation?.map((item)=>{
                    return <div key={item?._id}  className="flex justify-between items-center w-full text-lg bg-white hover:bg-tertiary mt-1 py-4 cursor-pointer"
                                onClick={()=>setCurrentChat(item)}
                    >
                    <div className="flex flex-col ml-5 mr-[-1.6rem]">
                    <span className="mr-10 font-bold whitespace-nowrap">{item?.fullName}</span>
                    <span className="mt-2 text-xs">{item?.userEmail}</span>
                    </div>
                {/*    <div className="place-self-center mb-5 mr-2 text-sm max-w-[11rem]">*/}
                {/*{ item?.message?.slice(0,20)+ `${item?.message?.length <20 ? "" : "..."}`}*/}
                {/*    </div>*/}
                    </div>
                })}

            </div>
        </div>


}
export default CustomerMessages;