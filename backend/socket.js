import User from "./models/user.model.js"
// socket.js backend fix
export const socketHandler = (io) => {
    io.on("connection", (socket) => {
        
        socket.on('identity', async ({ userId }) => {
            try {
                // User ki socket ID save karna aur online mark karna
                await User.findByIdAndUpdate(userId, {
                    socketId: socket.id, 
                    isOnline: true
                });
                console.log(`User ${userId} is online with socket ${socket.id}`);
            } catch (error) {
                console.log("Identity error:", error);
            }
        });

        socket.on("disconnect", async () => {
            try {
                // Socket ID se user find karke offline mark karna
                await User.findOneAndUpdate({ socketId: socket.id }, {
                    isOnline: false,
                    socketId: "" // Optional: clean up socketId
                });
                console.log("A user disconnected");
            } catch (error) {
                console.log("Disconnect error:", error);
            }
        });
    });
}


