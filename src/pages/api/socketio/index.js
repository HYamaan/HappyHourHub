import {Server} from 'socket.io'

const SocketHandler = (req, res) => {
    let users = [];
    const addUser = (userId, socketId) => {
        !users.some(user => user.userId === userId) && users.push({userId, socketId});
    }
    const removeUser = (socketId) => {
        users = users.filter(user => user.socketId !== socketId);
    }
    const getUser = (userId) => {
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
            socket.on("addUser", userId => {

                addUser(userId, socket.id);
                io.emit("getUsers", users)
            });
            //send and get message
            socket.on("sendMessage", ({senderId, receiverId, text}) => {
                const user = getUser(receiverId);
                if (user && user.socketId) {
                    io.to(user.socketId).emit("getMessage", {
                        senderId, text
                    });
                } else {
                    console.log(`Could not find user with id ${receiverId} or user does not have a socketId`);
                }
            });



            //When disconnect
            socket.on("disconnect", () => {
                console.log("a user disconnected!");
                removeUser(socket.id);
                io.emit("getUsers", users)
            })
            //When disconnect with CustomerService
            socket.on("disconnectUser", (userId) => {
                console.log(`Disconnecting user with id ${userId}`);
                const disconnectedSocket = users.find(s => s.userId === userId);
                if (disconnectedSocket) {
                    removeUser(disconnectedSocket.socketId);
                    io.to(`${userId}`).disconnectSockets(true);
                    io.emit("getUsers", users);
                    console.log(`User with id ${userId} disconnected`);
                } else {
                    console.log(`Could not find user with id ${userId}`);
                }
            });


        })
    }
    res.end()
}
export default SocketHandler