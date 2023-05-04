import { Server } from 'socket.io'
const SocketHandler = (req, res) => {
    let users=[];
    const addUser = (userId,socketId)=>{
        !users.some(user=>user.userId===userId) && users.push({userId,socketId});
    }
    const removeUser = (socketId)=>{
        users = users.filter(user => user.socketId !== socketId);
    }
    const getUser = (userId)=>{
        return users.find(user => user.userId === userId)
    }
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io

        io.on('connection', socket => {
            console.log("a user connected")

            //take userId and socketId from user
            socket.on("addUser",(userId)=>{
                console.log("users",userId)
                addUser(userId,socket.id);
                io.emit("getUsers",users);
            });

            //send and get message
            // socket.on("sendMessage",({senderId,reciverId,text})=>{
            //     const user= getUser(senderId); //reciverId
            //     io.to(user?.socket).emit("getMessage",{
            //         senderId,text
            //     })
            // })

            //when disconnect
            socket.on("disconnect",()=>{
                removeUser(socket.id)
                console.log("a user disconnected",socket.id);
                io.emit("getUsers",users);
            });


            socket.on('input-change', msg => {
                socket.broadcast.emit('update-input', msg)
            })
        })
    }
    res.end()
}
export default SocketHandler