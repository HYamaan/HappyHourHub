import Topic from "../../components/customerService/topic";
import CustomerMessages from "../../components/customerService/CustomerMessages";
import Messages from "../../components/customerService/Messages";
import {GiExitDoor} from "react-icons/gi";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import {io} from "socket.io-client"


const CustomerService = () => {
    const [adminID, setAdminID] = useState("");
    const [topicId, setTopicId] = useState("");
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [deleteChatRefresh, setDeleteChatRefresh] = useState(false);
    const scrollRef = useRef();
    //------------------------------------------------------------------------------
    const [socket, setSocket] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const socketInitializer = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/socketio`);
            const newSocket = io();


            newSocket.on("connect", (data) => {
                console.log(data);
                console.log("connected");
                setSocket(newSocket);
            });
            //Send Message SocketIO
            newSocket.on("getMessage", data => {
                setArrivalMessage({
                    senderId: data.senderId,
                    text: data.text,
                    createdAt: Date.now(),
                })
            })
        };
        socketInitializer();
    }, []);
    //Add socketIO adminID
    useEffect(() => {
        if (socket && adminID) {
            socket.emit("addUser", adminID);
            socket.on("getUsers", (users) => {
                setOnlineUsers(users)
            });
        }
    }, [adminID, socket]);
    //Remove customerID SocketIO
    useEffect(() => {
        if (socket && socket.emit && selectedUserId) {
            socket.emit("disconnectUser", selectedUserId);
        }
        setSelectedUserId(null);
    }, [selectedUserId, socket,setCurrentChat]);
    //Send Message SocketIO
    useEffect(() => {
        if (socket) {
            socket.on("getMessage", data => {
                setArrivalMessage({
                    senderId: data.senderId,
                    text: data.text,
                    createdAt: Date.now(),
                })
            })
        }
    }, []);
    //arivalMessage to newMessage
    useEffect(() => {
        if (socket) {

            arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.senderId) &&
            setMessages((prev) => [...prev, arrivalMessage])
        }
    }, [arrivalMessage, currentChat])
    //console.log("CurrentChat", currentChat)
    //console.log("OnlineUser",onlineUsers)

//____________________________________________________________________
    useEffect(() => {
        const getAdminId = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/adminMongoDb`);
                setAdminID(res.data[0]?._id);
            } catch (err) {
                console.log(err);
            }
        }
        getAdminId();
    }, []);
    //GET CONVERSATION FOR ADMIN
    const {data: conversation, refetch} = useQuery({
        queryKey: ["get-Conversation"],
        queryFn: () => {
            return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/conversation/${adminID}`);
        },
        staleTime: 30 * 1000,
        select: (data) => {
            return data.data;
        }
    });
    //GET CONVERSATION ADMIN FOR 20 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        },  1000);

        return () => clearInterval(interval);
    }, [refetch]);

    //GET CUSTOMER MESSAGES
    const {data: currentChatMessage, refetch: currentChatRefetch} = useQuery({
        queryKey: ["get-CurrentMessage"],
        enabled: currentChat?._id.length > 4,
        queryFn: () => {
            return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/${currentChat?._id}`);
        },
        select: (data) => {
            return data.data
        },
        refetchOnMount: true,
        refetchOnWindowFocus: true

    });
    useEffect(() => {
        if (currentChatMessage) {
            currentChatRefetch()
            setMessages(currentChatMessage);
        }
    }, [currentChatMessage,currentChat])
    //SCROLL REF
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            senderId: adminID,
            text: newMessage,
            conversationId: currentChat._id
        }
        const receiverId = currentChat.members.find(member => member !== adminID)
        socket.emit("sendMessage", {
            senderId: adminID,
            receiverId,
            text: newMessage
        });

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages`, message)
            setNewMessage("")
            setMessages((prev) => [...prev, res.data])
        } catch (err) {
            console.log(err);
        }

    }
    const handleKeyDown = (event) => {
        if (event.key === "Enter" && newMessage.trim() !== "") {
            handleSubmit(event);
        }
    };
    const CustomerMessageDelete = async () => {
        try {
            if (confirm("Görüşmeyi sonlandırmak istiyor musunuz ?")) {
                const userId = currentChat.members.find((item) => item !== adminID);
                setSelectedUserId(userId);
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/messages/${currentChat._id}`)
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/conversation/${currentChat._id}`)
                setDeleteChatRefresh(() => !deleteChatRefresh)
                refetch();
                currentChatRefetch();
                setCurrentChat(null);

            }
        } catch (err) {
            console.log(err);
        }
    }
    


    return <>
        <div className="flex flex-row h-[calc(100vh_-_5.5rem)]">

            <div className="basis-2/12 bg-secondary border-r-2 border-r-secondary">
                <Topic
                    setTopicId={setTopicId}
                    setCurrentChat={setCurrentChat}
                />
            </div>
            <div className="basis-3/12 bg-tertiary border-r-2 border-r-yellow-300">
                <CustomerMessages
                    conversation={conversation}
                    topicId={topicId}
                    setCurrentChat={setCurrentChat}
                    adminID={adminID}
                    onlineUsers={onlineUsers}
                />
            </div>
            <div className="basis-7/12 bg-secondary h-full"
            >
                {currentChat ? (<>
                    <div className="flex flex-col justify-between h-full">
                        <div className="px-10 py-3 bg-tertiary  flex flex-row justify-between items-center">
                            <div className="flex flex-col ">
                                <span>{currentChat.fullName}</span>
                                <span>{currentChat.userEmail}</span>
                            </div>
                            <div className="btn-primary flex items-center justify-center gap-2"
                                 onClick={CustomerMessageDelete}
                            >
                                Exit
                                <span className="text-2xl"><GiExitDoor/></span>
                            </div>
                        </div>
                        <div className=" max-h-[calc(100vh-16rem)] overflow-y-auto mt-4 pr-2 scroll-smooth"
                             ref={scrollRef}>
                            {messages.map(m => (

                                <Messages message={m} own={m.sender === adminID} key={m?._id}
                                          className={"text-tertiary"}/>

                            ))}

                        </div>

                        <div className="flex items-center justify-center mb-3">
                        <textarea id="message" name="message" className="w-[80%] h-12 border-2 border-primary mx-2
                        focus:outline-none  resize-none" placeholder="write something..."
                                  onChange={(e) => setNewMessage(e.target.value)}
                                  value={newMessage}
                                  onKeyDown={(e) => handleKeyDown(e)}
                        >
                        </textarea>
                            <button type="submit" className={`mt-2 py-2 btn-primary w-[6rem] `}
                                    onClick={handleSubmit}
                                    onKeyDown={(e) => handleKeyDown(e)}
                            >
                                Send
                            </button>
                        </div>

                    </div>
                </>) : (<span
                    className="absolute  ml-8 top[15rem] text-[3.125rem] opacity-30 text-tertiary  cursor-default">Open a conversation to start a chat.</span>)
                }

            </div>


        </div>
    </>

}
export default CustomerService
