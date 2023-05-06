
import {useState} from 'react';

const CustomerMessages =({topicId,conversation,setCurrentChat,onlineUsers,adminID})=>{
    const [text, setText] = useState('');

    const [selectCustomer,setSelectCustomer]=useState("");

  const newConversation= conversation?.filter((item)=>item.topic === topicId)
    const conversationOnline = newConversation?.map(item => ({
        ...item,
        online: onlineUsers.some(online => online.userId === item.members[0])
    }));
    const filteredConversation = conversationOnline?.filter((conversation) => {
        const conversationValue = conversation.fullName;
        return conversationValue.toLowerCase().includes(text.toLowerCase());
    });
    const handleSelectCustomerClick =(key)=>{
        setSelectCustomer(key)
    }

    return  <div className="max-h-[calc(100vh-6.8rem)]  min-w-[21.047rem] overflow-y-auto mt-4 pr-1">
        <div className="relative text-gray-600 focus-within:text-gray-400 mb-2 ">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                  <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                       viewBox="0 0 24 24" className="w-6 h-6"><path
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
              </span>
            <input type="search" name="search"
                   className="py-2 w-full text-sm text-white bg-gray-900 rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
                   placeholder="Search..." autoComplete="off" onChange={(e)=>setText(e.target.value)}/>
        </div>
            <div className="flex flex-col items-center justify-content  ">
                {filteredConversation?.map((item,index)=>{
                    return   <div key={item?._id}
                                  className={`w-full mt-1 border-l-[1rem] rounded-2xl
                                   ${item.online ? "border-green-400" : "border-danger"} `}
                                 onClick={()=>{handleSelectCustomerClick(index)}}
                    >
                    <div
                                className={`flex justify-between items-center text-lg py-4 cursor-pointer
                                ${index === selectCustomer ? "bg-stateGray hover:bg-cadetGray font-bold ":"bg-white hover:bg-tertiary"}`}
                                onClick={()=>setCurrentChat(item)}
                    >

                            <div className="flex flex-col ml-5 mr-[-1.6rem] ">
                                <span className="mr-10 font-bold whitespace-nowrap">{item?.fullName}</span>
                                <span className="mt-2 text-xs">{item?.userEmail}</span>
                            </div>
                        </div>
                    </div>
                })}

            </div>
        </div>


}
export default CustomerMessages;